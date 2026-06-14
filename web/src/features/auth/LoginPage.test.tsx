import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../lib/auth/AuthContext';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('affiche le formulaire de connexion', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Se connecter' }),
    ).toBeInTheDocument();
  });
});
