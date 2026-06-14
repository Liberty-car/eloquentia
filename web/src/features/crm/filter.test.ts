import { describe, it, expect } from 'vitest';
import { filterContacts, type ContactFilters } from './filter';
import type { Contact } from './types';

const base: ContactFilters = { recherche: '', badges: [], etape: 'toutes' };

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
  {
    id: '2',
    prenom: 'Karim',
    nom: 'Benali',
    organisation: 'Fondation Orange',
    badges: ['jury'],
    etape: 'contacte',
    source: 'manuel',
    dateCreation: '2026-01-02',
  },
];

describe('filterContacts', () => {
  it('retourne tout sans filtre', () => {
    expect(filterContacts(contacts, base)).toHaveLength(2);
  });

  it('filtre par recherche (nom, insensible à la casse)', () => {
    expect(
      filterContacts(contacts, { ...base, recherche: 'benali' }),
    ).toHaveLength(1);
  });

  it("filtre par recherche sur l'organisation", () => {
    const result = filterContacts(contacts, { ...base, recherche: 'paris' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('1');
  });

  it('filtre par étape', () => {
    const result = filterContacts(contacts, { ...base, etape: 'contacte' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('2');
  });

  it('filtre par badge (au moins un des badges sélectionnés)', () => {
    const result = filterContacts(contacts, { ...base, badges: ['jury'] });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('2');
  });
});
