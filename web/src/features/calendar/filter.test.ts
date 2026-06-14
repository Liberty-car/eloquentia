import { describe, it, expect } from 'vitest';
import {
  FILTRES_CAL_INITIAUX,
  filtrerEvenements,
  filtrerTaches,
  type CalendarFiltres,
} from './filter';
import type { Evenement, Tache } from './types';

const evenements: Evenement[] = [
  { id: 'e1', titre: 'Finale régionale', date: '2026-09-12', lieu: 'Théâtre' },
  { id: 'e2', titre: 'Atelier prise de parole', date: '2026-06-20' },
];

const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Briefer le jury',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'haute',
    echeance: '2026-09-05',
  },
  {
    id: 't2',
    titre: 'Relancer la Fondation',
    membre: 'Eva',
    statut: 'en_cours',
    priorite: 'moyenne',
    echeance: '2026-06-22',
  },
];

function filtres(p: Partial<CalendarFiltres>): CalendarFiltres {
  return { ...FILTRES_CAL_INITIAUX, ...p };
}

describe('filtre agenda', () => {
  it('renvoie tout par défaut', () => {
    expect(filtrerEvenements(evenements, FILTRES_CAL_INITIAUX)).toHaveLength(2);
    expect(filtrerTaches(taches, FILTRES_CAL_INITIAUX)).toHaveLength(2);
  });

  it('type « événements » masque les tâches', () => {
    const f = filtres({ type: 'evenements' });
    expect(filtrerEvenements(evenements, f)).toHaveLength(2);
    expect(filtrerTaches(taches, f)).toHaveLength(0);
  });

  it('type « tâches » masque les événements', () => {
    const f = filtres({ type: 'taches' });
    expect(filtrerEvenements(evenements, f)).toHaveLength(0);
    expect(filtrerTaches(taches, f)).toHaveLength(2);
  });

  it('filtre les tâches par statut, membre et priorité', () => {
    expect(filtrerTaches(taches, filtres({ statut: 'en_cours' }))).toEqual([
      taches[1],
    ]);
    expect(filtrerTaches(taches, filtres({ membre: 'Luciano' }))).toEqual([
      taches[0],
    ]);
    expect(filtrerTaches(taches, filtres({ priorite: 'haute' }))).toEqual([
      taches[0],
    ]);
  });

  it('recherche plein texte sur événements et tâches', () => {
    expect(filtrerEvenements(evenements, filtres({ recherche: 'théâtre' })));
    expect(
      filtrerEvenements(evenements, filtres({ recherche: 'finale' })),
    ).toEqual([evenements[0]]);
    expect(filtrerTaches(taches, filtres({ recherche: 'jury' }))).toEqual([
      taches[0],
    ]);
  });
});
