import { createContext, useContext } from 'react';
import type { HumeurBande, JournalEntry, Reaction, Stade } from './types';

// Valeur exposée aux composants. `null` tant que l'état n'est pas calculé ou
// hors du provider.
export interface MascotteContexte {
  nom: string;
  xp: number;
  stade: Stade;
  stadeNom: string;
  progressionStade: number; // 0 à 1
  xpDansStade: number;
  xpStadeSuivant: number | null;
  humeur: number;
  humeurBande: HumeurBande;
  bandeLabel: string;
  journal: JournalEntry[];
  conseil: string;
  reaction: Reaction | null;
  clearReaction: () => void;
  // --- Tamagotchi / personnalité ---
  faim: number; // 0 à 100
  peutNourrir: boolean;
  nourrir: () => boolean; // renvoie true si le repas a eu lieu
  streak: number;
  renommer: (nom: string) => void;
}

export const MascotteContext = createContext<MascotteContexte | null>(null);

export function useMascotte(): MascotteContexte | null {
  return useContext(MascotteContext);
}
