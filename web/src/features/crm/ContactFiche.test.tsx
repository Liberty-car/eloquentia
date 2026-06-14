import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactFiche } from './ContactFiche';

describe('ContactFiche', () => {
  it('création : saisie puis enregistrement renvoie les valeurs', () => {
    const onSave = vi.fn();
    render(
      <ContactFiche
        open
        contact={null}
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Lucie' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Martin' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({
      prenom: 'Lucie',
      nom: 'Martin',
    });
  });

  it('édition : pré-remplit et expose la suppression', () => {
    const onDelete = vi.fn();
    render(
      <ContactFiche
        open
        contact={{
          id: '1',
          prenom: 'Karim',
          nom: 'Benali',
          badges: ['jury'],
          etape: 'contacte',
          source: 'manuel',
          dateCreation: '2026-01-01',
        }}
        onClose={() => {}}
        onSave={() => {}}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByLabelText('Prénom')).toHaveValue('Karim');
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
