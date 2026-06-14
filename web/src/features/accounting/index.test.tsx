import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountingPage from './index';
import { mouvementsStore } from './store';

describe('AccountingPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les données de démo', async () => {
    render(<AccountingPage />);
    expect(
      screen.getByRole('heading', { name: 'Comptabilité' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await mouvementsStore.list()).toHaveLength(20);
    });
  });

  it('ouvre la création via "Nouveau mouvement"', async () => {
    render(<AccountingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nouveau mouvement' }));
    expect(
      await screen.findByText('Nouveau mouvement', { selector: 'h2' }),
    ).toBeInTheDocument();
  });

  it('bascule sur la vue Tableau de bord', async () => {
    render(<AccountingPage />);
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await mouvementsStore.list()).toHaveLength(20);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tableau de bord' }));
    expect(await screen.findByTestId('kpi-revenus')).toBeInTheDocument();
  });
});
