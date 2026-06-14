// Modèles de la mascotte « Quetia » : état persistant, journal et réactions.
import type { Contact } from '../crm/types';
import type { Evenement, Tache } from '../calendar/types';
import type { Mouvement } from '../accounting/types';
import type { Campagne } from '../mail/types';

export type Stade = 1 | 2 | 3 | 4;

export type HumeurBande = 'epuise' | 'fatigue' | 'serein' | 'radieux';

// Nature d'un événement marquant (sert au journal et aux micro-réactions).
export type ReactionType =
  | 'tache_faite'
  | 'contact_conclu'
  | 'revenu'
  | 'evenement'
  | 'campagne'
  | 'depense'
  | 'contact_perdu'
  | 'levelup';

export type Axe = 'xp' | 'humeur';

export interface JournalEntry {
  id: string;
  type: ReactionType;
  label: string;
  axe: Axe;
  delta: number;
  date: string; // ISO datetime
}

// Compteurs idempotents : recalculés depuis les stores, jamais incrémentés.
export interface Compteurs {
  tachesFaites: number;
  contactsConclus: number;
  contactsPerdus: number;
  revenus: number;
  depenses: number;
  evenementsPasses: number;
  campagnesEnvoyees: number;
}

// Micro-réaction transitoire à jouer une fois sur la créature.
export interface Reaction {
  id: string;
  type: ReactionType;
  texte: string; // ex. « +25 XP » ou « -14 »
  positif: boolean;
}

export interface MascotteState {
  xp: number;
  stade: Stade;
  humeur: number; // 0 à 100
  humeurBande: HumeurBande;
  lastComputedAt: string; // ISO
  lastSeenCounts: Compteurs;
  journal: JournalEntry[]; // max JOURNAL_MAX, FIFO
}

// Données brutes lues dans les stores existants (lecture seule).
export interface DonneesMascotte {
  contacts: Contact[];
  taches: Tache[];
  evenements: Evenement[];
  mouvements: Mouvement[];
  campagnes: Campagne[];
}

export interface StadeInfo {
  stade: Stade;
  nom: string;
  xpDansStade: number;
  xpStadeSuivant: number | null; // null au dernier stade
  progressionStade: number; // 0 à 1 (1 au dernier stade)
}
