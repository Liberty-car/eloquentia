import type { Mouvement } from './types';

export interface Totaux {
  revenus: number;
  depenses: number;
  resultat: number;
}

// Convention : montant toujours positif, direction via `type`.
export function totaux(mouvements: Mouvement[]): Totaux {
  let revenus = 0;
  let depenses = 0;
  for (const m of mouvements) {
    if (m.type === 'revenu') revenus += m.montant;
    else depenses += m.montant;
  }
  return { revenus, depenses, resultat: revenus - depenses };
}
