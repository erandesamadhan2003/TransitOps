import { Router } from 'express';
import * as expensesController from './expenses.controller.js';
import { listExpensesRules, createExpenseRules } from './expenses.validation.js';
import { handleValidation } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

router.get('/', authenticate, listExpensesRules, handleValidation, expensesController.list);
router.get('/:id', authenticate, expensesController.getOne);

router.post('/', authenticate, requireRole(ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FLEET_MANAGER), createExpenseRules, handleValidation, expensesController.create);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), expensesController.remove);

export default router;
