import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { apiV1Router } from './api/v1/index';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

// Factory de l'application Express (testable sans démarrer de serveur).
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/api/v1', apiV1Router);

  // Le gestionnaire 404 puis le gestionnaire d'erreurs restent en dernier.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
