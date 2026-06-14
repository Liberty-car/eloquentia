import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { libelleBadge } from '../crm/badges';
import type { Campagne, SegmentBadge } from './types';

function labelSegment(segment: SegmentBadge): string {
  return segment === 'tous' ? 'Tous les contacts' : libelleBadge(segment);
}

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

export function HistoriqueView({
  campagnes,
  onSelect,
}: {
  campagnes: Campagne[];
  onSelect: (campagne: Campagne) => void;
}) {
  if (campagnes.length === 0) {
    return (
      <EmptyState
        title="Aucune campagne"
        description="Active les données de démo ou envoie une campagne depuis l'onglet Composer."
      />
    );
  }

  const triees = [...campagnes].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );

  return (
    <div className="flex flex-col gap-2">
      {triees.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c)}
          className="rounded-xl border-2 border-projecteur bg-papier p-4 text-left transition-colors hover:bg-scene"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-encre">{c.sujet}</h3>
              <p className="mt-0.5 text-xs text-encre-3">
                {labelSegment(c.segment)} - {c.destinataires} destinataire
                {c.destinataires > 1 ? 's' : ''} - {formatDateCourte(c.date)}
              </p>
            </div>
            <Badge tone="rose">Envoyé</Badge>
          </div>
          {c.corps && (
            <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-encre-2">
              {c.corps}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
