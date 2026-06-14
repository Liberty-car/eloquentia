import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CrmFilters } from './CrmFilters';

describe('CrmFilters', () => {
  it('émet la recherche et la bascule de badge', () => {
    const onChange = vi.fn();
    render(
      <CrmFilters
        value={{ recherche: '', badges: [], etape: 'toutes' }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Rechercher un contact...'), {
      target: { value: 'lucie' },
    });
    expect(onChange).toHaveBeenCalledWith({
      recherche: 'lucie',
      badges: [],
      etape: 'toutes',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Jury' }));
    expect(onChange).toHaveBeenCalledWith({
      recherche: '',
      badges: ['jury'],
      etape: 'toutes',
    });
  });
});
