import { randomUUID } from 'node:crypto';
import { ApiError } from '../../lib/ApiError';
import {
  createSignedDownloadUrl,
  createSignedUploadUrl,
  removeObject,
} from '../../services/supabase';
import { attachmentsRepository } from './attachments.repository';
import {
  buildStoragePath,
  storagePathMatches,
  type EntityType,
} from './attachments.schemas';

interface SignInput {
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

interface CreateInput extends SignInput {
  storagePath: string;
}

interface CurrentUser {
  id: string;
  role: 'ADMIN' | 'MEMBRE';
}

export const attachmentsService = {
  // Demande une URL signée pour l'upload direct vers Supabase Storage.
  // Construit le chemin de stockage côté serveur pour éviter toute falsification.
  async sign(input: SignInput) {
    const path = buildStoragePath(
      input.entityType,
      input.entityId,
      randomUUID(),
      input.fileName,
    );
    const signed = await createSignedUploadUrl(path);
    // On renvoie le chemin qu'on a construit (pas signed.path qui peut différer).
    return {
      uploadUrl: signed.signedUrl,
      token: signed.token,
      storagePath: path,
    };
  },

  // Persiste les métadonnées après que le client a uploadé le fichier.
  // Vérifie que le storagePath appartient bien à l'entité déclarée (anti-falsification).
  async create(input: CreateInput, userId: string) {
    if (
      !storagePathMatches(input.storagePath, input.entityType, input.entityId)
    ) {
      throw ApiError.badRequest('Chemin de stockage incohérent');
    }
    return attachmentsRepository.create({
      entityType: input.entityType,
      entityId: input.entityId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      storagePath: input.storagePath,
      uploadedById: userId,
    });
  },

  // Liste les pièces jointes d'une entité.
  list(entityType: EntityType, entityId: string) {
    return attachmentsRepository.listByEntity(entityType, entityId);
  },

  // Génère une URL de téléchargement signée à durée limitée.
  async getDownloadUrl(id: string) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Pièce jointe introuvable');
    const url = await createSignedDownloadUrl(found.storagePath);
    return { url };
  },

  // Supprime la pièce jointe du stockage et la ligne en base.
  // Seul l'auteur ou un ADMIN peut supprimer.
  async remove(id: string, user: CurrentUser) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Pièce jointe introuvable');
    const isOwner = found.uploadedById === user.id;
    if (!isOwner && user.role !== 'ADMIN') {
      throw ApiError.forbidden("Suppression réservée à l'auteur ou à un admin");
    }
    await removeObject(found.storagePath);
    await attachmentsRepository.remove(id);
  },
};
