import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComptaDashboardView } from './ComptaDashboardView';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Subvention',
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
    libelle: 'Prévision 2027',
    montant: 9000,
    date: '2027-01-15',
    categorie: 'subventions',
    previsionnel: true,
  },
];

describe('ComptaDashboardView', () => {
  it('calcule les KPIs sur le réel uniquement (ignore le prévisionnel)', () => {
    render(<ComptaDashboardView mouvements={mvts} />);
    // Revenus réels = 8000 (la prévision de 9000 est exclue).
    expect(screen.getByTestId('kpi-revenus').textContent).toContain('8');
    expect(screen.getByTestId('kpi-revenus').textContent).not.toContain('17');
    expect(screen.getByTestId('kpi-depenses').textContent).toContain('680');
  });

  it('affiche un état vide sans mouvement réel', () => {
    const prevSeul: Mouvement[] = [mvts[2]!];
    render(<ComptaDashboardView mouvements={prevSeul} />);
    expect(screen.getByText('Aucun mouvement réel')).toBeInTheDocument();
  });
});
