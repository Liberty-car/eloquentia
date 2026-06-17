import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactListView } from './ContactListView';
import type { Contact } from './types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'Lucie',
    nom: 'Martin',
    organisation: 'Mairie de Paris',
    badges: ['partenaire'],
    etape: 'en_discussion',
    source: 'manuel',
    dateCreation: '2026-01-01',
  },
];

describe('ContactListView', () => {
  it('affiche une ligne par contact et déclenche la sélection', () => {
    const onSelect = vi.fn();
    render(<ContactListView contacts={contacts} onSelect={onSelect} />);
    expect(screen.getByText('Lucie Martin')).toBeInTheDocument();
    expect(screen.getByText('En discussion')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Lucie Martin'));
    expect(onSelect).toHaveBeenCalledWith(contacts[0]);
  });
});
