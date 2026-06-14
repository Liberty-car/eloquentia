import { describe, it, expect } from 'vitest';
import { nourrir, recalculer, renommer } from './store';
import type { Compteurs, DonneesMascotte, MascotteState } from './types';
import type { Mouvement } from '../accounting/types';
import type { Contact } from '../crm/types';

const TODAY = '2026-06-14';
const NOW = '2026-06-14T10:00:00Z';

function vide(): DonneesMascotte {
  return {
    contacts: [],
    taches: [],
    evenements: [],
    mouvements: [],
    campagnes: [],
  };
}
function depense(id: string): Mouvement {
  return {
    id,
    type: 'depense',
    libelle: 'D',
    montant: 1000,
    date: TODAY,
    categorie: 'logistique',
    previsionnel: false,
  };
}
function conclu(id: string): Contact {
  return {
    id,
    prenom: 'A',
    nom: 'B',
    badges: [],
    etape: 'conclu',
    source: 'manuel',
    dateCreation: '2026-01-01',
    dateDerniereInteraction: TODAY,
  };
}
function etat(
  p: Partial<MascotteState> & { lastSeenCounts: Compteurs },
): MascotteState {
  return {
    xp: 0,
    stade: 1,
    humeur: 60,
    humeurBande: 'serein',
    lastComputedAt: NOW,
    journal: [],
    streak: 0,
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

describe('recalculer', () => {
  it('au premier calcul (aucun précédent) ne produit aucune réaction', () => {
    const { state, reaction } = recalculer(
      { ...vide(), mouvements: [depense('d1')] },
      TODAY,
      NOW,
      null,
    );
    expect(reaction).toBeNull();
    expect(state.journal).toHaveLength(0);
    expect(state.lastSeenCounts.depenses).toBe(1);
  });

  it('est idempotent : recalcul sans changement ne rejoue rien', () => {
    const data = { ...vide(), mouvements: [depense('d1')] };
    const first = recalculer(data, TODAY, NOW, null);
    const second = recalculer(data, TODAY, NOW, first.state);
    expect(second.reaction).toBeNull();
    expect(second.state.journal).toHaveLength(0);
    expect(second.state.xp).toBe(first.state.xp);
  });

  it('une nouvelle dépense déclenche une réaction et une entrée de journal', () => {
    const precedent = etat({ lastSeenCounts: ZERO });
    const { state, reaction } = recalculer(
      { ...vide(), mouvements: [depense('d1')] },
      TODAY,
      NOW,
      precedent,
    );
    expect(reaction?.type).toBe('depense');
    expect(state.journal[0]?.type).toBe('depense');
    expect(state.humeur).toBeLessThan(60);
  });

  it('le passage de stade prime sur la réaction d’événement', () => {
    // 6 contacts conclus = 150 XP -> stade 2
    const data = {
      ...vide(),
      contacts: Array.from({ length: 6 }, (_, i) => conclu(`c${i}`)),
    };
    const precedent = etat({
      stade: 1,
      lastSeenCounts: { ...ZERO, contactsConclus: 5 },
    });
    const { state, reaction } = recalculer(data, TODAY, NOW, precedent);
    expect(state.stade).toBe(2);
    expect(reaction?.type).toBe('levelup');
    expect(state.journal[0]?.type).toBe('levelup');
  });

  it('ne régresse jamais de stade même si les données disparaissent', () => {
    const precedent = etat({ stade: 3, lastSeenCounts: ZERO });
    const { state, reaction } = recalculer(vide(), TODAY, NOW, precedent);
    expect(state.xp).toBe(0);
    expect(state.stade).toBe(3); // figé, pas de retour au stade 1
    expect(reaction).toBeNull();
  });

  it('la faim fait baisser l’humeur', () => {
    const precedent = etat({
      lastSeenCounts: ZERO,
      dernierRepas: '2026-06-13T00:00:00Z', // ~34 h avant -> faim 0
    });
    const { state } = recalculer(
      vide(),
      TODAY,
      '2026-06-14T10:00:00Z',
      precedent,
    );
    expect(state.humeur).toBe(45); // 60 base - 15 de malus de faim
  });

  it('incrémente la série un nouveau jour actif, la réinitialise après un trou', () => {
    const base = etat({ lastSeenCounts: ZERO });
    const data = { ...vide(), contacts: [conclu('c1')] };

    const consecutif = recalculer(data, TODAY, NOW, {
      ...base,
      streak: 2,
      dernierJourActif: '2026-06-13',
    });
    expect(consecutif.state.streak).toBe(3);
    expect(consecutif.state.dernierJourActif).toBe(TODAY);

    const apresTrou = recalculer(data, TODAY, NOW, {
      ...base,
      streak: 5,
      dernierJourActif: '2026-06-10',
    });
    expect(apresTrou.state.streak).toBe(1);
  });
});

describe('nourrir', () => {
  it('remet la faim au maximum (nouveau dernier repas)', () => {
    const p = etat({
      lastSeenCounts: ZERO,
      dernierRepas: '2026-06-13T10:00:00Z',
    });
    const r = nourrir(p, '2026-06-14T10:00:00Z');
    expect(r?.dernierRepas).toBe('2026-06-14T10:00:00Z');
  });

  it('refuse si la créature est déjà presque rassasiée', () => {
    const p = etat({
      lastSeenCounts: ZERO,
      dernierRepas: '2026-06-14T09:00:00Z', // 1 h -> faim 96
    });
    expect(nourrir(p, '2026-06-14T10:00:00Z')).toBeNull();
  });
});

describe('renommer', () => {
  it('définit puis efface le nom personnalisé', () => {
    const p = etat({ lastSeenCounts: ZERO });
    expect(renommer(p, 'Bidou').nom).toBe('Bidou');
    expect(renommer({ ...p, nom: 'Bidou' }, '   ').nom).toBeUndefined();
  });
});
