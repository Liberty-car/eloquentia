import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TachesStatutView } from './TachesStatutView';
import type { Tache } from './types';

const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Relancer Orange',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'haute',
  },
  {
    id: 't2',
    titre: 'Réserver salle',
    membre: 'Eva',
    statut: 'fait',
    priorite: 'haute',
  },
];

describe('TachesStatutView', () => {
  it('affiche une colonne par statut et réagit au clic', () => {
    const onSelectTache = vi.fn();
    render(
      <TachesStatutView
        taches={taches}
        onChangeStatut={() => {}}
        onSelectTache={onSelectTache}
      />,
    );
    expect(screen.getByText('À faire')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText('Fait')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Relancer Orange'));
    expect(onSelectTache).toHaveBeenCalledWith(taches[0]);
  });
});
