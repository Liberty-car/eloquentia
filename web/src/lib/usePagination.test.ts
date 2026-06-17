import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

const items = Array.from({ length: 23 }, (_, i) => i);

describe('usePagination', () => {
  it('découpe la première page selon la taille', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.elementsPage).toHaveLength(10);
    expect(result.current.elementsPage[0]).toBe(0);
    expect(result.current.nbPages).toBe(3);
    expect(result.current.total).toBe(23);
    expect(result.current.debut).toBe(0);
  });

  it('navigue entre les pages', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    expect(result.current.elementsPage).toEqual([20, 21, 22]);
    expect(result.current.debut).toBe(20);
  });

  it('borne la page courante quand la liste rétrécit', () => {
    const { result, rerender } = renderHook(
      ({ data }) => usePagination(data, 10),
      { initialProps: { data: items } },
    );
    act(() => result.current.setPage(3));
    rerender({ data: items.slice(0, 5) });
    expect(result.current.page).toBe(1);
    expect(result.current.elementsPage).toHaveLength(5);
  });

  it('revient à la page 1 quand resetKey change', () => {
    const { result, rerender } = renderHook(
      ({ key }) => usePagination(items, 10, key),
      { initialProps: { key: 'a' } },
    );
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    rerender({ key: 'b' });
    expect(result.current.page).toBe(1);
  });

  it('changerTaille revient à la première page', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.setPage(3));
    act(() => result.current.changerTaille(25));
    expect(result.current.page).toBe(1);
    expect(result.current.taille).toBe(25);
    expect(result.current.nbPages).toBe(1);
  });
});
