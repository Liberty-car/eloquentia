import { describe, it, expect } from 'vitest';
import {
  ALLOWED_MIME_TYPES,
  buildStoragePath,
  sanitizeFileName,
  storagePathMatches,
} from './attachments.schemas';

describe('sanitizeFileName', () => {
  it('remplace les caractères dangereux par des tirets', () => {
    expect(sanitizeFileName('mon rapport (final)!.pdf')).toBe(
      'mon-rapport-final-.pdf',
    );
  });
  it('neutralise les tentatives de traversée de chemin', () => {
    expect(sanitizeFileName('../../etc/passwd')).toBe('etc-passwd');
  });
});

describe('buildStoragePath', () => {
  it('compose <type>/<id>/<cuid>-<nom>', () => {
    const path = buildStoragePath('task', 'abc', 'cuid123', 'photo.png');
    expect(path).toBe('task/abc/cuid123-photo.png');
  });
});

describe('storagePathMatches', () => {
  it('accepte un chemin avec le bon préfixe', () => {
    expect(storagePathMatches('task/abc/x-1.png', 'task', 'abc')).toBe(true);
  });
  it('refuse un chemin avec un mauvais préfixe', () => {
    expect(storagePathMatches('event/zzz/x-1.png', 'task', 'abc')).toBe(false);
  });
});

describe('ALLOWED_MIME_TYPES', () => {
  it('contient pdf et png mais pas exe', () => {
    expect(ALLOWED_MIME_TYPES).toContain('application/pdf');
    expect(ALLOWED_MIME_TYPES).toContain('image/png');
    expect(ALLOWED_MIME_TYPES).not.toContain('application/x-msdownload');
  });
});
