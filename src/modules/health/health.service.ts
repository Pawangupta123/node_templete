import mongoose from 'mongoose';
import { redisClient } from '../../config/redis.config';

export class HealthService {
  async getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        mongodb: this.getMongoStatus(),
        redis: this.getRedisStatus(),
      },
    };
  }

  private getMongoStatus(): string {
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  private getRedisStatus(): string {
    return redisClient.status;
  }
}
