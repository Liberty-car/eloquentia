import { z } from 'zod';
import { env } from '../../config/env';

// Liste fermée des types d'entités auxquelles on peut attacher un fichier.
export const ENTITY_TYPES = ['task', 'event', 'mouvement', 'contact'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// Liste blanche des types MIME autorisés.
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'application/zip',
] as const;

const entityType = z.enum(ENTITY_TYPES);
const mimeType = z.enum(ALLOWED_MIME_TYPES);
const sizeBytes = z.number().int().positive().max(env.ATTACHMENTS_MAX_BYTES);
const fileName = z.string().min(1).max(255);
// L'identifiant d'entite est borne aux caracteres des ids reels (cuid ou id
// localStorage : alphanumeriques, tiret, underscore). Cela empeche toute
// tentative de traversee de chemin (ex. « abc/../mouvement ») dans le chemin
// de stockage construit cote serveur.
const entityId = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, 'entityId invalide');

export const signBodySchema = z.object({
  entityType,
  entityId,
  fileName,
  mimeType,
  sizeBytes,
});

export const createBodySchema = signBodySchema.extend({
  storagePath: z.string().min(1),
});

export const listQuerySchema = z.object({
  entityType,
  entityId,
});

export const idParamsSchema = z.object({
  id: z.string().min(1),
});

// Helpers purs ------------------------------------------------------------

// Rend un nom de fichier sûr pour un chemin de stockage.
// Neutralise les tentatives de traversée de chemin (e.g. ../../etc/passwd)
// en supprimant les composants vides, '.' et '..' puis en joignant les
// segments restants avec un tiret avant d'appliquer la sanitisation des chars.
export function sanitizeFileName(name: string): string {
  const segments = name
    .split(/[/\\]/)
    .filter((s) => s !== '' && s !== '.' && s !== '..');
  const joined = segments.join('-');
  return joined.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+/, '');
}

// Compose le chemin de l'objet : <type>/<id>/<cuid>-<nom assaini>.
export function buildStoragePath(
  entityType: string,
  entityId: string,
  cuid: string,
  originalName: string,
): string {
  return `${entityType}/${entityId}/${cuid}-${sanitizeFileName(originalName)}`;
}

// Vérifie qu'un chemin appartient bien au préfixe attendu (anti-falsification).
export function storagePathMatches(
  storagePath: string,
  entityType: string,
  entityId: string,
): boolean {
  return storagePath.startsWith(`${entityType}/${entityId}/`);
}
