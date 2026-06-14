// Modeles du module Calendrier : evenements et taches.

export const MEMBRES = ['Luciano', 'Eva', 'Armelle', 'Anthony'] as const;
export type Membre = (typeof MEMBRES)[number];

export const STATUTS = ['a_faire', 'en_cours', 'fait'] as const;
export type Statut = (typeof STATUTS)[number];

export const STATUT_LABELS: Record<Statut, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  fait: 'Fait',
};

export const PRIORITES = ['basse', 'moyenne', 'haute'] as const;
export type Priorite = (typeof PRIORITES)[number];

export const PRIORITE_LABELS: Record<Priorite, string> = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute',
};

export interface Evenement {
  id: string;
  titre: string;
  date: string; // ISO AAAA-MM-JJ, <= 2026-09-30
  heure?: string; // HH:MM
  lieu?: string;
  description?: string;
}

export interface Tache {
  id: string;
  titre: string;
  membre: Membre;
  statut: Statut;
  priorite: Priorite;
  echeance?: string; // ISO AAAA-MM-JJ, <= 2026-09-30
  description?: string;
}

// Champs editables dans les fiches.
export interface EvenementFormValues {
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  description: string;
}

export interface TacheFormValues {
  titre: string;
  membre: Membre;
  statut: Statut;
  priorite: Priorite;
  echeance: string;
  description: string;
}
