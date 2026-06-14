// Modele de donnees du CRM : contact, badges (categories) et etapes de prospection.

export const ETAPES = [
  'a_contacter',
  'contacte',
  'en_discussion',
  'conclu',
  'perdu',
] as const;
export type Etape = (typeof ETAPES)[number];

export const ETAPE_LABELS: Record<Etape, string> = {
  a_contacter: 'À contacter',
  contacte: 'Contacté',
  en_discussion: 'En discussion',
  conclu: 'Conclu',
  perdu: 'Perdu',
};

export const BADGES = [
  'partenaire',
  'jury',
  'participant',
  'benevole',
  'intervenant',
  'lead',
] as const;
export type BadgeId = (typeof BADGES)[number];

export const BADGE_LABELS: Record<BadgeId, string> = {
  partenaire: 'Partenaire',
  jury: 'Jury',
  participant: 'Participant',
  benevole: 'Bénévole',
  intervenant: 'Intervenant',
  lead: 'Lead',
};

// Tonalite visuelle de chaque badge (parmi les tons du composant Badge).
export const BADGE_TONE: Record<BadgeId, 'rose' | 'jaune' | 'neutre'> = {
  partenaire: 'rose',
  jury: 'jaune',
  participant: 'neutre',
  benevole: 'rose',
  intervenant: 'jaune',
  lead: 'rose',
};

export type Source = 'manuel' | 'import' | 'formulaire';

export interface Contact {
  id: string;
  prenom: string;
  nom: string;
  organisation?: string;
  fonction?: string;
  email?: string;
  telephone?: string;
  badges: BadgeId[];
  etape: Etape;
  notes?: string;
  source: Source;
  dateCreation: string; // ISO (AAAA-MM-JJ), <= 2026-09-30
  dateDerniereInteraction?: string; // ISO, <= 2026-09-30
  prochaineRelance?: string; // ISO, optionnel
}

// Champs editables dans la fiche (le reste est gere par la page).
export interface ContactFormValues {
  prenom: string;
  nom: string;
  organisation: string;
  fonction: string;
  email: string;
  telephone: string;
  etape: Etape;
  badges: BadgeId[];
  notes: string;
}
