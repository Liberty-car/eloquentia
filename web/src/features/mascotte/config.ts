// Toutes les constantes ajustables de la mascotte « Quetia ».
import type { Axe, EvenementCompteur, HumeurBande, Stade } from './types';

export const NOM = 'Quetia';

// --- Axe 1 : XP (permanent) ---

export const XP_POIDS = {
  tacheFaite: 10,
  contactConclu: 25,
  revenu: 12,
  evenementPasse: 18,
  campagne: 8,
} as const;

// Bonus de montant par revenu : floor(montant / PALIER), plafonné.
export const XP_BONUS_REVENU_PALIER = 500;
export const XP_BONUS_REVENU_MAX = 10;

export const SEUILS_STADE: { stade: Stade; xp: number; nom: string }[] = [
  { stade: 1, xp: 0, nom: 'Quetia bébé' },
  { stade: 2, xp: 150, nom: 'Quetia juvénile' },
  { stade: 3, xp: 500, nom: 'Quetia adulte' },
  { stade: 4, xp: 1200, nom: 'Quetia rayonnant' },
];

// --- Axe 2 : humeur / fatigue (transitoire) ---

export const FENETRE_JOURS = 14;
export const BASE_HUMEUR = 60;

export const HUMEUR_POIDS = {
  revenu: 6,
  revenuBonusParMille: 1, // + min(floor(montant/1000), MAX)
  revenuBonusMax: 6,
  contactConclu: 12,
  tacheFaite: 4,
  evenementProche: 2, // événement à venir dans EVENEMENT_PROCHE_JOURS
  depense: -6,
  depenseBonusMax: 6, // - min(floor(montant/1000), MAX)
  contactPerdu: -14,
  tacheRetard: -5,
  tacheRetardHaute: -3, // malus supplémentaire si priorité haute
} as const;

export const EVENEMENT_PROCHE_JOURS = 7;

// --- Faim (Tamagotchi) ---

export const FAIM_MAX = 100;
// Vitesse de décroissance de la faim (points par heure réelle écoulée).
export const FAIM_POINTS_PAR_HEURE = 4;
// On ne peut nourrir que si la faim est descendue sous ce seuil (pas de gavage).
export const FAIM_SEUIL_REPAS = 85;
// La faim pèse sur l'humeur en dessous de ce seuil, jusqu'à un malus maximal.
export const FAIM_SEUIL_MALUS = 50;
export const FAIM_MALUS_MAX = 15;

// --- Cycle jour / nuit ---

export const NUIT_DEBUT_HEURE = 21; // 21h
export const NUIT_FIN_HEURE = 7; // 7h

// Décroissance d'inactivité : 2 par jour sans action positive, plafonnée.
export const INACTIVITE_PAR_JOUR = 2;
export const INACTIVITE_JOURS_MAX = 7;

export const BANDES: {
  bande: HumeurBande;
  min: number;
  max: number;
  label: string;
}[] = [
  { bande: 'epuise', min: 0, max: 24, label: 'épuisée' },
  { bande: 'fatigue', min: 25, max: 49, label: 'fatiguée' },
  { bande: 'serein', min: 50, max: 74, label: 'sereine' },
  { bande: 'radieux', min: 75, max: 100, label: 'radieuse' },
];

// --- Journal et réactions ---

export const JOURNAL_MAX = 30;

// Libellé, axe et delta unitaire d'un type d'événement marquant.
export const EVENEMENT_META: Record<
  EvenementCompteur,
  { label: string; axe: Axe; unite: number; positif: boolean }
> = {
  tache_faite: { label: 'Tâche terminée', axe: 'xp', unite: 10, positif: true },
  contact_conclu: {
    label: 'Contact conclu',
    axe: 'xp',
    unite: 25,
    positif: true,
  },
  revenu: { label: 'Revenu enregistré', axe: 'xp', unite: 12, positif: true },
  evenement: {
    label: 'Événement réalisé',
    axe: 'xp',
    unite: 18,
    positif: true,
  },
  campagne: { label: 'Campagne envoyée', axe: 'xp', unite: 8, positif: true },
  depense: { label: 'Dépense', axe: 'humeur', unite: -6, positif: false },
  contact_perdu: {
    label: 'Contact perdu',
    axe: 'humeur',
    unite: -14,
    positif: false,
  },
};

// Du plus saillant au moins saillant : choisit la réaction quand plusieurs
// événements surviennent au même recalcul.
export const PRIORITE_REACTION: EvenementCompteur[] = [
  'contact_perdu',
  'contact_conclu',
  'depense',
  'tache_faite',
  'revenu',
  'evenement',
  'campagne',
];

// Correspondance compteur -> type d'événement.
export const COMPTEUR_VERS_TYPE: Record<
  keyof import('./types').Compteurs,
  EvenementCompteur
> = {
  tachesFaites: 'tache_faite',
  contactsConclus: 'contact_conclu',
  revenus: 'revenu',
  evenementsPasses: 'evenement',
  campagnesEnvoyees: 'campagne',
  depenses: 'depense',
  contactsPerdus: 'contact_perdu',
};
