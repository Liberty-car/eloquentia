import { Router } from 'express';
import { healthRouter } from '../../modules/health/health.routes';

// Routeur racine de l'API v1. Il monte les sous-routeurs de chaque module.
export const apiV1Router = Router();

// Module vivant (référence du pattern de réponse).
apiV1Router.use('/health', healthRouter);

// Les modules métier sont créés mais NON montés tant qu'ils sont vides
// (fondations sans feature). Pour activer un module, définir ses routes
// puis le monter ici, par exemple :
//
//   import { partnersRouter } from '../../modules/partners/partners.routes';
//   apiV1Router.use('/partners', partnersRouter);
