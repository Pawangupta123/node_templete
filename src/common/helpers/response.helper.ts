import { Response } from 'express';

/**
 * Standardized API Response Helper
 * Backward compatible: { success, message, data }
 * Har controller isko use karega — format kabhi inconsistent nahi hoga
 *
 * Usage:
 *   sendSuccess(res, user, 'User fetched');
 *   sendSuccess(res, user, 'Created', 201);
 *   sendError(res, 'Not found', 404);
 *   sendPaginated(res, records, pagination);
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: Record<string, string> | string[],
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

export function sendPaginated<T>(res: Response, data: T[], pagination: PaginationMeta, message = 'Success'): void {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}
