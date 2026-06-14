import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../features/dashboard';

describe('smoke', () => {
  it('affiche le placeholder du tableau de bord', () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole('heading', { name: 'Tableau de bord' }),
    ).toBeInTheDocument();
  });
});
