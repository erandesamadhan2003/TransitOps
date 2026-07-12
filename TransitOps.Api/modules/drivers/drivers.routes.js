import { Router } from 'express';
import * as driversController from './drivers.controller.js';
import { listDriversRules, createDriverRules, updateDriverRules, updateSafetyScoreRules } from './drivers.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { makeUploader } from '../../middlewares/upload.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();
const upload = makeUploader('drivers');
const documentUpload = makeUploader('drivers', true).single('document');

// Fleet Manager + Safety Officer + Admin can read drivers
router.get('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), listDriversRules, handleValidation, driversController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), driversController.getOne);

// Profile Management (Fleet Manager & Safety Officer)
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), createDriverRules, handleValidation, driversController.create);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), updateDriverRules, handleValidation, driversController.update);
router.post('/:id/photo', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), upload.single('photo'), driversController.uploadPhoto);

// Compliance and Safety (Safety Officer)
router.patch('/:id/safety-score', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), updateSafetyScoreRules, handleValidation, driversController.updateSafetyScore);
router.patch('/:id/suspend', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), driversController.suspend);
router.patch('/:id/reinstate', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), driversController.reinstate);

// Documents
router.get('/:id/documents', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), driversController.listDocuments);
router.post('/:id/documents', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), documentUpload, driversController.uploadDocument);
router.delete('/:id/documents/:docId', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), driversController.deleteDocument);

export default router;
