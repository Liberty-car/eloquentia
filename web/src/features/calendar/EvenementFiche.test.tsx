import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvenementFiche } from './EvenementFiche';

vi.mock('../attachments/attachmentsApi', () => ({
  listAttachments: vi.fn().mockResolvedValue([]),
  uploadAttachment: vi.fn(),
  openAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
}));

describe('EvenementFiche', () => {
  it('création : saisie puis enregistrement renvoie les valeurs', () => {
    const onSave = vi.fn();
    render(
      <EvenementFiche
        open
        evenement={null}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Finale' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({
      titre: 'Finale',
      date: '2026-09-12',
    });
  });
});
