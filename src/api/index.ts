import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import parcelRoutes from './routes/parcels';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/parcels', parcelRoutes);

export default router;
