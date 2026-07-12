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

router.get('/', authenticate, listDriversRules, handleValidation, driversController.list);
router.get('/:id', authenticate, driversController.getOne);

// Profile Management (Fleet Manager)
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), createDriverRules, handleValidation, driversController.create);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateDriverRules, handleValidation, driversController.update);
router.post('/:id/photo', authenticate, requireRole(ROLES.ADMIN, ROLES.FLEET_MANAGER), upload.single('photo'), driversController.uploadPhoto);

// Compliance and Safety (Safety Officer)
router.patch('/:id/safety-score', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), updateSafetyScoreRules, handleValidation, driversController.updateSafetyScore);
router.patch('/:id/suspend', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), driversController.suspend);
router.patch('/:id/reinstate', authenticate, requireRole(ROLES.ADMIN, ROLES.SAFETY_OFFICER), driversController.reinstate);

export default router;
