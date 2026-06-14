import type { Request, Response } from 'express';

// Réponse 404 normalisée pour toute route non gérée.
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { message: 'Ressource introuvable', code: 'NOT_FOUND' },
  });
}
