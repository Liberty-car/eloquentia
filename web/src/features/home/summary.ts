import type { Contact } from '../crm/types';
import {
  MEMBRES,
  type Evenement,
  type Membre,
  type Tache,
} from '../calendar/types';

export function evenementsAVenir(
  evenements: Evenement[],
  aujourdhui: string,
  limite = 5,
): Evenement[] {
  return [...evenements]
    .filter((e) => e.date >= aujourdhui)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, limite);
}

export function tachesActives(taches: Tache[]): Tache[] {
  return taches.filter((t) => t.statut !== 'fait');
}

export interface ChargeMembre {
  membre: Membre;
  total: number;
}

// Nombre de tâches actives (non faites) par membre, dans l'ordre de MEMBRES.
export function chargeParMembre(taches: Tache[]): ChargeMembre[] {
  const actives = tachesActives(taches);
  return MEMBRES.map((membre) => ({
    membre,
    total: actives.filter((t) => t.membre === membre).length,
  }));
}

export function derniersContacts(contacts: Contact[], limite = 5): Contact[] {
  return [...contacts]
    .sort((a, b) =>
      a.dateCreation < b.dateCreation
        ? 1
        : a.dateCreation > b.dateCreation
          ? -1
          : 0,
    )
    .slice(0, limite);
}

export function compterLeads(contacts: Contact[]): number {
  return contacts.filter((c) => c.badges.includes('lead')).length;
}
