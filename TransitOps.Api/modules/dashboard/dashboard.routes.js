import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

// No requireRole on these endpoints - every authenticated role sees the same aggregate data payload.
router.get('/kpis', authenticate, dashboardController.kpis);
router.get('/charts', authenticate, dashboardController.charts);
router.get('/analytics', authenticate, dashboardController.analytics);

export default router;
