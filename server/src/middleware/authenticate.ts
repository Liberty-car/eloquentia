import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../lib/ApiError';

// Vérifie le jeton Bearer et attache l'utilisateur à la requête.
// Aucune route de login : les jetons sont émis ailleurs (cf. scripts/mint-token).
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Jeton Bearer manquant');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload !== 'object' || payload === null) {
      throw ApiError.unauthorized('Jeton invalide');
    }

    const { sub, role } = payload as jwt.JwtPayload & { role?: unknown };
    if (!sub || (role !== 'ADMIN' && role !== 'MEMBRE')) {
      throw ApiError.unauthorized('Jeton invalide');
    }

    req.user = { id: String(sub), role };
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized('Jeton invalide ou expiré');
  }
}
