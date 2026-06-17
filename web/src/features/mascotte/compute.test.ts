import { describe, it, expect } from 'vitest';
import {
  bandeHumeur,
  computeCompteurs,
  computeFaim,
  computeHumeur,
  computeStade,
  computeXp,
  conseil,
  diffEvents,
  estNuit,
  messageBulle,
  penaliteFaim,
  tachesEnRetard,
} from './compute';
import type { Compteurs, DonneesMascotte } from './types';
import type { Contact } from '../crm/types';
import type { Evenement, Tache } from '../calendar/types';
import type { Mouvement } from '../accounting/types';
import type { Campagne } from '../mail/types';

const TODAY = '2026-06-14';

function contact(p: Partial<Contact>): Contact {
  return {
    id: 'c',
    prenom: 'A',
    nom: 'B',
    badges: [],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-01-01',
    ...p,
  };
}
function tache(p: Partial<Tache>): Tache {
  return {
    id: 't',
    titre: 'T',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'moyenne',
    ...p,
  };
}
function evenement(p: Partial<Evenement>): Evenement {
  return { id: 'e', titre: 'E', date: '2026-06-01', ...p };
}
function mouvement(p: Partial<Mouvement>): Mouvement {
  return {
    id: 'm',
    type: 'revenu',
    libelle: 'M',
    montant: 0,
    date: TODAY,
    categorie: 'autre-revenu',
    previsionnel: false,
    ...p,
  };
}
function campagne(p: Partial<Campagne>): Campagne {
  return {
    id: 'k',
    sujet: 'S',
    corps: '',
    segment: 'tous',
    destinataires: 1,
    date: TODAY,
    statut: 'envoye',
    ...p,
  };
}
function donnees(p: Partial<DonneesMascotte>): DonneesMascotte {
  return {
    contacts: [],
    taches: [],
    evenements: [],
    mouvements: [],
    campagnes: [],
    ...p,
  };
}
const ZERO: Compteurs = {
  tachesFaites: 0,
  contactsConclus: 0,
  contactsPerdus: 0,
  revenus: 0,
  depenses: 0,
  evenementsPasses: 0,
  campagnesEnvoyees: 0,
};

describe('computeXp', () => {
  it('additionne les poids et le bonus de montant des revenus', () => {
    const data = donnees({
      taches: [
        tache({ id: 't1', statut: 'fait' }),
        tache({ id: 't2', statut: 'fait' }),
        tache({ id: 't3', statut: 'fait' }),
      ],
      contacts: [
        contact({ id: 'c1', etape: 'conclu' }),
        contact({ id: 'c2', etape: 'conclu' }),
      ],
      mouvements: [
        mouvement({ id: 'r1', montant: 600 }), // bonus 1
        mouvement({ id: 'r2', montant: 1200 }), // bonus 2
      ],
      evenements: [evenement({ id: 'e1', date: '2026-05-01' })],
      campagnes: [campagne({ id: 'k1' })],
    });
    // 3*10 + 2*25 + 2*12 + (1+2) + 1*18 + 1*8 = 133
    expect(computeXp(data, TODAY)).toBe(133);
  });

  it('plafonne le bonus de montant à 10 par revenu', () => {
    const data = donnees({ mouvements: [mouvement({ montant: 100000 })] });
    // 1*12 + min(200, 10) = 22
    expect(computeXp(data, TODAY)).toBe(22);
  });

  it('ignore les mouvements prévisionnels', () => {
    const data = donnees({
      mouvements: [mouvement({ montant: 5000, previsionnel: true })],
    });
    expect(computeXp(data, TODAY)).toBe(0);
  });
});

describe('computeStade', () => {
  it('place le stade au bon palier, y compris aux bornes', () => {
    expect(computeStade(149).stade).toBe(1);
    expect(computeStade(150).stade).toBe(2);
    expect(computeStade(499).stade).toBe(2);
    expect(computeStade(500).stade).toBe(3);
    expect(computeStade(1199).stade).toBe(3);
    expect(computeStade(1200).stade).toBe(4);
  });

  it('expose la progression vers le stade suivant', () => {
    const s = computeStade(325); // stade 2 (150..499), reste 175 sur 350
    expect(s.stade).toBe(2);
    expect(s.xpDansStade).toBe(175);
    expect(s.xpStadeSuivant).toBe(350);
    expect(s.progressionStade).toBeCloseTo(0.5, 5);
  });

  it('progression à 1 au dernier stade', () => {
    const s = computeStade(5000);
    expect(s.stade).toBe(4);
    expect(s.xpStadeSuivant).toBeNull();
    expect(s.progressionStade).toBe(1);
  });
});

