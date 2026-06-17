import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidePanel } from './SidePanel';

describe('SidePanel', () => {
  it('ne rend rien quand fermé', () => {
    render(
      <SidePanel open={false} title="Fiche" onClose={() => {}}>
        Contenu
      </SidePanel>,
    );
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
  });

  it('rend le contenu et déclenche onClose', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open title="Fiche" onClose={onClose}>
        Contenu
      </SidePanel>,
    );
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Fermer le panneau'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
