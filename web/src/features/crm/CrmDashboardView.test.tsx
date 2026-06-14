import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrmDashboardView } from './CrmDashboardView';
import type { Contact } from './types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'Lucie',
    nom: 'Martin',
    badges: ['partenaire'],
    etape: 'en_discussion',
    source: 'manuel',
    dateCreation: '2026-01-01',
    prochaineRelance: '2000-01-01',
  },
  {
    id: '2',
    prenom: 'Karim',
    nom: 'Benali',
    badges: ['jury'],
    etape: 'en_discussion',
    source: 'manuel',
    dateCreation: '2026-01-02',
  },
];

describe('CrmDashboardView', () => {
  it('affiche les KPIs chiffrés', () => {
    render(<CrmDashboardView contacts={contacts} />);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Relances en retard')).toBeInTheDocument();
    // 2 contacts au total.
    expect(screen.getByTestId('kpi-contacts')).toHaveTextContent('2');
    // 1 relance en retard.
    expect(screen.getByTestId('kpi-retard')).toHaveTextContent('1');
  });
});
