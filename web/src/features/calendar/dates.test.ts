import { describe, it, expect } from 'vitest';
import { formatDateFr } from './dates';

describe('formatDateFr', () => {
  it('formate une date ISO en français', () => {
    expect(formatDateFr('2026-09-12')).toMatch(/12/);
    expect(formatDateFr('2026-09-12')).toMatch(/2026/);
  });
});
