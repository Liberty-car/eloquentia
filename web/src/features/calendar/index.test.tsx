import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './index';
import { evenementsStore, tachesStore } from './store';

describe('CalendarPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les données de démo (événements et tâches)', async () => {
    render(<CalendarPage />);
    expect(
      screen.getByRole('heading', { name: 'Calendrier' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    // Verification directe des stores : independant du mois affiche (horloge reelle en test).
    await waitFor(async () => {
      expect(await evenementsStore.list()).toHaveLength(20);
      expect(await tachesStore.list()).toHaveLength(20);
    });
  });

  it('ouvre la création via "Nouvel événement"', async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nouvel événement' }));
    expect(
      await screen.findByText('Nouvel événement', { selector: 'h2' }),
    ).toBeInTheDocument();
  });

  it('bascule sur la vue Par statut', async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await tachesStore.list()).toHaveLength(20);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Par statut' }));
    expect(await screen.findByText('En cours')).toBeInTheDocument();
  });
});
