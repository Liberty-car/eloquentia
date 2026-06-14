import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from '../features/home';

describe('smoke', () => {
  it("affiche l'en-tête de l'accueil", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
  });
});
