import type { Request, Response } from 'express';
import { sendSuccess } from '../../lib/sendSuccess';
import { getHealthStatus } from './health.service';

// Controller : orchestre la requête/réponse en s'appuyant sur le service.
export function healthCheck(_req: Request, res: Response): void {
  sendSuccess(res, getHealthStatus());
}
