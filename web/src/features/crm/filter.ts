import type { BadgeId, Contact, Etape } from './types';

export interface ContactFilters {
  recherche: string;
  badges: BadgeId[];
  etape: Etape | 'toutes';
}

export function filterContacts(
  contacts: Contact[],
  filters: ContactFilters,
): Contact[] {
  const recherche = filters.recherche.trim().toLowerCase();
  return contacts.filter((contact) => {
    if (filters.etape !== 'toutes' && contact.etape !== filters.etape) {
      return false;
    }
    if (
      filters.badges.length > 0 &&
      !filters.badges.some((b) => contact.badges.includes(b))
    ) {
      return false;
    }
    if (recherche) {
      const champs = [
        contact.prenom,
        contact.nom,
        contact.organisation ?? '',
        contact.email ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!champs.includes(recherche)) {
        return false;
      }
    }
    return true;
  });
}
