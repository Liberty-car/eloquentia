import { beforeEach, describe, it, expect } from 'vitest';
import {
  ajouterBadge,
  libelleBadge,
  supprimerBadge,
  toneBadge,
  tousBadges,
} from './badges';

describe('badges (taxonomie dynamique)', () => {
  beforeEach(() => localStorage.clear());

  it('auto-initialise les badges par défaut à la première lecture', () => {
    const ids = tousBadges().map((b) => b.id);
    expect(ids).toContain('partenaire');
    expect(ids).toContain('lead');
    expect(tousBadges().length).toBeGreaterThanOrEqual(6);
  });

  it('résout le libellé et la tonalité, avec repli sur un id inconnu', () => {
    expect(libelleBadge('partenaire')).toBe('Partenaire');
    expect(libelleBadge('inconnu')).toBe('inconnu');
    expect(toneBadge('inconnu')).toBe('neutre');
  });

  it('ajoute un badge (id dérivé du label)', () => {
    const badge = ajouterBadge('Grand mécène');
    expect(badge.id).toBe('grand-mecene');
    expect(tousBadges().some((b) => b.id === 'grand-mecene')).toBe(true);
  });

  it('supprime un badge normal mais protège « lead »', () => {
    expect(supprimerBadge('partenaire')).toBe(true);
    expect(tousBadges().some((b) => b.id === 'partenaire')).toBe(false);
    expect(supprimerBadge('lead')).toBe(false);
    expect(tousBadges().some((b) => b.id === 'lead')).toBe(true);
  });
});
