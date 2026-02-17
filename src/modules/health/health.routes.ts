import { Router } from 'express';
import { HealthController } from './health.controller';

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
router.get('/health', HealthController.check);

export default router;
