import type { Mouvement, TypeMouvement } from './types';

export type NatureFiltre = 'toutes' | 'reel' | 'previsionnel';

// Filtre événement : 'tous', 'aucun' (mouvements sans événement) ou un id d'événement.
export type EvenementFiltre = string;

export interface ComptaFiltres {
  recherche: string;
  type: TypeMouvement | 'tous';
  categorie: string | 'toutes';
  nature: NatureFiltre;
  evenement: EvenementFiltre;
}

export function filterMouvements(
  mouvements: Mouvement[],
  filtres: ComptaFiltres,
): Mouvement[] {
  const q = filtres.recherche.trim().toLowerCase();
  return mouvements.filter((m) => {
    if (filtres.type !== 'tous' && m.type !== filtres.type) return false;
    if (filtres.categorie !== 'toutes' && m.categorie !== filtres.categorie) {
      return false;
    }
    if (filtres.nature === 'reel' && m.previsionnel) return false;
    if (filtres.nature === 'previsionnel' && !m.previsionnel) return false;
    if (filtres.evenement === 'aucun' && m.evenementId) return false;
    if (
      filtres.evenement !== 'tous' &&
      filtres.evenement !== 'aucun' &&
      m.evenementId !== filtres.evenement
    ) {
      return false;
    }
    if (q && !m.libelle.toLowerCase().includes(q)) return false;
    return true;
  });
}
