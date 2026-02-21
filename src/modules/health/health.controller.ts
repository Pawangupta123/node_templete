import { Request, Response } from 'express';
import { HealthService } from './health.service';
import { sendSuccess } from '../../common/helpers';

const healthService = new HealthService();

export class HealthController {
  static async check(_req: Request, res: Response) {
    const health = await healthService.getHealth();
    sendSuccess(res, health, 'Server is healthy');
  }
}
