import { beforeEach, describe, it, expect } from 'vitest';
import {
  ajouterCategorie,
  categorieParDefaut,
  categoriesPour,
  libelleCategorie,
  supprimerCategorie,
  toutesCategories,
} from './categories';

describe('categories (taxonomie dynamique)', () => {
  beforeEach(() => localStorage.clear());

  it('auto-initialise et filtre par type', () => {
    const revenus = categoriesPour('revenu').map((c) => c.id);
    expect(revenus).toContain('dons');
    expect(revenus).toContain('autre-revenu');
    const depenses = categoriesPour('depense').map((c) => c.id);
    expect(depenses).toContain('logistique');
    expect(depenses).not.toContain('dons');
  });

  it('résout le libellé avec repli sur un id inconnu', () => {
    expect(libelleCategorie('dons')).toBe('Dons');
    expect(libelleCategorie('inconnu')).toBe('inconnu');
  });

  it('ajoute une catégorie typée', () => {
    const cat = ajouterCategorie('Mécénat', 'revenu');
    expect(cat.type).toBe('revenu');
    expect(categoriesPour('revenu').some((c) => c.id === cat.id)).toBe(true);
  });

  it('protège la catégorie « Autre » de chaque type', () => {
    expect(supprimerCategorie('dons')).toBe(true);
    expect(supprimerCategorie('autre-revenu')).toBe(false);
    expect(supprimerCategorie('autre-depense')).toBe(false);
    expect(toutesCategories().some((c) => c.id === 'autre-revenu')).toBe(true);
  });

  it('expose la catégorie par défaut par type', () => {
    expect(categorieParDefaut('revenu')).toBe('autre-revenu');
    expect(categorieParDefaut('depense')).toBe('autre-depense');
  });
});
