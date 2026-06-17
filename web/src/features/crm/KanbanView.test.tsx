import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanView } from './KanbanView';
import type { Contact } from './types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'Lucie',
    nom: 'Martin',
    badges: ['partenaire'],
    etape: 'en_discussion',
    source: 'manuel',
    dateCreation: '2026-01-01',
  },
  {
    id: '2',
    prenom: 'Karim',
    nom: 'Benali',
    badges: ['jury'],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-01-02',
  },
];

describe('KanbanView', () => {
  it('affiche une colonne par étape et place les contacts', () => {
    render(
      <KanbanView
        contacts={contacts}
        onChangeEtape={() => {}}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText('À contacter')).toBeInTheDocument();
    expect(screen.getByText('En discussion')).toBeInTheDocument();
    expect(screen.getByText('Lucie Martin')).toBeInTheDocument();
    expect(screen.getByText('Karim Benali')).toBeInTheDocument();
  });

  it('déclenche onSelect au clic sur une carte', () => {
    const onSelect = vi.fn();
    render(
      <KanbanView
        contacts={contacts}
        onChangeEtape={() => {}}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Lucie Martin'));
    expect(onSelect).toHaveBeenCalledWith(contacts[0]);
  });
});
