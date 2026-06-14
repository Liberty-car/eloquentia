import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrmPage from './index';
import { contactsStore } from './store';

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

  it('édition : vider un champ optionnel le supprime', async () => {
    render(<CrmPage />);
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(() =>
      expect(screen.getByText('Lucie Martin')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('Lucie Martin'));
    const champEmail = await screen.findByLabelText('Email');
    fireEvent.change(champEmail, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

    await waitFor(async () => {
      const c = await contactsStore.get('c1');
      expect(c?.email).toBeUndefined();
    });
    // Les autres champs ne doivent pas etre perdus par le remplacement.
    const c = await contactsStore.get('c1');
    expect(c?.source).toBe('manuel');
    expect(c?.dateCreation).toBe('2026-01-12');
    expect(c?.prochaineRelance).toBe('2026-06-20');
  });
});
