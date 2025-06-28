import { Router } from 'express';
import analysisRoutes from './analysis';
import auditRoutes from './audit';
import authRoutes from './auth';
import userRoutes from './users';
import projectRoutes from './projects';
import dashboardRoutes from './dashboard';
import adminRoutes from './admin';

const router = Router();

// API version and info
router.get('/', (req, res) => {
  res.json({
    name: 'Rival Outranker 2.0 API',
    version: '2.0.0',
    description: 'Next-generation SEO analysis and audit platform with Phase 4: Performance & Scale',
    phase: 'Phase 4: Performance & Scale - ACTIVE',
    features: {
      caching: 'Redis-powered response caching',
      queues: 'Bull Queue background processing',
      security: 'Enterprise security with SOC 2 compliance',
      monitoring: 'Real-time performance monitoring',
      webhooks: 'Third-party integration webhooks'
    },
    endpoints: {
      '/analysis': 'SEO analysis endpoints (50+ factors)',
      '/audit': 'Professional audit endpoints (140+ factors)',
      '/auth': 'Authentication endpoints',
      '/users': 'User management endpoints',
      '/projects': 'Project management endpoints',
      '/dashboard': 'Executive dashboard and KPI tracking endpoints',
      '/admin': 'Phase 4 admin and monitoring endpoints (admin only)'
    }
  });
});

// Mount route modules
router.use('/analysis', analysisRoutes);
router.use('/audit', auditRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);

export default router;