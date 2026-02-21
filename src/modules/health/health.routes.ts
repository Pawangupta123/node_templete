import { Router } from 'express';
import { HealthController } from './health.controller';
import { catchAsync } from '../../common/helpers';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/health', catchAsync(HealthController.check));

export default router;
