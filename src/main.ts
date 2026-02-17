import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.config';
import { logger, morganStream } from './config/logger.config';
import { connectDB, disconnectDB } from './config/db.config';
import { disconnectRedis } from './config/redis.config';
import { corsOptions } from './config/cors.config';
import { rateLimiter } from './config/rate-limit.config';
import { mountSwagger } from './api-docs';
import { errorHandler, notFoundHandler } from './common/middleware/error-handler';
import appRoutes from './app.routes';

const app = express();

// --- Middlewares ---
app.use(helmet());
if (env.ENABLE_COMPRESSION) {
  app.use(compression());
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev', { stream: morganStream }));
app.use(rateLimiter);

// --- Swagger ---
if (env.ENABLE_SWAGGER) {
  mountSwagger(app);
}

// --- Module Routes ---
app.use('/api/v1', appRoutes);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Server Start ---
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      if (env.ENABLE_SWAGGER) {
        logger.info(`Swagger docs at http://localhost:${env.PORT}/api-docs`);
      }
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        await disconnectRedis();
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
