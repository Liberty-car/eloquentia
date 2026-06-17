import { prisma } from '../../lib/prisma';
import type { EntityType } from './attachments.schemas';

export interface CreateAttachmentData {
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedById: string | null;
}

export const attachmentsRepository = {
  create(data: CreateAttachmentData) {
    return prisma.attachment.create({ data });
  },

  listByEntity(entityType: EntityType, entityId: string) {
    return prisma.attachment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
  },

  findById(id: string) {
    return prisma.attachment.findUnique({ where: { id } });
  },

  remove(id: string) {
    return prisma.attachment.delete({ where: { id } });
  },
};
