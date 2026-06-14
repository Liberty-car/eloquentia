// Liste des vues disponibles du CRM (ordre d'affichage du selecteur).
export const VUES = [
  { id: 'cartes', label: 'Cartes' },
  { id: 'liste', label: 'Liste' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'badges', label: 'Par badge' },
  { id: 'relances', label: 'Relances' },
  { id: 'tableau', label: 'Tableau de bord' },
] as const;

export type Vue = (typeof VUES)[number]['id'];
