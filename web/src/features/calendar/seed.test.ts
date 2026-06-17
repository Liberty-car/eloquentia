import { describe, it, expect } from 'vitest';
import { seedEvenements, seedTaches } from './seed';
import { MEMBRES, PRIORITES, STATUTS } from './types';

describe('seed calendrier', () => {
  const evenements = seedEvenements();
  const taches = seedTaches();

  it('fournit 20 événements et 20 tâches', () => {
    expect(evenements).toHaveLength(20);
    expect(taches).toHaveLength(20);
  });

  it('a des identifiants uniques', () => {
    expect(new Set(evenements.map((e) => e.id)).size).toBe(20);
    expect(new Set(taches.map((t) => t.id)).size).toBe(20);
  });

  it('respecte la contrainte de dates (<= 2026-09-30)', () => {
    for (const e of evenements) {
      expect(e.date <= '2026-09-30').toBe(true);
    }
    for (const t of taches) {
      if (t.echeance) expect(t.echeance <= '2026-09-30').toBe(true);
    }
  });

  it('utilise des membres, statuts et priorités valides', () => {
    for (const t of taches) {
      expect(MEMBRES).toContain(t.membre);
      expect(STATUTS).toContain(t.statut);
      expect(PRIORITES).toContain(t.priorite);
    }
  });

  it('couvre les 4 membres', () => {
    const membres = new Set(taches.map((t) => t.membre));
    for (const m of MEMBRES) {
      expect(membres).toContain(m);
    }
  });
});
