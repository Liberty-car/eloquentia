import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactCard } from './ContactCard';
import type { Contact } from './types';

const contact: Contact = {
  id: '1',
  prenom: 'Lucie',
  nom: 'Martin',
  organisation: 'Mairie de Paris',
  badges: ['partenaire', 'jury'],
  etape: 'en_discussion',
  source: 'manuel',
  dateCreation: '2026-01-01',
};

describe('ContactCard', () => {
  it("affiche le nom, l'organisation et les badges", () => {
    render(<ContactCard contact={contact} onClick={() => {}} />);
    expect(screen.getByText('Lucie Martin')).toBeInTheDocument();
    expect(screen.getByText('Mairie de Paris')).toBeInTheDocument();
    expect(screen.getByText('Partenaire')).toBeInTheDocument();
    expect(screen.getByText('Jury')).toBeInTheDocument();
  });

  it('déclenche onClick', () => {
    const onClick = vi.fn();
    render(<ContactCard contact={contact} onClick={onClick} />);
    fireEvent.click(screen.getByText('Lucie Martin'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
