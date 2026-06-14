import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalViewSwitcher } from './CalViewSwitcher';

describe('CalViewSwitcher', () => {
  it('affiche les vues et émet la sélection', () => {
    const onChange = vi.fn();
    render(<CalViewSwitcher value="mois" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Mois' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agenda' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Agenda' }));
    expect(onChange).toHaveBeenCalledWith('agenda');
  });
});
