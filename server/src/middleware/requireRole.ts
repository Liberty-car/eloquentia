import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../lib/ApiError';

type Role = 'ADMIN' | 'MEMBRE';

// Restreint l'accès aux rôles indiqués. À utiliser après authenticate.
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentification requise');
    }
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('Accès refusé');
    }
    next();
  };
}
