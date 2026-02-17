import { Queue, Worker, type Processor, type WorkerOptions, type QueueOptions } from 'bullmq';
import { env } from './env.config';

const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

export function createQueue(name: string, opts?: Partial<QueueOptions>): Queue {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions,
    ...opts,
  });
}

export function createWorker<T = unknown>(
  name: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>,
): Worker<T> {
  return new Worker<T>(name, processor, {
    connection: redisConnection,
    ...opts,
  });
}
