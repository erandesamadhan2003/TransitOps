import { Router } from 'express';
import * as authController from './auth.controller.js';
import { registerRules, loginRules } from './auth.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerRules, handleValidation, authController.register);
router.post('/login', loginRules, handleValidation, authController.login);
router.get('/me', authenticate, authController.me);

export default router;
