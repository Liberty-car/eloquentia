import type { Evenement, Membre, Priorite, Statut, Tache } from './types';

// Filtre l'agenda : type (événements / tâches), recherche plein texte, et
// critères propres aux tâches (statut, membre, priorité).
export type TypeFiltre = 'tous' | 'evenements' | 'taches';

export interface CalendarFiltres {
  recherche: string;
  type: TypeFiltre;
  statut: Statut | 'tous';
  membre: Membre | 'tous';
  priorite: Priorite | 'tous';
}

export const FILTRES_CAL_INITIAUX: CalendarFiltres = {
  recherche: '',
  type: 'tous',
  statut: 'tous',
  membre: 'tous',
  priorite: 'tous',
};

export function filtrerEvenements(
  evenements: Evenement[],
  f: CalendarFiltres,
): Evenement[] {
  if (f.type === 'taches') return [];
  const q = f.recherche.trim().toLowerCase();
  if (!q) return evenements;
  return evenements.filter((e) =>
    [e.titre, e.lieu ?? '', e.description ?? '']
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

export function filtrerTaches(taches: Tache[], f: CalendarFiltres): Tache[] {
  if (f.type === 'evenements') return [];
  const q = f.recherche.trim().toLowerCase();
  return taches.filter((t) => {
    if (f.statut !== 'tous' && t.statut !== f.statut) return false;
    if (f.membre !== 'tous' && t.membre !== f.membre) return false;
    if (f.priorite !== 'tous' && t.priorite !== f.priorite) return false;
    if (q) {
      const champs = [t.titre, t.membre, t.description ?? '']
        .join(' ')
        .toLowerCase();
      if (!champs.includes(q)) return false;
    }
    return true;
  });
}
