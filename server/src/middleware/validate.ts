import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import { ApiError } from '../lib/ApiError';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

// Valide la requête via des schémas Zod. À placer en amont d'un controller.
// Note Express 5 : req.query et req.params sont en lecture seule, on ne peut
// donc pas les réécrire. Le body, lui, est réassigné avec la valeur parsée.
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw ApiError.badRequest('Données invalides', {
          code: 'VALIDATION_ERROR',
          details: error.flatten(),
        });
      }
      throw error;
    }
  };
}
