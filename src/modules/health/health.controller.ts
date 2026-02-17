import { Request, Response, NextFunction } from 'express';
import { HealthService } from './health.service';

const healthService = new HealthService();

export class HealthController {
  static async check(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await healthService.getHealth();
      res.json(health);
    } catch (error) {
      next(error);
    }
  }
}
