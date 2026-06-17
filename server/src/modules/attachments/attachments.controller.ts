import type { Request, Response } from 'express';
import { sendSuccess } from '../../lib/sendSuccess';
import { ApiError } from '../../lib/ApiError';
import { attachmentsService } from './attachments.service';
import type { EntityType } from './attachments.schemas';

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentification requise');
  return req.user;
}

export async function signUpload(req: Request, res: Response): Promise<void> {
  const result = await attachmentsService.sign(req.body);
  sendSuccess(res, result);
}

export async function createAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireUser(req);
  const created = await attachmentsService.create(req.body, user.id);
  sendSuccess(res, created, 201);
}

export async function listAttachments(
  req: Request,
  res: Response,
): Promise<void> {
  // validate() a déjà vérifié les types via listQuerySchema. Express 5 ne
  // permet pas de réécrire req.query, d'où le cast via unknown.
  const query = req.query as unknown as {
    entityType: EntityType;
    entityId: string;
  };
  const items = await attachmentsService.list(query.entityType, query.entityId);
  sendSuccess(res, items);
}

export async function getDownloadUrl(
  req: Request,
  res: Response,
): Promise<void> {
  // validate() a déjà vérifié le type via idParamsSchema. Cast nécessaire car
  // ParamsDictionary retourne string | string[] en strict mode.
  const { id } = req.params as unknown as { id: string };
  const result = await attachmentsService.getDownloadUrl(id);
  sendSuccess(res, result);
}

export async function removeAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireUser(req);
  // validate() a déjà vérifié le type via idParamsSchema.
  const { id } = req.params as unknown as { id: string };
  await attachmentsService.remove(id, user);
  sendSuccess(res, { deleted: true });
}
