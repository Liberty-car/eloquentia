import { describe, it, expect } from 'vitest';
import { projectionMensuelle, moisDe, labelMois } from './aggregate';
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

describe('moisDe / labelMois', () => {
  it('extrait le mois AAAA-MM', () => {
    expect(moisDe('2026-06-15')).toBe('2026-06');
  });
  it('formate un label français', () => {
    expect(labelMois('2026-06')).toBe('juin 2026');
  });
});

describe('projectionMensuelle', () => {
  it("cumule le résultat mois par mois jusqu'à la fin", () => {
    const mvts = [
      m({ date: '2026-06-10', type: 'revenu', montant: 1000 }),
      m({ date: '2026-07-10', type: 'depense', montant: 400 }),
    ];
    const points = projectionMensuelle(mvts, '2026-08');
    expect(points.map((p) => p.mois)).toEqual([
      '2026-06',
      '2026-07',
      '2026-08',
    ]);
    expect(points.map((p) => p.cumul)).toEqual([1000, 600, 600]);
  });

  it('renvoie une liste vide sans mouvement', () => {
    expect(projectionMensuelle([], '2028-07')).toEqual([]);
  });
});
