import type { Mouvement, TypeMouvement } from './types';

export type NatureFiltre = 'toutes' | 'reel' | 'previsionnel';

export interface ComptaFiltres {
  recherche: string;
  type: TypeMouvement | 'tous';
  categorie: string | 'toutes';
  nature: NatureFiltre;
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
    if (q && !m.libelle.toLowerCase().includes(q)) return false;
    return true;
  });
}
