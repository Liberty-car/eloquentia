// Modèle du module Comptabilité : mouvements (revenus et dépenses).

export const TYPES_MOUVEMENT = ['revenu', 'depense'] as const;
export type TypeMouvement = (typeof TYPES_MOUVEMENT)[number];

export const TYPE_LABELS: Record<TypeMouvement, string> = {
  revenu: 'Revenu',
  depense: 'Dépense',
};

// Les catégories sont une taxonomie dynamique gérée dans categories.ts :
// categoriesPour(type), libelleCategorie(id), toutesCategories(), ajouter/supprimer.

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
