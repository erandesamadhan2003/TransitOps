import { Router } from 'express';
import * as fuelController from './fuel.controller.js';
import { listFuelLogsRules, createFuelLogRules } from './fuel.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/', authenticate, listFuelLogsRules, handleValidation, fuelController.list);
router.get('/:id', authenticate, fuelController.getOne);

router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FLEET_MANAGER), createFuelLogRules, handleValidation, fuelController.create);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), fuelController.remove);

export default router;
