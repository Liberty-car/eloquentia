import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MascotteProvider } from './MascotteProvider';
import { Mascotte } from './Mascotte';

describe('Mascotte', () => {
  beforeEach(() => localStorage.clear());

  it('affiche la créature avec un aria-label décrivant son état', async () => {
    render(
      <MascotteProvider>
        <Mascotte />
      </MascotteProvider>,
    );
    const bouton = await screen.findByRole('button', { name: /Quetia/ });
    expect(bouton).toBeInTheDocument();
  });
});
