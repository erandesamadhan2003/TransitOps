import { Router } from 'express';
import * as vehiclesController from './vehicles.controller.js';
import { listVehiclesRules, createVehicleRules, updateVehicleRules } from './vehicles.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { makeUploader } from '../../middlewares/upload.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();
const upload = makeUploader('vehicles');

router.get('/', authenticate, listVehiclesRules, handleValidation, vehiclesController.list);
router.get('/:id', authenticate, vehiclesController.getOne);

router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), createVehicleRules, handleValidation, vehiclesController.create);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateVehicleRules, handleValidation, vehiclesController.update);

router.patch('/:id/retire', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.retire);
router.post('/:id/photo', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), upload.single('photo'), vehiclesController.uploadPhoto);

export default router;
