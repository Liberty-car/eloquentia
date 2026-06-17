import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

describe('Badge', () => {
  it('affiche son contenu', () => {
    render(<Badge tone="rose">Partenaire</Badge>);
    expect(screen.getByText('Partenaire')).toBeInTheDocument();
  });
});

describe('Avatar', () => {
  it('affiche les initiales', () => {
    render(<Avatar initials="LM" />);
    expect(screen.getByText('LM')).toBeInTheDocument();
  });
});
