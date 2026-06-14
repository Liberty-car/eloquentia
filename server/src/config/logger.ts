import pino from 'pino';
import { env } from './env';

// Logger applicatif (Pino). Sortie lisible en développement, JSON sinon.
export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        },
      }
    : {}),
});
