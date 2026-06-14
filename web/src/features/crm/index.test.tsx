import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrmPage from './index';

describe('CrmPage', () => {
  beforeEach(() => localStorage.clear());

  it("affiche l'état vide puis charge les données de démo", async () => {
    render(<CrmPage />);
    expect(screen.getByRole('heading', { name: 'CRM' })).toBeInTheDocument();
    expect(await screen.findByText('Aucun contact')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(() =>
      expect(screen.getByText('Lucie Martin')).toBeInTheDocument(),
    );
  });

  it('ouvre la fiche de création via "Nouveau contact"', async () => {
    render(<CrmPage />);
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Nouveau contact' })[0]!,
    );
    expect(
      await screen.findByText('Nouveau contact', { selector: 'h2' }),
    ).toBeInTheDocument();
  });

  it('bascule sur le tableau de bord', async () => {
    render(<CrmPage />);
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(() =>
      expect(screen.getByText('Lucie Martin')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tableau de bord' }));
    expect(await screen.findByText('Contacts')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-contacts')).toHaveTextContent('20');
  });
});
