import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetEvenementPanel } from './BudgetEvenementPanel';
import type { Mouvement } from './types';

const evenement = { id: 'e10', titre: 'Finale Eloquentia', date: '2026-09-12' };

const mouvements: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Billetterie',
    montant: 4800,
    date: '2026-09-12',
    categorie: 'billetterie',
    previsionnel: false,
    evenementId: 'e10',
  },
  {
    id: 'b',
    type: 'depense',
    libelle: 'Traiteur',
    montant: 1200,
    date: '2026-09-12',
    categorie: 'restauration',
    previsionnel: false,
    evenementId: 'e10',
  },
];

describe('BudgetEvenementPanel', () => {
  it("affiche l'événement, le nombre de lignes et le résultat", () => {
    render(
      <BudgetEvenementPanel
        evenement={evenement}
        mouvements={mouvements}
        onAjouter={() => {}}
      />,
    );
    expect(screen.getByText('Finale Eloquentia')).toBeInTheDocument();
    expect(screen.getByText(/2 lignes de budget/)).toBeInTheDocument();
    // Résultat = 4800 - 1200 = 3600.
    expect(screen.getByText(/3\s?600/)).toBeInTheDocument();
  });

  it('déclenche onAjouter au clic sur le bouton', () => {
    const onAjouter = vi.fn();
    render(
      <BudgetEvenementPanel
        evenement={evenement}
        mouvements={mouvements}
        onAjouter={onAjouter}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Ajouter une ligne au budget/ }),
    );
    expect(onAjouter).toHaveBeenCalledTimes(1);
  });
});
