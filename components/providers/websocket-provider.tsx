"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWebSocket, WebSocketMessage, AuditProgress } from '@/hooks/useWebSocket'
import { toast } from 'sonner'

interface WebSocketContextType {
  isConnected: boolean
  connectionError: string | null
  lastMessage: WebSocketMessage | null
  sendMessage: (message: Partial<WebSocketMessage>) => boolean
  subscribe: (messageType: string, callback: (message: WebSocketMessage) => void) => () => void
  subscribeToAuditProgress: (auditId: string, callback: (progress: AuditProgress) => void) => () => void
  subscribeToAuditComplete: (auditId: string, callback: (result: any) => void) => () => void
  subscribeToAuditError: (auditId: string, callback: (error: any) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [hasShownConnectionError, setHasShownConnectionError] = useState(false)
  const [hasShownConnectionSuccess, setHasShownConnectionSuccess] = useState(false)

  const {
    isConnected,
    connectionError,
    lastMessage,
    sendMessage,
    subscribe,
    subscribeToAuditProgress,
    subscribeToAuditComplete,
    subscribeToAuditError
  } = useWebSocket({
    autoReconnect: true,
    maxReconnectAttempts: 3,
    reconnectDelay: 5000
  })

  // Show connection status notifications (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isConnected && !hasShownConnectionSuccess) {
      toast.success('Connected to real-time updates', {
        description: 'You\'ll receive live progress updates for your audits',
        duration: 3000
      })
      setHasShownConnectionSuccess(true)
      setHasShownConnectionError(false)
    }
  }, [isConnected, hasShownConnectionSuccess])

  useEffect(() => {
    // Only show error if we're actually trying to connect (development or if WS URL is provided)
    if (connectionError && !hasShownConnectionError && process.env.NEXT_PUBLIC_WS_URL) {
      toast.error('Connection lost', {
        description: 'Real-time updates unavailable. Will retry in background.',
        duration: 3000
      })
      setHasShownConnectionError(true)
    }
  }, [connectionError, hasShownConnectionError])

  // Handle global audit notifications
  useEffect(() => {
    const unsubscribeComplete = subscribe('audit_complete', (message) => {
      if (message.auditId) {
        toast.success('SEO Audit Completed!', {
          description: `Your audit for ${message.data?.url || 'the website'} is ready to view`,
          action: {
            label: 'View Results',
            onClick: () => window.location.href = `/results/${message.auditId}`
          },
          duration: 10000
        })
      }
    })

    const unsubscribeError = subscribe('audit_error', (message) => {
      if (message.auditId) {
        toast.error('Audit Failed', {
          description: message.data?.error || 'An error occurred during the audit process',
          duration: 8000
        })
      }
    })

    return () => {
      unsubscribeComplete()
      unsubscribeError()
    }
  }, [subscribe])

  const contextValue: WebSocketContextType = {
    isConnected,
    connectionError,
    lastMessage,
    sendMessage,
    subscribe,
    subscribeToAuditProgress,
    subscribeToAuditComplete,
    subscribeToAuditError
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}