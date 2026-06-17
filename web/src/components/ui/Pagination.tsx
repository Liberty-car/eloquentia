import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { TAILLES_PAGE } from '../../lib/usePagination';

/**
 * Barre de pagination : sélecteur « lignes par page » à gauche, plage affichée
 * et navigation précédent/suivant à droite. Ne rend rien sans élément.
 */
export function Pagination({
  page,
  nbPages,
  total,
  taille,
  debut,
  nbAffiches,
  onPageChange,
  onTailleChange,
}: {
  page: number;
  nbPages: number;
  total: number;
  taille: number;
  debut: number;
  nbAffiches: number;
  onPageChange: (page: number) => void;
  onTailleChange: (taille: number) => void;
}) {
  if (total === 0) return null;

  const premier = debut + 1;
  const dernier = debut + nbAffiches;
  const surPremiere = page <= 1;
  const surDerniere = page >= nbPages;

  const boutonNav =
    'inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-trait-fort bg-papier text-encre-2 transition-colors hover:bg-scene disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-papier';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-encre-2">
      <label className="inline-flex items-center gap-2">
        <span className="text-encre-3">Lignes par page</span>
        <select
          value={taille}
          aria-label="Lignes par page"
          onChange={(e) => onTailleChange(Number(e.target.value))}
          className="h-8 rounded-[10px] border border-trait bg-scene px-2 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
        >
          {TAILLES_PAGE.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className="inline-flex items-center gap-3">
        <span className="tabular-nums text-encre-3">
          {premier}-{dernier} sur {total}
        </span>
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Page précédente"
            disabled={surPremiere}
            onClick={() => onPageChange(page - 1)}
            className={boutonNav}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-16 text-center tabular-nums text-encre-2">
            Page {page} / {nbPages}
          </span>
          <button
            type="button"
            aria-label="Page suivante"
            disabled={surDerniere}
            onClick={() => onPageChange(page + 1)}
            className={cn(boutonNav)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
