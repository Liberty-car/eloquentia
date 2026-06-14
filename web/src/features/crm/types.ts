// Modele de donnees du CRM : contact, badges (categories) et etapes de prospection.

export const ETAPES = [
  'a_contacter',
  'contacte',
  'a_relancer',
  'en_discussion',
  'conclu',
  'perdu',
] as const;
export type Etape = (typeof ETAPES)[number];

export const ETAPE_LABELS: Record<Etape, string> = {
  a_contacter: 'À contacter',
  contacte: 'Contacté',
  a_relancer: 'À relancer',
  en_discussion: 'En discussion',
  conclu: 'Conclu',
  perdu: 'Perdu',
};

// Les badges (catégories de contacts) sont une taxonomie dynamique gérée dans
// badges.ts : libelleBadge(id), toneBadge(id), tousBadges(), ajouter/supprimer.
// Un badge est identifié par une chaîne (id).
export type BadgeId = string;

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
