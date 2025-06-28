/**
 * Logger Service
 * Centralized logging for the application
 * Part of Phase 4: Performance & Scale
 */

export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: string;
  metadata?: any;
}

class LoggerService {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel = process.env.LOG_LEVEL || 'info';

  private formatMessage(level: string, message: string, context?: string, metadata?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    
    return `${timestamp} [${level.toUpperCase()}] ${contextStr} ${message}${metadataStr}`;
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    
    return messageIndex <= currentIndex;
  }

  error(message: string, context?: string, metadata?: any): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context, metadata));
    }
  }

  warn(message: string, context?: string, metadata?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context, metadata));
    }
  }

  info(message: string, context?: string, metadata?: any): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context, metadata));
    }
  }

  debug(message: string, context?: string, metadata?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context, metadata));
    }
  }

  log(level: string, message: string, context?: string, metadata?: any): void {
    switch (level) {
      case 'error':
        this.error(message, context, metadata);
        break;
      case 'warn':
        this.warn(message, context, metadata);
        break;
      case 'info':
        this.info(message, context, metadata);
        break;
      case 'debug':
        this.debug(message, context, metadata);
        break;
      default:
        this.info(message, context, metadata);
    }
  }
}

export const logger = new LoggerService();