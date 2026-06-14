import { describe, it, expect } from 'vitest';
import { isoLocal, moisGrille, NOMS_MOIS } from './grille';

describe('moisGrille', () => {
  // Septembre 2026 (mois index 8).
  const jours = moisGrille(2026, 8);

  it('contient 42 cases (6 semaines)', () => {
    expect(jours).toHaveLength(42);
  });

  it('contient les 30 jours de septembre marqués dans le mois', () => {
    expect(jours.filter((j) => j.dansLeMois)).toHaveLength(30);
  });

  it('place le 1er septembre dans le mois et inclut les débordements', () => {
    expect(jours.find((j) => j.iso === '2026-09-01')?.dansLeMois).toBe(true);
    expect(jours.find((j) => j.iso === '2026-08-31')?.dansLeMois).toBe(false);
    expect(jours.find((j) => j.iso === '2026-10-01')?.dansLeMois).toBe(false);
  });

  it('expose le nom du mois', () => {
    expect(NOMS_MOIS[8]).toBe('Septembre');
  });
});

describe('isoLocal', () => {
  it('formate une date locale en AAAA-MM-JJ', () => {
    expect(isoLocal(new Date(2026, 8, 1))).toBe('2026-09-01');
    expect(isoLocal(new Date(2026, 11, 25))).toBe('2026-12-25');
  });
});
