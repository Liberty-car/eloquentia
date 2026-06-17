import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { tokenStore } from './tokenStore';

function Probe() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'anonyme'}</span>
      <button onClick={() => login('a@b.fr')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('connecte et déconnecte un utilisateur en mémoire', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByTestId('user')).toHaveTextContent('anonyme');

    fireEvent.click(screen.getByText('login'));
    expect(screen.getByTestId('user')).toHaveTextContent('a@b.fr');
    expect(tokenStore.get()).not.toBeNull();

    fireEvent.click(screen.getByText('logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('anonyme');
    expect(tokenStore.get()).toBeNull();
  });
});
