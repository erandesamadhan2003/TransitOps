import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/', authenticate, settingsController.getSettings);
router.put('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), settingsController.updateSettings);

export default router;
