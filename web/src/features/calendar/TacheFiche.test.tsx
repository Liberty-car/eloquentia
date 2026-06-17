import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TacheFiche } from './TacheFiche';

vi.mock('../attachments/attachmentsApi', () => ({
  listAttachments: vi.fn().mockResolvedValue([]),
  uploadAttachment: vi.fn(),
  openAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
}));

describe('TacheFiche', () => {
  it('création : saisie puis enregistrement renvoie les valeurs', () => {
    const onSave = vi.fn();
    render(
      <TacheFiche
        open
        tache={null}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Briefer le jury' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({
      titre: 'Briefer le jury',
      echeance: '2026-09-12',
      membre: 'Luciano',
    });
  });

  it('« Marquer comme réalisé » enregistre la tâche en statut fait', () => {
    const onSave = vi.fn();
    render(
      <TacheFiche
        open
        tache={{
          id: 't1',
          titre: 'Briefer le jury',
          membre: 'Eva',
          statut: 'en_cours',
          priorite: 'haute',
          echeance: '2026-09-05',
        }}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Marquer comme réalisé/ }),
    );
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({ statut: 'fait' });
  });

  it('masque le bouton « Marquer comme réalisé » pour une tâche déjà faite', () => {
    render(
      <TacheFiche
        open
        tache={{
          id: 't1',
          titre: 'Briefer le jury',
          membre: 'Eva',
          statut: 'fait',
          priorite: 'haute',
        }}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /Marquer comme réalisé/ }),
    ).not.toBeInTheDocument();
  });
});
