import Redis from 'ioredis';
import { env } from './env.config';
import { logger } from './logger.config';

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // required for BullMQ
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    logger.warn(`Redis reconnecting... attempt ${times}`);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err.message);
});

export const disconnectRedis = async (): Promise<void> => {
  await redisClient.quit();
  logger.info('Redis disconnected gracefully');
};
