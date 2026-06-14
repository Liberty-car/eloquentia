import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarFilters } from './CalendarFilters';
import { FILTRES_CAL_INITIAUX } from './filter';

describe('CalendarFilters', () => {
  it('expose la recherche et les filtres de tâches par défaut', () => {
    render(
      <CalendarFilters filtres={FILTRES_CAL_INITIAUX} onChange={() => {}} />,
    );
    expect(
      screen.getByLabelText("Rechercher dans l'agenda"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrer par statut')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrer par membre')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrer par priorité')).toBeInTheDocument();
  });

  it('masque les filtres de tâches quand on ne montre que les événements', () => {
    render(
      <CalendarFilters
        filtres={{ ...FILTRES_CAL_INITIAUX, type: 'evenements' }}
        onChange={() => {}}
      />,
    );
    expect(
      screen.queryByLabelText('Filtrer par statut'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Filtrer par membre'),
    ).not.toBeInTheDocument();
  });

  it('remonte le changement de type', () => {
    const onChange = vi.fn();
    render(
      <CalendarFilters filtres={FILTRES_CAL_INITIAUX} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tâches' }));
    expect(onChange).toHaveBeenCalledWith({
      ...FILTRES_CAL_INITIAUX,
      type: 'taches',
    });
  });
});
