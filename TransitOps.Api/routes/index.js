import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import vehiclesRoutes from '../modules/vehicles/vehicles.routes.js';
import driversRoutes from '../modules/drivers/drivers.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);

export default router;
