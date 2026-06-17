import { describe, it, expect } from 'vitest';
import { compterDestinataires } from './recipients';
import type { Contact } from '../crm/types';

const c = (over: Partial<Contact>): Contact => ({
  id: 'x',
  prenom: 'A',
  nom: 'B',
  badges: [],
  etape: 'a_contacter',
  source: 'manuel',
  dateCreation: '2026-06-01',
  ...over,
});

const contacts: Contact[] = [
  c({ id: '1', email: 'a@x.fr', badges: ['partenaire'] }),
  c({ id: '2', email: 'b@x.fr', badges: ['jury', 'partenaire'] }),
  c({ id: '3', badges: ['partenaire'] }), // sans email -> exclu
  c({ id: '4', email: 'd@x.fr', badges: ['benevole'] }),
];

describe('compterDestinataires', () => {
  it('compte tous les contacts avec email pour le segment "tous"', () => {
    expect(compterDestinataires(contacts, 'tous')).toBe(3);
  });

  it('compte les contacts du badge ayant un email', () => {
    expect(compterDestinataires(contacts, 'partenaire')).toBe(2);
    expect(compterDestinataires(contacts, 'jury')).toBe(1);
    expect(compterDestinataires(contacts, 'benevole')).toBe(1);
  });

  it('renvoie 0 pour un badge sans destinataire', () => {
    expect(compterDestinataires(contacts, 'lead')).toBe(0);
  });
});
