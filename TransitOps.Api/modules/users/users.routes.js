import { Router } from 'express';
import * as usersController from './users.controller.js';
import { listUsersRules, updateUserRules, changePasswordRules } from './users.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ADMIN), listUsersRules, handleValidation, usersController.list);
router.get('/:id', authenticate, requireRole(ROLES.ADMIN), usersController.getOne);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN), updateUserRules, handleValidation, usersController.update);
router.patch('/:id/password', authenticate, changePasswordRules, handleValidation, usersController.changePassword);
router.patch('/:id/deactivate', authenticate, requireRole(ROLES.ADMIN), usersController.deactivate);
router.patch('/:id/activate', authenticate, requireRole(ROLES.ADMIN), usersController.activate);

export default router;
