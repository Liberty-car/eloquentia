// Badges CRM : taxonomie dynamique (ajout/suppression), adossée à localStorage.
import { createTaxonomy } from '../../lib/taxonomy/createTaxonomy';

export type BadgeTone = 'rose' | 'jaune' | 'neutre';

export interface BadgeDef {
  id: string;
  label: string;
  tone: BadgeTone;
  protege?: boolean;
}

// Le badge « lead » est protégé : le formulaire de capture Mail en dépend.
const DEFAUTS: BadgeDef[] = [
  { id: 'partenaire', label: 'Partenaire', tone: 'rose' },
  { id: 'jury', label: 'Jury', tone: 'jaune' },
  { id: 'participant', label: 'Participant', tone: 'neutre' },
  { id: 'benevole', label: 'Bénévole', tone: 'rose' },
  { id: 'intervenant', label: 'Intervenant', tone: 'jaune' },
  { id: 'lead', label: 'Lead', tone: 'rose', protege: true },
];

const TONES: BadgeTone[] = ['rose', 'jaune', 'neutre'];

const taxonomie = createTaxonomy<BadgeDef>('crm:badges', DEFAUTS);

export function tousBadges(): BadgeDef[] {
  return taxonomie.liste();
}

export function libelleBadge(id: string): string {
  return taxonomie.label(id);
}

export function toneBadge(id: string): BadgeTone {
  return taxonomie.item(id)?.tone ?? 'neutre';
}

export function badgeProtege(id: string): boolean {
  return taxonomie.item(id)?.protege ?? false;
}

// Ajoute un badge ; la tonalité est attribuée automatiquement (alternance).
export function ajouterBadge(label: string): BadgeDef {
  const tone = TONES[tousBadges().length % TONES.length] ?? 'neutre';
  return taxonomie.ajouter({ label, tone });
}

export function supprimerBadge(id: string): boolean {
  return taxonomie.supprimer(id);
}
