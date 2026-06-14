// Vues du module Mail (ordre du sélecteur).
export const VUES_MAIL = [
  { id: 'composer', label: 'Composer' },
  { id: 'leads', label: 'Capture de leads' },
  { id: 'historique', label: 'Historique' },
] as const;

export type VueMail = (typeof VUES_MAIL)[number]['id'];