describe('computeHumeur', () => {
  it('des revenus et contacts conclus récents rendent la créature radieuse', () => {
    const data = donnees({
      mouvements: [
        mouvement({ id: 'r1', montant: 3000 }),
        mouvement({ id: 'r2', montant: 3000 }),
        mouvement({ id: 'r3', montant: 3000 }),
      ],
      contacts: [
        contact({ id: 'c1', etape: 'conclu', dateDerniereInteraction: TODAY }),
        contact({ id: 'c2', etape: 'conclu', dateDerniereInteraction: TODAY }),
      ],
    });
    const h = computeHumeur(data, TODAY);
    expect(h).toBe(100); // borné
    expect(bandeHumeur(h)).toBe('radieux');
  });

  it('que des dépenses récentes épuisent la créature', () => {
    const data = donnees({
      mouvements: Array.from({ length: 5 }, (_, i) =>
        mouvement({ id: `d${i}`, type: 'depense', montant: 2000 }),
      ),
    });
    const h = computeHumeur(data, TODAY); // 60 - 5*8 = 20
    expect(h).toBe(20);
    expect(bandeHumeur(h)).toBe('epuise');
  });

  it('un mix équilibré laisse la créature sereine', () => {
    const data = donnees({
      mouvements: [
        mouvement({ id: 'r', type: 'revenu', montant: 1000 }), // +7
        mouvement({ id: 'd', type: 'depense', montant: 1000 }), // -7
      ],
    });
    const h = computeHumeur(data, TODAY);
    expect(h).toBe(60);
    expect(bandeHumeur(h)).toBe('serein');
  });

  it('applique la décroissance d’inactivité (max -14)', () => {
    const data = donnees({
      evenements: [evenement({ date: '2026-05-25' })], // 20 jours avant, passé
    });
    // pas de signal de fenêtre, derniere action positive il y a 20 jours -> -14
    expect(computeHumeur(data, TODAY)).toBe(46);
    expect(bandeHumeur(46)).toBe('fatigue');
  });

  it('borne l’humeur entre 0 et 100', () => {
    const bas = donnees({
      mouvements: Array.from({ length: 30 }, (_, i) =>
        mouvement({ id: `d${i}`, type: 'depense', montant: 5000 }),
      ),
    });
    expect(computeHumeur(bas, TODAY)).toBe(0);
  });
});

describe('tachesEnRetard', () => {
  it('compte les tâches échues non faites', () => {
    const data = donnees({
      taches: [
        tache({ id: 't1', echeance: '2026-06-01' }), // en retard
        tache({ id: 't2', echeance: '2026-06-01', statut: 'fait' }), // faite
        tache({ id: 't3', echeance: '2026-09-01' }), // à venir
      ],
    });
    expect(tachesEnRetard(data, TODAY)).toBe(1);
  });
});

describe('diffEvents', () => {
  it('un contact perdu produit une entrée négative et une réaction', () => {
    const next: Compteurs = { ...ZERO, contactsPerdus: 1 };
    const { entries, reaction } = diffEvents(
      ZERO,
      next,
      '2026-06-14T10:00:00Z',
    );
    expect(entries).toHaveLength(1);
    expect(entries[0]!.axe).toBe('humeur');
    expect(entries[0]!.delta).toBe(-14);
    expect(reaction?.type).toBe('contact_perdu');
    expect(reaction?.positif).toBe(false);
    expect(reaction?.texte).toBe('-14');
  });

  it('aucun changement ne produit ni entrée ni réaction', () => {
    const { entries, reaction } = diffEvents(
      ZERO,
      ZERO,
      '2026-06-14T10:00:00Z',
    );
    expect(entries).toHaveLength(0);
    expect(reaction).toBeNull();
  });

  it('choisit la réaction la plus saillante en cas de cumul', () => {
    const next: Compteurs = { ...ZERO, contactsConclus: 1, depenses: 1 };
    const { entries, reaction } = diffEvents(
      ZERO,
      next,
      '2026-06-14T10:00:00Z',
    );
    expect(entries).toHaveLength(2);
    expect(reaction?.type).toBe('contact_conclu');
    expect(reaction?.texte).toBe('+25 XP');
  });

  it('agrège plusieurs occurrences d’un même type', () => {
    const next: Compteurs = { ...ZERO, tachesFaites: 3 };
    const { entries } = diffEvents(ZERO, next, '2026-06-14T10:00:00Z');
    expect(entries[0]!.delta).toBe(30);
    expect(entries[0]!.label).toContain('(3)');
  });
});

