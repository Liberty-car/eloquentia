import type { Contact } from '../crm/types';
import type { SegmentBadge } from './types';

export function destinataires(
  contacts: Contact[],
  segment: SegmentBadge,
): Contact[] {
  return contacts.filter(
    (c) =>
      Boolean(c.email) && (segment === 'tous' || c.badges.includes(segment)),
  );
}

export function compterDestinataires(
  contacts: Contact[],
  segment: SegmentBadge,
): number {
  return destinataires(contacts, segment).length;
}
