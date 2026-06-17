import { describe, it, expect } from 'vitest';
import { totaux } from './aggregate';
import type { Mouvement } from './types';

const m = (over: Partial<Mouvement>): Mouvement => ({
  id: 'x',
  type: 'revenu',
  libelle: 'l',
  montant: 0,
  date: '2026-06-01',
  categorie: 'autre',
  previsionnel: false,
  ...over,
});

describe('totaux', () => {
  it('additionne revenus et dépenses et calcule le résultat', () => {
    const mvts = [
      m({ type: 'revenu', montant: 1000 }),
      m({ type: 'revenu', montant: 500 }),
      m({ type: 'depense', montant: 300 }),
    ];
    expect(totaux(mvts)).toEqual({
      revenus: 1500,
      depenses: 300,
      resultat: 1200,
    });
  });

  it('renvoie des zéros sur une liste vide', () => {
    expect(totaux([])).toEqual({ revenus: 0, depenses: 0, resultat: 0 });
  });
});
