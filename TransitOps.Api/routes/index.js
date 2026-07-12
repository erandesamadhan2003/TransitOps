import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import vehiclesRoutes from '../modules/vehicles/vehicles.routes.js';
import driversRoutes from '../modules/drivers/drivers.routes.js';
import tripsRoutes from '../modules/trips/trips.routes.js';
import maintenanceRoutes from '../modules/maintenance/maintenance.routes.js';
import fuelRoutes from '../modules/fuel/fuel.routes.js';
import expensesRoutes from '../modules/expenses/expenses.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import settingsRoutes from '../modules/settings/settings.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);
router.use('/trips', tripsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel-logs', fuelRoutes);
router.use('/expenses', expensesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);

export default router;
