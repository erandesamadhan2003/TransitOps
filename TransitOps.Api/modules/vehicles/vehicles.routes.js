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
const documentUpload = makeUploader('vehicles', true).single('document');

// Fleet access: Admin, Fleet Manager, Dispatcher, Financial Analyst
router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.FINANCIAL_ANALYST), listVehiclesRules, handleValidation, vehiclesController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.FINANCIAL_ANALYST), vehiclesController.getOne);

router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), createVehicleRules, handleValidation, vehiclesController.create);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateVehicleRules, handleValidation, vehiclesController.update);

router.patch('/:id/retire', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.retire);
router.patch('/:id/verify', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.verify);
router.post('/:id/photo', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), upload.single('photo'), vehiclesController.uploadPhoto);

router.get('/:id/documents', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.listDocuments);
router.post('/:id/documents', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), documentUpload, vehiclesController.uploadDocument);
router.patch('/:id/documents/:docId/verify', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.verifyDocument);
router.delete('/:id/documents/:docId', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehiclesController.deleteDocument);

export default router;
