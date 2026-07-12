import { Router } from 'express';
import * as maintenanceController from './maintenance.controller.js';
import { listMaintenanceRules, createMaintenanceRules, closeMaintenanceRules } from './maintenance.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

// Fleet access: Admin, Fleet Manager, Dispatcher, Financial Analyst
router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.FINANCIAL_ANALYST), listMaintenanceRules, handleValidation, maintenanceController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.FINANCIAL_ANALYST), maintenanceController.getOne);

// Fleet Manager endpoints
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), createMaintenanceRules, handleValidation, maintenanceController.create);
router.patch('/:id/close', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), closeMaintenanceRules, handleValidation, maintenanceController.close);

export default router;
