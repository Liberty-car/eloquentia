import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/cn';
import { tousBadges } from './badges';
import { ETAPES, ETAPE_LABELS, type BadgeId } from './types';
import type { ContactFilters } from './filter';

export function CrmFilters({
  value,
  onChange,
  onAjouterBadge,
  onSupprimerBadge,
}: {
  value: ContactFilters;
  onChange: (filters: ContactFilters) => void;
  onAjouterBadge: (label: string) => void;
  onSupprimerBadge: (id: BadgeId) => void;
}) {
  const [nouveauBadge, setNouveauBadge] = useState('');

  function toggleBadge(badge: BadgeId) {
    onChange({
      ...value,
      badges: value.badges.includes(badge)
        ? value.badges.filter((b) => b !== badge)
        : [...value.badges, badge],
    });
  }

  function ajouter() {
    const label = nouveauBadge.trim();
    if (label === '') return;
    onAjouterBadge(label);
    setNouveauBadge('');
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
        {tousBadges().map((badge) => {
          const actif = value.badges.includes(badge.id);
          return (
            <span
              key={badge.id}
              className={cn(
                'inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                actif
                  ? 'border-gel-rose bg-rose-brume text-velours'
                  : 'border-trait-fort bg-papier text-encre-2',
              )}
            >
              <button
                type="button"
                onClick={() => toggleBadge(badge.id)}
                className="py-1 pl-3 pr-1.5"
              >
                {badge.label}
              </button>
              {!badge.protege && (
                <button
                  type="button"
                  onClick={() => onSupprimerBadge(badge.id)}
                  aria-label={`Supprimer le badge ${badge.label}`}
                  className="pr-2 pl-0.5 text-encre-3 hover:text-erreur"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          );
        })}
        <span className="ml-1 inline-flex items-center gap-1">
          <input
            type="text"
            value={nouveauBadge}
            onChange={(e) => setNouveauBadge(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') ajouter();
            }}
            placeholder="Nouveau badge"
            aria-label="Nom du nouveau badge"
            className="h-7 w-32 rounded-full border border-trait bg-scene px-3 text-xs text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
          <button
            type="button"
            onClick={ajouter}
            aria-label="Ajouter le badge"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-trait-fort bg-papier text-encre-2 hover:bg-scene"
          >
            <Plus size={14} />
          </button>
        </span>
      </div>
    </div>
  );
}
