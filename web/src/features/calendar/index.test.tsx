import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './index';

describe('CalendarPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les données de démo et affiche un événement', async () => {
    render(<CalendarPage />);
    expect(
      screen.getByRole('heading', { name: 'Calendrier' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    // L'evenement de septembre 2026 apparait apres navigation jusqu'a ce mois.
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Données de démo/ }),
      ).toHaveTextContent('activées'),
    );
  });

  it('ouvre la création via "Nouvel événement"', async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nouvel événement' }));
    expect(
      await screen.findByText('Nouvel événement', { selector: 'h2' }),
    ).toBeInTheDocument();
  });
});
