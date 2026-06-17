import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadCaptureView } from './LeadCaptureView';

describe('LeadCaptureView', () => {
  it('soumet les valeurs du lead puis réinitialise', () => {
    const onSubmit = vi.fn();
    render(<LeadCaptureView onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Marie' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Durand' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'marie@example.fr' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer/ }));
    expect(onSubmit).toHaveBeenCalledWith({
      prenom: 'Marie',
      nom: 'Durand',
      organisation: '',
      email: 'marie@example.fr',
      message: '',
    });
    // Réinitialisation.
    expect((screen.getByLabelText('Prénom') as HTMLInputElement).value).toBe(
      '',
    );
  });

  it("désactive l'envoi sans prénom ni nom", () => {
    render(<LeadCaptureView onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /Envoyer/ })).toBeDisabled();
  });
});
