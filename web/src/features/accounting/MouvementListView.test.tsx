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
});
