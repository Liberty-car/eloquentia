import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`API Eloquentia démarrée sur http://localhost:${env.PORT}`);
});

// Arrêt propre du serveur (utile sur Railway / SIGTERM).
function shutdown(signal: string): void {
  logger.info(`${signal} reçu, arrêt en cours...`);
  server.close(() => {
    logger.info('Serveur arrêté.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
