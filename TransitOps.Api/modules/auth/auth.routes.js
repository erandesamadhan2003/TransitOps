import { Router } from 'express';
import * as authController from './auth.controller.js';
import { registerRules, loginRules } from './auth.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate, optionalAuthenticate } from '../../middlewares/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many requests, please try again later.' }
});

const router = Router();

// POST /register allows an unauthenticated request ONLY if the users table is completely empty (Bootstrap mode).
// Otherwise, the service layer will enforce that the requester is authenticated and has the Admin role.
router.post('/register', authLimiter, optionalAuthenticate, registerRules, handleValidation, authController.register);
router.post('/login', authLimiter, loginRules, handleValidation, authController.login);
router.get('/me', authenticate, authController.me);

export default router;
