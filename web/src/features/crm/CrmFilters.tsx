import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/cn';
import {
  BADGES,
  BADGE_LABELS,
  ETAPES,
  ETAPE_LABELS,
  type BadgeId,
} from './types';
import type { ContactFilters } from './filter';

export function CrmFilters({
  value,
  onChange,
}: {
  value: ContactFilters;
  onChange: (filters: ContactFilters) => void;
}) {
  function toggleBadge(badge: BadgeId) {
    onChange({
      ...value,
      badges: value.badges.includes(badge)
        ? value.badges.filter((b) => b !== badge)
        : [...value.badges, badge],
    });
  }

  return (
    <div className="mb-5 flex flex-col gap-3">
      <Input
        placeholder="Rechercher un contact..."
        value={value.recherche}
        onChange={(e) => onChange({ ...value, recherche: e.target.value })}
        className="max-w-sm"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange({ ...value, etape: 'toutes' })}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            value.etape === 'toutes'
              ? 'border-gel-rose bg-rose-brume text-velours'
              : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
          )}
        >
          Toutes les étapes
        </button>
        {ETAPES.map((etape) => (
          <button
            key={etape}
            type="button"
            onClick={() => onChange({ ...value, etape })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              value.etape === etape
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {ETAPE_LABELS[etape]}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-trait-fort" aria-hidden="true" />
        {BADGES.map((badge) => (
          <button
            key={badge}
            type="button"
            onClick={() => toggleBadge(badge)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              value.badges.includes(badge)
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {BADGE_LABELS[badge]}
          </button>
        ))}
      </div>
    </div>
  );
}
