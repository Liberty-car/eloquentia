import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('./attachmentsApi', () => ({
  listAttachments: vi.fn(),
  uploadAttachment: vi.fn(),
  openAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
}));

import { listAttachments } from './attachmentsApi';
import { PiecesJointes } from './PiecesJointes';

const list = vi.mocked(listAttachments);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PiecesJointes', () => {
  it('affiche les pièces jointes listées', async () => {
    list.mockResolvedValue([
      {
        id: 'a1',
        entityType: 'task',
        entityId: 'abc',
        fileName: 'rapport.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048,
        storagePath: 'task/abc/x-rapport.pdf',
        createdAt: '2026-06-17T10:00:00.000Z',
        uploadedBy: { id: 'u1', name: 'Luciano' },
      },
    ]);
    render(<PiecesJointes entityType="task" entityId="abc" />);
    await waitFor(() =>
      expect(screen.getByText('rapport.pdf')).toBeInTheDocument(),
    );
  });

  it("affiche un état vide quand il n'y a aucune pièce jointe", async () => {
    list.mockResolvedValue([]);
    render(<PiecesJointes entityType="task" entityId="abc" />);
    await waitFor(() =>
      expect(screen.getByText(/aucune pièce jointe/i)).toBeInTheDocument(),
    );
  });
});
