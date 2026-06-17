import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TachesParMembreView } from './TachesParMembreView';
import type { Tache } from './types';

const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Relancer Orange',
    membre: 'Luciano',
    statut: 'en_cours',
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

describe('TachesParMembreView', () => {
  it('regroupe les tâches par membre et réagit aux clics', () => {
    const onSelectTache = vi.fn();
    render(
      <TachesParMembreView taches={taches} onSelectTache={onSelectTache} />,
    );
    expect(
      screen.getByRole('heading', { name: /Luciano/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Eva/ })).toBeInTheDocument();
    fireEvent.click(screen.getByText('Relancer Orange'));
    expect(onSelectTache).toHaveBeenCalledWith(taches[0]);
  });
});
