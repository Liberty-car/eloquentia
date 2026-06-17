import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('affiche son libellé', () => {
    render(<Button>Enregistrer</Button>);
    expect(
      screen.getByRole('button', { name: 'Enregistrer' }),
    ).toBeInTheDocument();
  });

  it('applique la variante primaire', () => {
    render(<Button variant="primary">Valider</Button>);
    expect(screen.getByRole('button', { name: 'Valider' }).className).toContain(
      'bg-gel-rose',
    );
  });
});
