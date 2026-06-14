// Catégories comptables : taxonomie dynamique par type (revenu / dépense),
// adossée à localStorage. La catégorie « autre » de chaque type est protégée
// pour garantir qu'un type conserve toujours au moins une catégorie.
import { createTaxonomy } from '../../lib/taxonomy/createTaxonomy';
import type { TypeMouvement } from './types';

export interface CategorieDef {
  id: string;
  label: string;
  type: TypeMouvement;
  protege?: boolean;
}

const DEFAUTS: CategorieDef[] = [
  { id: 'dons', label: 'Dons', type: 'revenu' },
  { id: 'subventions', label: 'Subventions', type: 'revenu' },
  { id: 'sponsoring', label: 'Sponsoring', type: 'revenu' },
  { id: 'billetterie', label: 'Billetterie', type: 'revenu' },
  { id: 'autre-revenu', label: 'Autre', type: 'revenu', protege: true },
  { id: 'logistique', label: 'Logistique', type: 'depense' },
  { id: 'communication', label: 'Communication', type: 'depense' },
  { id: 'materiel', label: 'Matériel', type: 'depense' },
  { id: 'restauration', label: 'Restauration', type: 'depense' },
  { id: 'autre-depense', label: 'Autre', type: 'depense', protege: true },
];

const taxonomie = createTaxonomy<CategorieDef>(
  'accounting:categories',
  DEFAUTS,
);

export function toutesCategories(): CategorieDef[] {
  return taxonomie.liste();
}

export function categoriesPour(type: TypeMouvement): CategorieDef[] {
  return taxonomie.liste().filter((c) => c.type === type);
}

export function libelleCategorie(id: string): string {
  return taxonomie.label(id);
}

export function categorieProtegee(id: string): boolean {
  return taxonomie.item(id)?.protege ?? false;
}

// Catégorie « autre » du type donné (cible de repli en cas de suppression).
export function categorieParDefaut(type: TypeMouvement): string {
  return type === 'revenu' ? 'autre-revenu' : 'autre-depense';
}

export function ajouterCategorie(
  label: string,
  type: TypeMouvement,
): CategorieDef {
  return taxonomie.ajouter({ label, type });
}

export function supprimerCategorie(id: string): boolean {
  return taxonomie.supprimer(id);
}
