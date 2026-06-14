import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthCalendar } from './MonthCalendar';
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
    echeance: '2026-09-12',
  },
];

describe('MonthCalendar', () => {
  it('affiche les événements et tâches du mois et réagit aux clics', () => {
    const onJourClic = vi.fn();
    const onSelectEvenement = vi.fn();
    render(
      <MonthCalendar
        annee={2026}
        mois={8}
        evenements={evenements}
        taches={taches}
        aujourdhui="2026-09-01"
        onJourClic={onJourClic}
        onSelectEvenement={onSelectEvenement}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Finale Eloquentia')).toBeInTheDocument();
    expect(screen.getByText('Briefer le jury')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Finale Eloquentia'));
    expect(onSelectEvenement).toHaveBeenCalledWith(evenements[0]);
  });
});
