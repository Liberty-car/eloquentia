import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactImport } from './ContactImport';

describe('ContactImport', () => {
  it('analyse un fichier CSV et importe les contacts', async () => {
    const onImport = vi.fn();
    render(<ContactImport open onClose={() => {}} onImport={onImport} />);

    const csv = 'prenom,nom,email\nLucie,Martin,lucie@paris.fr\n';
    const file = new File([csv], 'contacts.csv', { type: 'text/csv' });
    const input = screen.getByTestId('import-fichier');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByText(/1 contact prêt/)).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /Importer/ }));
    expect(onImport).toHaveBeenCalledOnce();
    expect(onImport.mock.calls[0]![0]).toHaveLength(1);
  });
});
