import { useEffect, useState } from 'react';

// Tailles de page proposées dans le sélecteur « lignes par page ».
export const TAILLES_PAGE = [10, 25, 50, 100] as const;

export interface Pagination<T> {
  /** Éléments de la page courante (tranche de `items`). */
  elementsPage: T[];
  /** Page courante (1-indexée, toujours dans la plage valide). */
  page: number;
  setPage: (page: number) => void;
  /** Nombre d'éléments par page. */
  taille: number;
  /** Change la taille de page et revient à la première page. */
  changerTaille: (taille: number) => void;
  /** Nombre total de pages (au moins 1). */
  nbPages: number;
  /** Nombre total d'éléments. */
  total: number;
  /** Index (0-indexé) du premier élément affiché. */
  debut: number;
}

/**
 * Pagination côté client d'une liste déjà filtrée/triée.
 *
 * La page courante est bornée à la volée : si la liste rétrécit (filtre plus
 * strict), on n'affiche jamais une page vide. Fournir `resetKey` (par exemple
 * la signature des filtres) pour revenir à la page 1 quand les critères
 * changent, comportement attendu d'un tableau filtrable.
 */
export function usePagination<T>(
  items: T[],
  tailleInitiale: number = 10,
  resetKey?: unknown,
): Pagination<T> {
  const [taille, setTaille] = useState(tailleInitiale);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const total = items.length;
  const nbPages = Math.max(1, Math.ceil(total / taille));
  const pageBornee = Math.min(Math.max(1, page), nbPages);
  const debut = (pageBornee - 1) * taille;
  const elementsPage = items.slice(debut, debut + taille);

  function changerTaille(t: number) {
    setTaille(t);
    setPage(1);
  }

  return {
    elementsPage,
    page: pageBornee,
    setPage,
    taille,
    changerTaille,
    nbPages,
    total,
    debut,
  };
}
