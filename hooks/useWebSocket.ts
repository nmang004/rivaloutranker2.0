"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

export interface WebSocketMessage {
  type: 'audit_progress' | 'audit_complete' | 'audit_error' | 'connection' | 'heartbeat'
  data: any
  timestamp: string
  auditId?: string
}

export interface AuditProgress {
  auditId: string
  currentStep: number
  totalSteps: number
  stepName: string
  stepProgress: number
  overallProgress: number
  message: string
  factorsAnalyzed: number
  totalFactors: number
}

interface UseWebSocketOptions {
  url?: string
  autoReconnect?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 
         (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
           ? 'ws://localhost:3001/ws' 
           : null), // Disable WebSocket in production if no URL provided
    autoReconnect = true,
    maxReconnectAttempts = 3, // Reduced attempts
    reconnectDelay = 5000 // Increased delay
  } = options

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const messageListeners = useRef<Map<string, ((message: WebSocketMessage) => void)[]>>(new Map())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    // Skip connection if no URL provided
    if (!url) {
      console.log('WebSocket URL not provided, skipping connection')
      return
    }
    
    try {
      console.log('Attempting WebSocket connection to:', url)
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        setIsConnected(true)
        setConnectionError(null)
        setReconnectAttempts(0)
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            }))
          }
        }, 30000) // Send heartbeat every 30 seconds
        
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          
          // Notify listeners
          const listeners = messageListeners.current.get(message.type) || []
          listeners.forEach(listener => listener(message))
          
          // Also notify global listeners
          const globalListeners = messageListeners.current.get('*') || []
          globalListeners.forEach(listener => listener(message))
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        setSocket(null)
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
        }

        if (autoReconnect && reconnectAttempts < maxReconnectAttempts && !event.wasClean && url) {
          setReconnectAttempts(prev => prev + 1)
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${maxReconnectAttempts})`)
            connect()
          }, reconnectDelay)
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.log('Max reconnection attempts reached, giving up')
          setConnectionError('Unable to establish WebSocket connection')
        }
        
        console.log('WebSocket disconnected')
      }

      ws.onerror = (error) => {
        setConnectionError('WebSocket connection failed')
        console.error('WebSocket error:', error)
      }

      setSocket(ws)
    } catch (error) {
      setConnectionError('Failed to create WebSocket connection')
      console.error('WebSocket creation error:', error)
    }
  }, [url, autoReconnect, maxReconnectAttempts, reconnectDelay, reconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    if (socket) {
      socket.close(1000, 'Manual disconnect')
    }
  }, [socket])

  const sendMessage = useCallback((message: Partial<WebSocketMessage>) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        timestamp: new Date().toISOString(),
        ...message
      } as WebSocketMessage
      
      socket.send(JSON.stringify(fullMessage))
      return true
    }
    return false
  }, [socket])

  const subscribe = useCallback((
    messageType: string, 
    callback: (message: WebSocketMessage) => void
  ) => {
    const listeners = messageListeners.current.get(messageType) || []
    listeners.push(callback)
    messageListeners.current.set(messageType, listeners)

    // Return unsubscribe function
    return () => {
      const currentListeners = messageListeners.current.get(messageType) || []
      const filteredListeners = currentListeners.filter(listener => listener !== callback)
      if (filteredListeners.length > 0) {
        messageListeners.current.set(messageType, filteredListeners)
      } else {
        messageListeners.current.delete(messageType)
      }
    }
  }, [])

  // Subscribe to audit progress updates
  const subscribeToAuditProgress = useCallback((
    auditId: string,
    callback: (progress: AuditProgress) => void
  ) => {
    return subscribe('audit_progress', (message) => {
      if (message.auditId === auditId) {
        callback(message.data as AuditProgress)
      }
    })
  }, [subscribe])

  // Subscribe to audit completion
  const subscribeToAuditComplete = useCallback((
    auditId: string,
    callback: (result: any) => void
  ) => {
    return subscribe('audit_complete', (message) => {
      if (message.auditId === auditId) {
        callback(message.data)
      }
    })
  }, [subscribe])

  // Subscribe to audit errors
  const subscribeToAuditError = useCallback((
    auditId: string,
    callback: (error: any) => void
  ) => {
    return subscribe('audit_error', (message) => {
      if (message.auditId === auditId) {
        callback(message.data)
      }
    })
  }, [subscribe])

  // Connect on mount only if URL is provided
  useEffect(() => {
    if (url) {
      connect()
    } else {
      console.log('WebSocket disabled: No URL provided')
    }
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect, url])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
    }
  }, [])

  return {
    socket,
    isConnected,
    lastMessage,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    subscribeToAuditProgress,
    subscribeToAuditComplete,
    subscribeToAuditError
  }
}