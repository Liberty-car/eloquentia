import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MailPage from './index';
import { campagnesStore } from './store';
import { contactsStore } from '../crm/store';

describe('MailPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les campagnes de démo', async () => {
    render(<MailPage />);
    expect(
      screen.getByRole('heading', { name: 'Mail marketing' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await campagnesStore.list()).toHaveLength(6);
    });
  });

  it('crée un lead dans le CRM depuis la capture', async () => {
    render(<MailPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Capture de leads' }));
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Marie' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Durand' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer la demande/ }));
    await waitFor(async () => {
      const contacts = await contactsStore.list();
      const lead = contacts.find((c) => c.nom === 'Durand');
      expect(lead).toBeTruthy();
      expect(lead?.badges).toContain('lead');
      expect(lead?.source).toBe('formulaire');
      expect(lead?.etape).toBe('a_contacter');
    });
  });

  it("envoie une campagne et l'ajoute à l'historique", async () => {
    render(<MailPage />);
    // Donne des destinataires : seed CRM via la démo de campagnes ? Non :
    // on crée d'abord un lead avec email pour avoir >= 1 destinataire.
    fireEvent.click(screen.getByRole('button', { name: 'Capture de leads' }));
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Jean' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Martin' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jean@example.fr' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer la demande/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Composer' }));
    await waitFor(() =>
      expect(screen.getByTestId('destinataires-count').textContent).toContain(
        '1',
      ),
    );
    fireEvent.change(screen.getByLabelText('Sujet'), {
      target: { value: 'Test campagne' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Envoyer la campagne/ }),
    );
    await waitFor(async () => {
      const camps = await campagnesStore.list();
      expect(camps.some((c) => c.sujet === 'Test campagne')).toBe(true);
    });
  });
});
