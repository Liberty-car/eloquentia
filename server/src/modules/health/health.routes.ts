import { Router } from 'express';
import { healthCheck } from './health.controller';

// Seul module "vivant" pour l'instant : sert de référence du pattern
// route -> controller -> service (sans accès base de données).
export const healthRouter = Router();

healthRouter.get('/', healthCheck);
