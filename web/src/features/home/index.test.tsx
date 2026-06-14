import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from './index';
import { contactsStore } from '../crm/store';
import { evenementsStore, tachesStore } from '../calendar/store';

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => localStorage.clear());

  it('affiche le titre et les raccourcis', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /CRM/ }).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByRole('link', { name: /Calendrier/ }).length,
    ).toBeGreaterThan(0);
  });

  it('charge les données de démo de tous les modules', async () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await contactsStore.list()).toHaveLength(20);
      expect(await evenementsStore.list()).toHaveLength(20);
      expect(await tachesStore.list()).toHaveLength(20);
    });
  });
});
