import { describe, it, expect } from 'vitest';
import {
  evenementsAVenir,
  tachesActives,
  derniersContacts,
  compterLeads,
} from './summary';
import type { Contact } from '../crm/types';
import type { Evenement, Tache } from '../calendar/types';

const ev = (id: string, date: string): Evenement => ({ id, titre: id, date });
const ct = (id: string, dateCreation: string, lead = false): Contact => ({
  id,
  prenom: id,
  nom: 'X',
  badges: lead ? ['lead'] : ['partenaire'],
  etape: 'a_contacter',
  source: 'manuel',
  dateCreation,
});
const tk = (id: string, statut: Tache['statut']): Tache => ({
  id,
  titre: id,
  membre: 'Luciano',
  statut,
  priorite: 'moyenne',
});

describe('evenementsAVenir', () => {
  it("garde les événements à partir d'aujourd'hui, triés croissant, limités", () => {
    const evs = [
      ev('a', '2026-06-20'),
      ev('b', '2026-06-01'),
      ev('c', '2026-07-01'),
    ];
    const r = evenementsAVenir(evs, '2026-06-14', 2);
    expect(r.map((e) => e.id)).toEqual(['a', 'c']);
  });
});

describe('tachesActives', () => {
  it('exclut les tâches faites', () => {
    const r = tachesActives([
      tk('a', 'a_faire'),
      tk('b', 'fait'),
      tk('c', 'en_cours'),
    ]);
    expect(r.map((t) => t.id)).toEqual(['a', 'c']);
  });
});

describe('derniersContacts', () => {
  it('trie par date de création décroissante et limite', () => {
    const cs = [
      ct('a', '2026-06-01'),
      ct('b', '2026-06-10'),
      ct('c', '2026-06-05'),
    ];
    const r = derniersContacts(cs, 2);
    expect(r.map((c) => c.id)).toEqual(['b', 'c']);
  });
});

describe('compterLeads', () => {
  it('compte les contacts ayant le badge lead', () => {
    expect(
      compterLeads([ct('a', '2026-06-01', true), ct('b', '2026-06-02')]),
    ).toBe(1);
  });
});
