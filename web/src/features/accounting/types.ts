// Modèle du module Comptabilité : mouvements (revenus et dépenses).

export const TYPES_MOUVEMENT = ['revenu', 'depense'] as const;
export type TypeMouvement = (typeof TYPES_MOUVEMENT)[number];

export const TYPE_LABELS: Record<TypeMouvement, string> = {
  revenu: 'Revenu',
  depense: 'Dépense',
};

export const CATEGORIES_REVENU = [
  'dons',
  'subventions',
  'sponsoring',
  'billetterie',
  'autre',
] as const;

export const CATEGORIES_DEPENSE = [
  'logistique',
  'communication',
  'materiel',
  'restauration',
  'autre',
] as const;

export const CATEGORIE_LABELS: Record<string, string> = {
  dons: 'Dons',
  subventions: 'Subventions',
  sponsoring: 'Sponsoring',
  billetterie: 'Billetterie',
  logistique: 'Logistique',
  communication: 'Communication',
  materiel: 'Matériel',
  restauration: 'Restauration',
  autre: 'Autre',
};

export function categoriesPour(type: TypeMouvement): readonly string[] {
  return type === 'revenu' ? CATEGORIES_REVENU : CATEGORIES_DEPENSE;
}

export function libelleCategorie(categorie: string): string {
  return CATEGORIE_LABELS[categorie] ?? categorie;
}

export interface Mouvement {
  id: string;
  type: TypeMouvement;
  libelle: string;
  montant: number; // EUR, TOUJOURS POSITIF. La direction vient de `type`.
  date: string; // ISO AAAA-MM-JJ. Réel <= 2026-09-30 ; prévisionnel <= 2028-07-31.
  categorie: string;
  previsionnel: boolean;
  evenementId?: string;
  justificatif?: string; // nom de fichier seulement (pas le contenu)
}

// Champs éditables dans la fiche (saisie brute).
export interface MouvementFormValues {
  type: TypeMouvement;
  libelle: string;
  montant: string;
  date: string;
  categorie: string;
  previsionnel: boolean;
  evenementId: string;
  justificatif: string;
}
