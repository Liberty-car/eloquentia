import { describe, it, expect } from 'vitest';
import { seedContacts } from './seed';
import { BADGES, ETAPES } from './types';

describe('seedContacts', () => {
  const contacts = seedContacts();

  it('fournit 20 contacts', () => {
    expect(contacts).toHaveLength(20);
  });

  it('a des identifiants uniques', () => {
    const ids = new Set(contacts.map((c) => c.id));
    expect(ids.size).toBe(20);
  });

  it('respecte la contrainte de dates (<= 2026-09-30)', () => {
    for (const c of contacts) {
      expect(c.dateCreation <= '2026-09-30').toBe(true);
      if (c.dateDerniereInteraction) {
        expect(c.dateDerniereInteraction <= '2026-09-30').toBe(true);
      }
    }
  });

  it("n'utilise que des badges et des étapes valides", () => {
    for (const c of contacts) {
      expect(ETAPES).toContain(c.etape);
      expect(c.badges.length).toBeGreaterThan(0);
      for (const b of c.badges) {
        expect(BADGES).toContain(b);
      }
    }
  });

  it('couvre les 5 étapes', () => {
    const etapes = new Set(contacts.map((c) => c.etape));
    for (const e of ETAPES) {
      expect(etapes).toContain(e);
    }
  });
});
