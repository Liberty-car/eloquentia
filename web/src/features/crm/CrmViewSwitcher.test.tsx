import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CrmViewSwitcher } from './CrmViewSwitcher';

describe('CrmViewSwitcher', () => {
  it('affiche les vues et émet la sélection', () => {
    const onChange = vi.fn();
    render(<CrmViewSwitcher value="cartes" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Cartes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kanban' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onChange).toHaveBeenCalledWith('kanban');
  });
});
