import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger.config';
import { AppError, NotFoundError } from '../errors';
import { env } from '../../config/env.config';

/**
 * 404 handler — unknown routes ke liye
 * App ke last mein mount hota hai (after all routes)
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Global error handler — sab errors yahan aate hain
 * Operational errors (AppError) → user-friendly message
 * Unknown errors → generic 500 (details leak nahi hoti)
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const isOperational = err instanceof AppError;
  const statusCode = isOperational ? err.statusCode : 500;
  const message = isOperational ? err.message : 'Internal Server Error';

  // Log all errors — operational = warn, unknown = error
  if (isOperational) {
    logger.warn(`[${statusCode}] ${err.message}`);
  } else {
    logger.error(`[${statusCode}] ${err.message}`, { stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
