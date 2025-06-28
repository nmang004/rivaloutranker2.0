import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Extend WebSocket interface to include custom properties
interface ExtendedWebSocket extends WebSocket {
  auditId?: string;
}

// Load environment variables
config();

// Import Phase 4 services
import { redisService } from './services/cache/redis.service';
import { bullQueueService, ScheduledJobs } from './services/queue/bull-queue.service';
import { connectionPoolService } from './services/database/connection-pool.service';
import { enterpriseSecurityService } from './services/security/enterprise-security.service';

// Import middleware
import { cacheMiddleware, getCacheStats } from './middleware/cache.middleware';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import { authMiddleware } from './middleware/auth';

// Import routes
import apiRoutes from './routes/index';

const app = express();
const server = createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://rivaloutranker2.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Advanced threat detection and security
app.use(enterpriseSecurityService.threatDetectionMiddleware());

// Enterprise-grade rate limiting
app.use('/api/', enterpriseSecurityService.advancedRateLimiting({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: process.env.NODE_ENV === 'production' ? 100 : 1000
}));

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Enhanced health check endpoint with Phase 4 services
app.get('/health', async (req, res) => {
  try {
    // Check all Phase 4 services
    const [dbHealth, redisConnected, queueStats] = await Promise.all([
      connectionPoolService.healthCheck(),
      redisService.isConnected(),
      bullQueueService.getAllQueueStats()
    ]);

    const status = dbHealth.status === 'healthy' && redisConnected ? 'healthy' : 'degraded';

    res.json({
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth,
        redis: {
          connected: redisConnected,
          stats: redisService.getStats()
        },
        queues: queueStats
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service health check failed'
    });
  }
});

// Cache statistics endpoint
app.get('/api/admin/cache-stats', authMiddleware, getCacheStats);

// Security dashboard endpoint
app.get('/api/admin/security-dashboard', authMiddleware, async (req, res) => {
  try {
    const dashboard = await enterpriseSecurityService.getSecurityDashboard();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get security dashboard' });
  }
});

// API routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// WebSocket handling for real-time updates
wss.on('connection', (ws: ExtendedWebSocket, req) => {
  console.log('[WebSocket] New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('[WebSocket] Received:', data);
      
      // Handle different message types
      switch (data.type) {
        case 'subscribe_audit':
          // Subscribe to audit updates
          ws.auditId = data.auditId;
          ws.send(JSON.stringify({
            type: 'subscribed',
            auditId: data.auditId
          }));
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        default:
          console.log('[WebSocket] Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('[WebSocket] Connection error:', error);
  });
});

// Broadcast audit progress to connected clients
export function broadcastAuditProgress(auditId: string, progress: {
  status: string;
  progress: number;
  message?: string;
  data?: any;
}) {
  const message = JSON.stringify({
    type: 'audit_progress',
    auditId,
    ...progress
  });
  
  wss.clients.forEach((client) => {
    const extendedClient = client as ExtendedWebSocket;
    if (extendedClient.readyState === extendedClient.OPEN && extendedClient.auditId === auditId) {
      extendedClient.send(message);
    }
  });
}

// Initialize Phase 4 services
async function initializeServices() {
  try {
    console.log('[Server] Initializing Phase 4 services...');
    
    // Initialize services in order
    await redisService.connect();
    console.log('[Server] ✓ Redis cache service initialized');
    
    await connectionPoolService.initialize();
    console.log('[Server] ✓ Database connection pool initialized');
    
    await bullQueueService.initialize();
    console.log('[Server] ✓ Bull Queue service initialized');
    
    // Schedule background jobs
    await ScheduledJobs.scheduleDailyCleanup();
    await ScheduledJobs.scheduleCacheWarming();
    await ScheduledJobs.scheduleReportCleanup();
    console.log('[Server] ✓ Scheduled background jobs initialized');
    
    console.log('[Server] All Phase 4 services initialized successfully');
  } catch (error) {
    console.error('[Server] Failed to initialize Phase 4 services:', error);
    process.exit(1);
  }
}

// Graceful shutdown with Phase 4 cleanup
async function gracefulShutdown(signal: string) {
  console.log(`[Server] ${signal} received, shutting down gracefully`);
  
  try {
    // Close server first to stop accepting new connections
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    
    // Shutdown Phase 4 services
    await bullQueueService.shutdown();
    console.log('[Server] ✓ Bull Queue service closed');
    
    await connectionPoolService.shutdown();
    console.log('[Server] ✓ Database connection pool closed');
    
    await redisService.disconnect();
    console.log('[Server] ✓ Redis service disconnected');
    
    console.log('[Server] Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('[Server] Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server with Phase 4 initialization
async function startServer() {
  try {
    // Initialize Phase 4 services first
    await initializeServices();
    
    // Start HTTP server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`[Server] Rival Outranker 2.0 API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] WebSocket server running for real-time updates`);
      console.log(`[Server] Phase 4: Performance & Scale - ACTIVE`);
      console.log(`[Server] ✓ Redis caching enabled`);
      console.log(`[Server] ✓ Bull Queue background processing enabled`);
      console.log(`[Server] ✓ Enterprise security features enabled`);
      console.log(`[Server] ✓ Database connection pooling enabled`);
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export { app, server, wss };