import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Zod Validation Middleware Factory
 * Route level pe validate — controller ko validation ka pata hi nahi
 * Validated data req.body mein replace ho jaata hai (trimmed, coerced, defaults applied)
 *
 * Usage (in routes):
 *   router.post('/register', validate(RegisterDto), catchAsync(controller.register));
 *   router.get('/list', validate(ListQueryDto, 'query'), catchAsync(controller.list));
 *   router.get('/:id', validate(ParamsDto, 'params'), catchAsync(controller.getById));
 */
type Source = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: Source = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Replace with parsed data (trimmed strings, applied defaults, coerced types)
    req[source] = result.data;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    formatted[key] = issue.message;
  }
  return formatted;
}
