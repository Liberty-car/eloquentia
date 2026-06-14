import {
  MEMBRES,
  PRIORITES,
  PRIORITE_LABELS,
  STATUTS,
  STATUT_LABELS,
} from './types';
import type { CalendarFiltres, TypeFiltre } from './filter';
import { cn } from '../../lib/cn';

const TYPE_OPTIONS: { id: TypeFiltre; label: string }[] = [
  { id: 'tous', label: 'Tout' },
  { id: 'evenements', label: 'Événements' },
  { id: 'taches', label: 'Tâches' },
];

const selectClass =
  'h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30';

export function CalendarFilters({
  filtres,
  onChange,
}: {
  filtres: CalendarFiltres;
  onChange: (filtres: CalendarFiltres) => void;
}) {
  // Les critères propres aux tâches n'ont pas de sens si on n'affiche que les
  // événements : on les masque dans ce cas.
  const tachesMasquees = filtres.type === 'evenements';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        aria-label="Rechercher dans l'agenda"
        value={filtres.recherche}
        onChange={(e) => onChange({ ...filtres, recherche: e.target.value })}
        placeholder="Rechercher un titre, un lieu"
        className="h-9 w-56 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      />

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <div className="inline-flex items-center gap-1">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange({ ...filtres, type: t.id })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filtres.type === t.id
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!tachesMasquees && (
        <>
          <span className="mx-1 h-5 w-px bg-trait-fort" />

          <select
            value={filtres.statut}
            aria-label="Filtrer par statut"
            onChange={(e) =>
              onChange({
                ...filtres,
                statut: e.target.value as CalendarFiltres['statut'],
              })
            }
            className={selectClass}
          >
            <option value="tous">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {STATUT_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={filtres.membre}
            aria-label="Filtrer par membre"
            onChange={(e) =>
              onChange({
                ...filtres,
                membre: e.target.value as CalendarFiltres['membre'],
              })
            }
            className={selectClass}
          >
            <option value="tous">Tous les membres</option>
            {MEMBRES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filtres.priorite}
            aria-label="Filtrer par priorité"
            onChange={(e) =>
              onChange({
                ...filtres,
                priorite: e.target.value as CalendarFiltres['priorite'],
              })
            }
            className={selectClass}
          >
            <option value="tous">Toutes les priorités</option>
            {PRIORITES.map((p) => (
              <option key={p} value={p}>
                {PRIORITE_LABELS[p]}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
