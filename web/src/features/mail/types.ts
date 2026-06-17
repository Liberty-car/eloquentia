// Modèles du module Mail marketing.
import type { BadgeId } from '../crm/types';

// Segment de diffusion : un badge CRM précis, ou tous les contacts.
export type SegmentBadge = BadgeId | 'tous';

export interface Campagne {
  id: string;
  sujet: string;
  corps: string;
  segment: SegmentBadge;
  destinataires: number; // figé au moment de l'envoi
  date: string; // ISO AAAA-MM-JJ
  statut: 'envoye'; // envoi mocké
}

// Valeurs du formulaire de composition.
export interface ComposerValues {
  sujet: string;
  corps: string;
  segment: SegmentBadge;
}

// Valeurs du formulaire de capture de lead.
export interface LeadFormValues {
  prenom: string;
  nom: string;
  organisation: string;
  email: string;
  message: string;
}
