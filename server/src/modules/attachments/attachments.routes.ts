import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import {
  createAttachment,
  getDownloadUrl,
  listAttachments,
  removeAttachment,
  signUpload,
} from './attachments.controller';
import {
  createBodySchema,
  idParamsSchema,
  listQuerySchema,
  signBodySchema,
} from './attachments.schemas';

// Module "attachments" : pièces jointes génériques. Toutes les routes exigent
// un jeton Bearer valide. Les octets ne transitent jamais par ce serveur :
// ils vont directement sur Supabase via une URL signée.
export const attachmentsRouter = Router();

attachmentsRouter.use(authenticate);

attachmentsRouter.post('/sign', validate({ body: signBodySchema }), signUpload);
attachmentsRouter.post(
  '/',
  validate({ body: createBodySchema }),
  createAttachment,
);
attachmentsRouter.get(
  '/',
  validate({ query: listQuerySchema }),
  listAttachments,
);
attachmentsRouter.get(
  '/:id/url',
  validate({ params: idParamsSchema }),
  getDownloadUrl,
);
attachmentsRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  removeAttachment,
);
