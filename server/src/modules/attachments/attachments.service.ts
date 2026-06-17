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
  // Construit le chemin de stockage cote serveur pour eviter toute falsification.
  async sign(input: SignInput) {
    const path = buildStoragePath(
      input.entityType,
      input.entityId,
      randomUUID(),
      input.fileName,
    );
    const signed = await createSignedUploadUrl(path);
    // On renvoie le chemin qu'on a construit (pas signed.path qui peut differer).
    return {
      uploadUrl: signed.signedUrl,
      token: signed.token,
      storagePath: path,
    };
  },

  // Persiste les metadonnees apres que le client a uploade le fichier.
  // Verifie que le storagePath appartient bien a l'entite declaree (anti-falsification).
  async create(input: CreateInput, userId: string) {
    if (
      !storagePathMatches(input.storagePath, input.entityType, input.entityId)
    ) {
      throw ApiError.badRequest('Chemin de stockage incoherent');
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

  // Liste les pieces jointes d'une entite.
  list(entityType: EntityType, entityId: string) {
    return attachmentsRepository.listByEntity(entityType, entityId);
  },

  // Genere une URL de telechargement signee a duree limitee.
  async getDownloadUrl(id: string) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Piece jointe introuvable');
    const url = await createSignedDownloadUrl(found.storagePath);
    return { url };
  },

  // Supprime la piece jointe du stockage et la ligne en base.
  // Seul l'auteur ou un ADMIN peut supprimer.
  async remove(id: string, user: CurrentUser) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Piece jointe introuvable');
    const isOwner = found.uploadedById === user.id;
    if (!isOwner && user.role !== 'ADMIN') {
      throw ApiError.forbidden("Suppression reservee a l'auteur ou a un admin");
    }
    await removeObject(found.storagePath);
    await attachmentsRepository.remove(id);
  },
};
