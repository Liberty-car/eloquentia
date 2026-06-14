import type { Campagne } from './types';

// 6 campagnes fictives déjà "envoyées" (mock).
export function seedCampagnes(): Campagne[] {
  return [
    {
      id: 'k1',
      sujet: 'Lancement de la saison 2026',
      corps:
        "Bonjour,\n\nLa nouvelle saison d'Eloquentia est lancée. Restez connectés pour les prochaines étapes du concours.\n\nÀ très vite,\nL'équipe Eloquentia",
      segment: 'tous',
      destinataires: 18,
      date: '2026-06-02',
      statut: 'envoye',
    },
    {
      id: 'k2',
      sujet: 'Appel à bénévoles - finale',
      corps:
        'Bonjour,\n\nNous recherchons des bénévoles pour la finale. Merci de nous indiquer vos disponibilités.\n\nMerci !',
      segment: 'benevole',
      destinataires: 4,
      date: '2026-06-18',
      statut: 'envoye',
    },
    {
      id: 'k3',
      sujet: 'Invitation jury - demi-finale',
      corps:
        'Cher membre du jury,\n\nNous avons le plaisir de vous convier à la demi-finale. Détails à suivre.\n\nBien à vous',
      segment: 'jury',
      destinataires: 3,
      date: '2026-07-22',
      statut: 'envoye',
    },
    {
      id: 'k4',
      sujet: 'Newsletter partenaires - juillet',
      corps:
        'Chers partenaires,\n\nDécouvrez les temps forts du mois et nos remerciements pour votre soutien.\n\nCordialement',
      segment: 'partenaire',
      destinataires: 6,
      date: '2026-07-30',
      statut: 'envoye',
    },
    {
      id: 'k5',
      sujet: 'La billetterie de la finale est ouverte',
      corps:
        'Bonjour,\n\nRéservez dès maintenant votre place pour la grande finale au Théâtre de la Ville.\n\nÀ bientôt',
      segment: 'tous',
      destinataires: 20,
      date: '2026-09-01',
      statut: 'envoye',
    },
    {
      id: 'k6',
      sujet: 'Merci aux intervenants',
      corps:
        'Bonjour,\n\nUn grand merci pour vos ateliers de cette saison. Vos retours sont précieux.\n\nMerci encore',
      segment: 'intervenant',
      destinataires: 2,
      date: '2026-09-20',
      statut: 'envoye',
    },
  ];
}
