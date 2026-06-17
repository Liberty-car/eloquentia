import { apiFetch } from '../../lib/api/client';
import type { Attachment, EntityType, SignResponse } from './types';

interface Meta {
  entityType: EntityType;
  entityId: string;
}

// Upload complet : signe -> PUT direct vers Supabase -> persiste les métadonnées.
export async function uploadAttachment(
  meta: Meta,
  file: File,
): Promise<Attachment> {
  const signed = await apiFetch<SignResponse>('/attachments/sign', {
    method: 'POST',
    body: JSON.stringify({
      entityType: meta.entityType,
      entityId: meta.entityId,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    }),
  });

  // Le navigateur envoie les octets directement à Supabase (pas via apiFetch).
  const put = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'content-type': file.type },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`Échec de l'envoi du fichier (${put.status})`);
  }

  return apiFetch<Attachment>('/attachments', {
    method: 'POST',
    body: JSON.stringify({
      entityType: meta.entityType,
      entityId: meta.entityId,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      storagePath: signed.storagePath,
    }),
  });
}

export function listAttachments(meta: Meta): Promise<Attachment[]> {
  const qs = new URLSearchParams({
    entityType: meta.entityType,
    entityId: meta.entityId,
  });
  return apiFetch<Attachment[]>(`/attachments?${qs.toString()}`);
}

export async function openAttachment(id: string): Promise<void> {
  const { url } = await apiFetch<{ url: string }>(`/attachments/${id}/url`);
  window.open(url, '_blank', 'noopener');
}

export function deleteAttachment(id: string): Promise<{ deleted: boolean }> {
  return apiFetch<{ deleted: boolean }>(`/attachments/${id}`, {
    method: 'DELETE',
  });
}
