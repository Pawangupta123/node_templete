import { Request, Response, NextFunction } from 'express';

/**
 * Async error wrapper — controllers mein try-catch ki zarurat nahi
 * Errors automatically next() ke through error-handler tak pahunchte hain
 *
 * Usage (in routes):
 *   router.get('/', catchAsync(controller.list));
 *   router.post('/', validate(CreateDto), catchAsync(controller.create));
 */
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function catchAsync(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
