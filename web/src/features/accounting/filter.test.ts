import { describe, it, expect } from 'vitest';
import { filterMouvements, type ComptaFiltres } from './filter';
import type { Mouvement } from './types';

const base: ComptaFiltres = {
  recherche: '',
  type: 'tous',
  categorie: 'toutes',
  nature: 'toutes',
};

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Subvention Région',
    montant: 8000,
    date: '2026-06-05',
    categorie: 'subventions',
    previsionnel: false,
  },
  {
    id: 'b',
    type: 'depense',
    libelle: 'Affiches',
    montant: 680,
    date: '2026-06-25',
    categorie: 'communication',
    previsionnel: false,
  },
  {
    id: 'c',
    type: 'revenu',
    libelle: 'Subvention prévisionnelle 2027',
    montant: 9000,
    date: '2027-01-15',
    categorie: 'subventions',
    previsionnel: true,
  },
];

describe('filterMouvements', () => {
  it('filtre par type', () => {
    const r = filterMouvements(mvts, { ...base, type: 'depense' });
    expect(r.map((m) => m.id)).toEqual(['b']);
  });

  it('filtre par catégorie', () => {
    const r = filterMouvements(mvts, { ...base, categorie: 'subventions' });
    expect(r.map((m) => m.id)).toEqual(['a', 'c']);
  });

  it('filtre par recherche sur le libellé (insensible à la casse)', () => {
    const r = filterMouvements(mvts, { ...base, recherche: 'affi' });
    expect(r.map((m) => m.id)).toEqual(['b']);
  });

  it('filtre par nature réel uniquement', () => {
    const r = filterMouvements(mvts, { ...base, nature: 'reel' });
    expect(r.map((m) => m.id)).toEqual(['a', 'b']);
  });

  it('filtre par nature prévisionnel uniquement', () => {
    const r = filterMouvements(mvts, { ...base, nature: 'previsionnel' });
    expect(r.map((m) => m.id)).toEqual(['c']);
  });

  it('renvoie tout sans filtre', () => {
    expect(filterMouvements(mvts, base)).toHaveLength(3);
  });
});
