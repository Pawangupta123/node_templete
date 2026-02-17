import mongoose from 'mongoose';
import { env } from './env.config';
import { logger } from './logger.config';

export const connectDB = async (): Promise<void> => {
  const connectionString = `${env.MONGODB_URL}/${env.DB_NAME}`;

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    logger.error('MongoDB initial connection failed:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
};
