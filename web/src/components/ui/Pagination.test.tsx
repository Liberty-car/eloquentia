import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

const base = {
  page: 2,
  nbPages: 3,
  total: 23,
  taille: 10,
  debut: 10,
  nbAffiches: 10,
  onPageChange: () => {},
  onTailleChange: () => {},
};

describe('Pagination', () => {
  it('ne rend rien sans élément', () => {
    const { container } = render(<Pagination {...base} total={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('affiche la plage et le numéro de page', () => {
    render(<Pagination {...base} />);
    expect(screen.getByText('11-20 sur 23')).toBeInTheDocument();
    expect(screen.getByText('Page 2 / 3')).toBeInTheDocument();
  });

  it('navigue vers la page précédente et suivante', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...base} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Page suivante'));
    expect(onPageChange).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByLabelText('Page précédente'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('désactive les bornes aux extrémités', () => {
    const { rerender } = render(<Pagination {...base} page={1} debut={0} />);
    expect(screen.getByLabelText('Page précédente')).toBeDisabled();
    expect(screen.getByLabelText('Page suivante')).not.toBeDisabled();
    rerender(<Pagination {...base} page={3} debut={20} nbAffiches={3} />);
    expect(screen.getByLabelText('Page suivante')).toBeDisabled();
  });

  it('change la taille de page', () => {
    const onTailleChange = vi.fn();
    render(<Pagination {...base} onTailleChange={onTailleChange} />);
    fireEvent.change(screen.getByLabelText('Lignes par page'), {
      target: { value: '25' },
    });
    expect(onTailleChange).toHaveBeenCalledWith(25);
  });
});
