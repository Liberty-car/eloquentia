import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RelancesView } from './RelancesView';
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
    prochaineRelance: '2000-01-01', // passe -> en retard
  },
  {
    id: '2',
    prenom: 'Karim',
    nom: 'Benali',
    badges: ['jury'],
    etape: 'contacte',
    source: 'manuel',
    dateCreation: '2026-01-02',
    // pas de relance -> absent de la vue
  },
];

describe('RelancesView', () => {
  it('liste seulement les contacts avec relance et marque les retards', () => {
    render(<RelancesView contacts={contacts} onSelect={() => {}} />);
    expect(screen.getByText('Lucie Martin')).toBeInTheDocument();
    expect(screen.queryByText('Karim Benali')).not.toBeInTheDocument();
    expect(screen.getByText(/En retard/)).toBeInTheDocument();
  });

  it('affiche un état vide sans relance', () => {
    render(<RelancesView contacts={[contacts[1]!]} onSelect={() => {}} />);
    expect(screen.getByText('Aucune relance planifiée')).toBeInTheDocument();
  });
});
