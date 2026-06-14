import { describe, it, expect } from 'vitest';
import { recalculer } from './store';
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
});
