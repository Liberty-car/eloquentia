import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./attachments.repository', () => ({
  attachmentsRepository: {
    create: vi.fn(),
    listByEntity: vi.fn(),
    findById: vi.fn(),
    remove: vi.fn(),
  },
}));
vi.mock('../../services/supabase', () => ({
  createSignedUploadUrl: vi.fn(),
  createSignedDownloadUrl: vi.fn(),
  removeObject: vi.fn(),
}));

import { attachmentsRepository } from './attachments.repository';
import {
  createSignedUploadUrl,
  createSignedDownloadUrl,
  removeObject,
} from '../../services/supabase';
import { attachmentsService } from './attachments.service';
import { ApiError } from '../../lib/ApiError';

const repo = vi.mocked(attachmentsRepository);
const signUp = vi.mocked(createSignedUploadUrl);
const signDown = vi.mocked(createSignedDownloadUrl);
const rm = vi.mocked(removeObject);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sign', () => {
  it("génère un chemin préfixé et renvoie l'URL signée", async () => {
    signUp.mockResolvedValue({
      signedUrl: 'https://x/upload',
      token: 'tok',
      path: 'task/abc/whatever',
    });
    const res = await attachmentsService.sign({
      entityType: 'task',
      entityId: 'abc',
      fileName: 'r.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 10,
    });
    expect(signUp).toHaveBeenCalledTimes(1);

    const pathArg = signUp.mock.calls[0]![0]!;
    expect(pathArg.startsWith('task/abc/')).toBe(true);
    expect(res.storagePath).toBe(pathArg);
    expect(res.uploadUrl).toBe('https://x/upload');
  });
});

describe('create', () => {
  it('refuse un storagePath au mauvais préfixe', async () => {
    await expect(
      attachmentsService.create(
        {
          entityType: 'task',
          entityId: 'abc',
          fileName: 'r.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 10,
          storagePath: 'event/zzz/x-r.pdf',
        },
        'user1',
      ),
    ).rejects.toBeInstanceOf(ApiError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('persiste quand le préfixe est correct', async () => {
    repo.create.mockResolvedValue({ id: 'a1' } as never);
    await attachmentsService.create(
      {
        entityType: 'task',
        entityId: 'abc',
        fileName: 'r.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 10,
        storagePath: 'task/abc/x-r.pdf',
      },
      'user1',
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storagePath: 'task/abc/x-r.pdf',
        uploadedById: 'user1',
      }),
    );
  });
});

describe('getDownloadUrl', () => {
  it('404 si la pièce jointe est introuvable', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      attachmentsService.getDownloadUrl('nope'),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("renvoie l'URL de téléchargement si la pièce jointe existe", async () => {
    repo.findById.mockResolvedValue({
      id: 'a1',
      uploadedById: 'owner',
      storagePath: 'task/abc/x',
    } as never);
    signDown.mockResolvedValue('https://x/download');
    const result = await attachmentsService.getDownloadUrl('a1');
    expect(signDown).toHaveBeenCalledWith('task/abc/x');
    expect(result.url).toBe('https://x/download');
  });
});

describe('remove', () => {
  it('interdit la suppression par un non-auteur non-admin', async () => {
    repo.findById.mockResolvedValue({
      id: 'a1',
      uploadedById: 'owner',
      storagePath: 'task/abc/x',
    } as never);
    await expect(
      attachmentsService.remove('a1', { id: 'someone', role: 'MEMBRE' }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(rm).not.toHaveBeenCalled();
  });

  it("autorise l'auteur et supprime objet + ligne", async () => {
    repo.findById.mockResolvedValue({
      id: 'a1',
      uploadedById: 'owner',
      storagePath: 'task/abc/x',
    } as never);
    await attachmentsService.remove('a1', { id: 'owner', role: 'MEMBRE' });
    expect(rm).toHaveBeenCalledWith('task/abc/x');
    expect(repo.remove).toHaveBeenCalledWith('a1');
  });
});
