import { Router } from 'express';
import * as tripsController from './trips.controller.js';
import { listTripsRules, createTripRules, completeTripRules } from './trips.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/', authenticate, listTripsRules, handleValidation, tripsController.list);
router.get('/:id', authenticate, tripsController.getOne);

// Dispatcher endpoints (Spec's 'Driver' persona)
router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER), createTripRules, handleValidation, tripsController.create);
router.patch('/:id/dispatch', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER), tripsController.dispatchTrip);
router.patch('/:id/complete', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER), completeTripRules, handleValidation, tripsController.complete);
router.patch('/:id/cancel', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER), tripsController.cancel);

export default router;
