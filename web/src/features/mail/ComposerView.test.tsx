import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComposerView } from './ComposerView';
import type { Contact } from '../crm/types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'A',
    nom: 'B',
    email: 'a@x.fr',
    badges: ['partenaire'],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-06-01',
  },
  {
    id: '2',
    prenom: 'C',
    nom: 'D',
    email: 'c@x.fr',
    badges: ['jury'],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-06-01',
  },
];

describe('ComposerView', () => {
  it('affiche le nombre de destinataires du segment (par défaut "tous")', () => {
    render(<ComposerView contacts={contacts} onSend={() => {}} />);
    expect(screen.getByTestId('destinataires-count').textContent).toContain(
      '2',
    );
  });

  it('désactive l’envoi tant que le sujet est vide', () => {
    render(<ComposerView contacts={contacts} onSend={() => {}} />);
    const bouton = screen.getByRole('button', {
      name: /Envoyer la campagne/,
    });
    expect(bouton).toBeDisabled();
  });

  it('envoie avec le sujet, le corps et le segment', () => {
    const onSend = vi.fn();
    render(<ComposerView contacts={contacts} onSend={onSend} />);
    fireEvent.change(screen.getByLabelText('Sujet'), {
      target: { value: 'Bonjour' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Corps du message' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Envoyer la campagne/ }),
    );
    expect(onSend).toHaveBeenCalledWith({
      sujet: 'Bonjour',
      corps: 'Corps du message',
      segment: 'tous',
    });
  });
});
