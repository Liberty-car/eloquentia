// Vues du module Comptabilité (ordre du sélecteur).
export const VUES_COMPTA = [
  { id: 'liste', label: 'Liste' },
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'previsionnel', label: 'Prévisionnel' },
] as const;

export type VueCompta = (typeof VUES_COMPTA)[number]['id'];
