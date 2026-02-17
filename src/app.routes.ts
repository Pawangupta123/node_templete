import { Router } from 'express';
import { healthRoutes } from './modules/health';

const router = Router();

// --- Module Routes ---
router.use(healthRoutes);
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

export default router;
