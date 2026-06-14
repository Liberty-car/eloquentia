import type { Response } from 'express';

// Enveloppe de réponse de succès standardisée : { success: true, data }.
export function sendSuccess<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}
