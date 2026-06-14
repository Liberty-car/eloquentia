import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../lib/ApiError';
import { logger } from '../config/logger';

// Gestionnaire d'erreurs central : transforme toute erreur en réponse
// { success: false, error: { message, code?, details? } }.
// Doit rester déclaré en dernier (signature à 4 arguments d'Express).
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Données invalides',
        code: 'VALIDATION_ERROR',
        details: err.flatten(),
      },
    });
    return;
  }

  logger.error({ err }, 'Erreur non gérée');
  res.status(500).json({
    success: false,
    error: { message: 'Erreur interne du serveur', code: 'INTERNAL_ERROR' },
  });
};
