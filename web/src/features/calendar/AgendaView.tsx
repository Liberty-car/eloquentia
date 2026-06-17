import { Clock, MapPin, User } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { usePagination } from '../../lib/usePagination';
import { cn } from '../../lib/cn';
import { formatDateFr } from './dates';
import {
  PRIORITE_LABELS,
  STATUT_LABELS,
  type Evenement,
  type Tache,
} from './types';

type Element =
  | { type: 'evenement'; date: string; evenement: Evenement }
  | { type: 'tache'; date: string; tache: Tache };

function MetaEvenement({ evenement }: { evenement: Evenement }) {
  if (!evenement.heure && !evenement.lieu) return null;
  return (
    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-encre-3">
      {evenement.heure && (
        <span className="inline-flex items-center gap-1">
          <Clock size={12} />
          {evenement.heure}
        </span>
      )}
      {evenement.lieu && (
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} />
          {evenement.lieu}
        </span>
      )}
    </span>
  );
}

export function AgendaView({
  evenements,
  taches,
  onSelectEvenement,
  onSelectTache,
  resetKey,
}: {
  evenements: Evenement[];
  taches: Tache[];
  onSelectEvenement: (evenement: Evenement) => void;
  onSelectTache: (tache: Tache) => void;
  resetKey?: unknown;
}) {
  const elements: Element[] = [
    ...evenements.map(
      (e): Element => ({ type: 'evenement', date: e.date, evenement: e }),
    ),
    ...taches
      .filter((t) => t.echeance)
      .map(
        (t): Element => ({
          type: 'tache',
          date: t.echeance as string,
          tache: t,
        }),
      ),
  ].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const pagination = usePagination(elements, 10, resetKey);

  if (elements.length === 0) {
    return (
      <EmptyState
        title="Aucun élément à venir"
        description="Active les données de démo ou crée un événement ou une tâche."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {pagination.elementsPage.map((el) => (
          <button
            key={`${el.type}-${el.type === 'evenement' ? el.evenement.id : el.tache.id}`}
            type="button"
            onClick={() =>
              el.type === 'evenement'
                ? onSelectEvenement(el.evenement)
                : onSelectTache(el.tache)
            }
            className={cn(
              'flex items-center justify-between gap-3 rounded-xl border-y border-r border-l-4 border-y-trait border-r-trait bg-papier px-4 py-3 text-left transition-colors hover:bg-scene',
              el.type === 'evenement'
                ? 'border-l-velours'
                : 'border-l-projecteur',
            )}
          >
            <span className="flex min-w-0 items-start gap-3">
              <span className="w-28 shrink-0 pt-0.5 text-xs font-medium text-encre-3">
                {formatDateFr(el.date)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-medium text-encre">
                  {el.type === 'evenement'
                    ? el.evenement.titre
                    : el.tache.titre}
                </span>
                {el.type === 'evenement' ? (
                  <MetaEvenement evenement={el.evenement} />
                ) : (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-encre-3">
                    <User size={12} />
                    {el.tache.membre}
                  </span>
                )}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              {el.type === 'evenement' ? (
                <Badge tone="rose">Événement</Badge>
              ) : (
                <>
                  <Badge tone="neutre">
                    {PRIORITE_LABELS[el.tache.priorite]}
                  </Badge>
                  <Badge tone="jaune">{STATUT_LABELS[el.tache.statut]}</Badge>
                </>
              )}
            </span>
          </button>
        ))}
      </div>
      <Pagination
        page={pagination.page}
        nbPages={pagination.nbPages}
        total={pagination.total}
        taille={pagination.taille}
        debut={pagination.debut}
        nbAffiches={pagination.elementsPage.length}
        onPageChange={pagination.setPage}
        onTailleChange={pagination.changerTaille}
      />
    </div>
  );
}
