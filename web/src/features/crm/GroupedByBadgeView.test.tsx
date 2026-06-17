import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupedByBadgeView } from './GroupedByBadgeView';
import type { Contact } from './types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'Lucie',
    nom: 'Martin',
    badges: ['partenaire', 'jury'],
    etape: 'en_discussion',
    source: 'manuel',
    dateCreation: '2026-01-01',
  },
];

describe('GroupedByBadgeView', () => {
  it('affiche le contact dans chaque section de badge concernée', () => {
    render(<GroupedByBadgeView contacts={contacts} onSelect={() => {}} />);
    expect(
      screen.getByRole('heading', { name: /Partenaire/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Jury/ })).toBeInTheDocument();
    // Le contact (multi-badges) apparait dans les deux sections.
    expect(screen.getAllByText('Lucie Martin')).toHaveLength(2);
  });
});
