import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../features/home';

describe('smoke', () => {
  it("affiche l'en-tête de l'accueil", () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
  });
});
