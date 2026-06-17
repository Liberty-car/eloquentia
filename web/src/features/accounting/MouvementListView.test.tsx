import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MouvementListView } from './MouvementListView';
import type { Mouvement } from './types';

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
];

describe('MouvementListView', () => {
  it('affiche les mouvements et réagit au clic', () => {
    const onSelect = vi.fn();
    render(<MouvementListView mouvements={mvts} onSelect={onSelect} />);
    expect(screen.getByText('Subvention Région')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Subvention Région'));
    expect(onSelect).toHaveBeenCalledWith(mvts[0]);
  });

  it('affiche un état vide sans mouvement', () => {
    render(<MouvementListView mouvements={[]} onSelect={() => {}} />);
    expect(screen.getByText('Aucun mouvement')).toBeInTheDocument();
  });

  it('pagine au-delà de la taille de page et permet de naviguer', () => {
    const nombreux: Mouvement[] = Array.from({ length: 12 }, (_, i) => ({
      id: `m${i}`,
      type: 'depense',
      libelle: `Dépense ${i}`,
      montant: 100,
      date: '2026-06-10',
      categorie: 'logistique',
      previsionnel: false,
    }));
    render(<MouvementListView mouvements={nombreux} onSelect={() => {}} />);

    // Page 1 : 10 lignes, la 11e (Dépense 10) n'est pas encore visible.
    expect(screen.getByText('1-10 sur 12')).toBeInTheDocument();
    expect(screen.getByText('Dépense 0')).toBeInTheDocument();
    expect(screen.queryByText('Dépense 10')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Page suivante'));
    expect(screen.getByText('11-12 sur 12')).toBeInTheDocument();
    expect(screen.getByText('Dépense 10')).toBeInTheDocument();
    expect(screen.queryByText('Dépense 0')).not.toBeInTheDocument();
  });
});