describe('computeCompteurs', () => {
  it('compte les signaux réels (hors prévisionnel)', () => {
    const data = donnees({
      mouvements: [
        mouvement({ id: 'r', type: 'revenu' }),
        mouvement({ id: 'd', type: 'depense' }),
        mouvement({ id: 'p', type: 'revenu', previsionnel: true }),
      ],
      evenements: [evenement({ date: '2026-06-01' })],
      campagnes: [campagne({})],
    });
    const c = computeCompteurs(data, TODAY);
    expect(c.revenus).toBe(1);
    expect(c.depenses).toBe(1);
    expect(c.evenementsPasses).toBe(1);
    expect(c.campagnesEnvoyees).toBe(1);
  });
});

describe('computeFaim', () => {
  it('est rassasiée sans dernier repas connu', () => {
    expect(computeFaim(undefined, '2026-06-14T10:00:00Z')).toBe(100);
  });
  it('décroît avec le temps écoulé', () => {
    // 10 h après -> 100 - 10*4 = 60
    expect(computeFaim('2026-06-14T00:00:00Z', '2026-06-14T10:00:00Z')).toBe(
      60,
    );
  });
  it('est bornée à 0', () => {
    expect(computeFaim('2026-06-10T00:00:00Z', '2026-06-14T00:00:00Z')).toBe(0);
  });
});

describe('penaliteFaim', () => {
  it('nulle quand la créature est rassasiée', () => {
    expect(penaliteFaim(50)).toBe(0);
    expect(penaliteFaim(80)).toBe(0);
  });
  it('maximale quand elle est affamée', () => {
    expect(penaliteFaim(0)).toBe(15);
  });
  it('proportionnelle entre les deux', () => {
    expect(penaliteFaim(25)).toBe(8);
  });
});

describe('estNuit', () => {
  it('vrai le soir et tôt le matin, faux en journée', () => {
    expect(estNuit(22)).toBe(true);
    expect(estNuit(3)).toBe(true);
    expect(estNuit(7)).toBe(false);
    expect(estNuit(14)).toBe(false);
  });
});

describe('messageBulle', () => {
  const base = {
    nuit: false,
    faim: 80,
    humeurBande: 'serein' as const,
    streak: 0,
    heure: 10,
  };
  it('dort la nuit', () => {
    expect(messageBulle({ ...base, nuit: true })).toContain('demain');
  });
  it('réclame à manger quand elle a faim', () => {
    expect(messageBulle({ ...base, faim: 10 })).toContain('creux');
  });
  it('salue selon l’heure en journée', () => {
    expect(messageBulle({ ...base, heure: 9 })).toContain('Bonjour');
    expect(messageBulle({ ...base, heure: 20 })).toContain('soirée');
  });
  it('met en avant une longue série', () => {
    expect(messageBulle({ ...base, streak: 4 })).toContain("d'affilée");
  });
});

describe('conseil', () => {
  it('suggère de terminer les tâches en retard quand l’humeur est basse', () => {
    expect(
      conseil({
        humeurBande: 'fatigue',
        stade: 2,
        progressionStade: 0.2,
        tachesEnRetard: 2,
      }),
    ).toContain('2 tâches en retard');
  });

  it('encourage l’évolution quand on est proche d’un palier', () => {
    expect(
      conseil({
        humeurBande: 'serein',
        stade: 2,
        progressionStade: 0.8,
        tachesEnRetard: 0,
      }),
    ).toContain('évoluer');
  });

  it('félicite quand la créature est radieuse', () => {
    expect(
      conseil({
        humeurBande: 'radieux',
        stade: 4,
        progressionStade: 1,
        tachesEnRetard: 0,
      }),
    ).toContain('rayonne');
  });
});
