import { Router } from 'express';
import * as fuelController from './fuel.controller.js';
import { listFuelLogsRules, createFuelLogRules } from './fuel.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

// Financial Analyst + Fleet Manager + Admin can read fuel logs
router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), listFuelLogsRules, handleValidation, fuelController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), fuelController.getOne);

router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FLEET_MANAGER), createFuelLogRules, handleValidation, fuelController.create);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), fuelController.remove);

export default router;
