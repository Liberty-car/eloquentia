// Vues du module Calendrier (ordre du selecteur).
export const VUES_CAL = [
  { id: 'mois', label: 'Mois' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'membres', label: 'Par membre' },
  { id: 'statut', label: 'Par statut' },
] as const;

export type VueCal = (typeof VUES_CAL)[number]['id'];
