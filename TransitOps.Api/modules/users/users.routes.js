import { Router } from 'express';
import * as usersController from './users.controller.js';
import { listUsersRules, updateUserRules, changePasswordRules, createUserRules } from './users.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { importUpload } from '../../middlewares/import-upload.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/import-template', authenticate, requireRole(ROLES.ADMIN), usersController.downloadTemplate);
router.post('/import', authenticate, requireRole(ROLES.ADMIN), importUpload.single('file'), usersController.bulkImport);

router.get('/', authenticate, requireRole(ROLES.ADMIN), listUsersRules, handleValidation, usersController.list);
router.post('/', authenticate, requireRole(ROLES.ADMIN), createUserRules, handleValidation, usersController.create);

router.get('/:id', authenticate, requireRole(ROLES.ADMIN), usersController.getOne);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN), updateUserRules, handleValidation, usersController.update);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), usersController.remove);

router.patch('/:id/password', authenticate, changePasswordRules, handleValidation, usersController.changePassword);
router.patch('/:id/deactivate', authenticate, requireRole(ROLES.ADMIN), usersController.deactivate);
router.patch('/:id/activate', authenticate, requireRole(ROLES.ADMIN), usersController.activate);

export default router;
