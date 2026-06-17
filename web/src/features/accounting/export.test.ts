import { describe, it, expect } from 'vitest';
import { mouvementsVersCsv } from './export';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Don; spécial',
    montant: 1500,
    date: '2026-06-12',
    categorie: 'dons',
    previsionnel: false,
  },
];

describe('mouvementsVersCsv', () => {
  it('génère un en-tête et une ligne, en échappant le séparateur', () => {
    const csv = mouvementsVersCsv(mvts);
    const lignes = csv.split('\r\n');
    expect(lignes[0]).toBe(
      'Date;Type;Libellé;Catégorie;Montant;Prévisionnel;Justificatif',
    );
    // Le point-virgule dans le libellé force les guillemets.
    expect(lignes[1]).toBe('2026-06-12;Revenu;"Don; spécial";Dons;1500;Non;');
  });
});
