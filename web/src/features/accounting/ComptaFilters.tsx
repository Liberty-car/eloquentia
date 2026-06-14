import { TYPES_MOUVEMENT, TYPE_LABELS } from './types';
import { toutesCategories } from './categories';
import type { ComptaFiltres, NatureFiltre } from './filter';
import { cn } from '../../lib/cn';

const TYPE_OPTIONS = ['tous', ...TYPES_MOUVEMENT] as const;

const NATURE_OPTIONS: { id: NatureFiltre; label: string }[] = [
  { id: 'toutes', label: 'Tout' },
  { id: 'reel', label: 'Réel' },
  { id: 'previsionnel', label: 'Prévisionnel' },
];

export function ComptaFilters({
  filtres,
  evenements,
  onChange,
}: {
  filtres: ComptaFiltres;
  evenements: { id: string; titre: string }[];
  onChange: (filtres: ComptaFiltres) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        aria-label="Rechercher un mouvement"
        value={filtres.recherche}
        onChange={(e) => onChange({ ...filtres, recherche: e.target.value })}
        placeholder="Rechercher un libellé"
        className="h-9 w-56 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      />

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <div className="inline-flex items-center gap-1">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange({ ...filtres, type: t })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filtres.type === t
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {t === 'tous' ? 'Tous' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <div className="inline-flex items-center gap-1">
        {NATURE_OPTIONS.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onChange({ ...filtres, nature: n.id })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filtres.nature === n.id
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {n.label}
          </button>
        ))}
      </div>

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <select
        value={filtres.categorie}
        aria-label="Filtrer par catégorie"
        onChange={(e) => onChange({ ...filtres, categorie: e.target.value })}
        className="h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      >
        <option value="toutes">Toutes les catégories</option>
        {toutesCategories().map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filtres.evenement}
        aria-label="Filtrer par événement"
        onChange={(e) => onChange({ ...filtres, evenement: e.target.value })}
        className="h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      >
        <option value="tous">Tous les événements</option>
        <option value="aucun">Sans événement</option>
        {evenements.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.titre}
          </option>
        ))}
      </select>
    </div>
  );
}
