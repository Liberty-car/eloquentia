export type EntityType = 'task' | 'event' | 'mouvement' | 'contact';

export interface Attachment {
  id: string;
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: string;
  uploadedBy: { id: string; name: string } | null;
}

export interface SignResponse {
  uploadUrl: string;
  token: string;
  storagePath: string;
}
