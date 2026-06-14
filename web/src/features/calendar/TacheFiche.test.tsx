import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TacheFiche } from './TacheFiche';

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
});
