import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrevisionnelView } from './PrevisionnelView';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'r',
    type: 'revenu',
    libelle: 'Billetterie réelle',
    montant: 4800,
    date: '2026-09-12',
    categorie: 'billetterie',
    previsionnel: false,
  },
  {
    id: 'p1',
    type: 'revenu',
    libelle: 'Subvention 2027',
    montant: 9000,
    date: '2027-01-15',
    categorie: 'subventions',
    previsionnel: true,
  },
  {
    id: 'p2',
    type: 'depense',
    libelle: 'Logistique 2028',
    montant: 4200,
    date: '2028-07-15',
    categorie: 'logistique',
    previsionnel: true,
  },
];

describe('PrevisionnelView', () => {
  it('affiche les mouvements prévisionnels groupés par année', () => {
    render(<PrevisionnelView mouvements={mvts} />);
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('2028')).toBeInTheDocument();
    expect(screen.getByText('Subvention 2027')).toBeInTheDocument();
    // Le mouvement réel n'apparaît pas dans le détail prévisionnel.
    expect(screen.queryByText('Billetterie réelle')).not.toBeInTheDocument();
  });

  it('affiche un état vide sans prévisionnel', () => {
    const reelSeul: Mouvement[] = [mvts[0]!];
    render(<PrevisionnelView mouvements={reelSeul} />);
    expect(
      screen.getByText('Aucun mouvement prévisionnel'),
    ).toBeInTheDocument();
  });
});
