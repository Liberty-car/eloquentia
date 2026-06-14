import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgendaView } from './AgendaView';
import type { Evenement, Tache } from './types';

const evenements: Evenement[] = [
  { id: 'e1', titre: 'Finale Eloquentia', date: '2026-09-12', heure: '19:00' },
];
const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Briefer le jury',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'moyenne',
    echeance: '2026-09-05',
  },
  {
    id: 't2',
    titre: 'Tâche sans échéance',
    membre: 'Eva',
    statut: 'a_faire',
    priorite: 'basse',
  },
];

describe('AgendaView', () => {
  it('liste les éléments datés par ordre chronologique et réagit aux clics', () => {
    const onSelectEvenement = vi.fn();
    render(
      <AgendaView
        evenements={evenements}
        taches={taches}
        onSelectEvenement={onSelectEvenement}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Finale Eloquentia')).toBeInTheDocument();
    expect(screen.getByText('Briefer le jury')).toBeInTheDocument();
    // La tache sans echeance n'apparait pas dans l'agenda.
    expect(screen.queryByText('Tâche sans échéance')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Finale Eloquentia'));
    expect(onSelectEvenement).toHaveBeenCalledWith(evenements[0]);
  });

  it('affiche un état vide sans élément daté', () => {
    render(
      <AgendaView
        evenements={[]}
        taches={[]}
        onSelectEvenement={() => {}}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Aucun élément à venir')).toBeInTheDocument();
  });
});
