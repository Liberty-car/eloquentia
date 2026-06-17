import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';

describe('Card', () => {
  it('affiche son contenu', () => {
    render(<Card>Contenu</Card>);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('affiche le titre', () => {
    render(<EmptyState title="Aucun contact" />);
    expect(screen.getByText('Aucun contact')).toBeInTheDocument();
  });
});

describe('PageHeader', () => {
  it('affiche le titre en heading', () => {
    render(<PageHeader title="Accueil" />);
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
  });
});
