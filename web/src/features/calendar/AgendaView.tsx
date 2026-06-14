import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatDateFr } from './dates';
import { STATUT_LABELS, type Evenement, type Tache } from './types';

type Element =
  | { type: 'evenement'; date: string; evenement: Evenement }
  | { type: 'tache'; date: string; tache: Tache };

export function AgendaView({
  evenements,
  taches,
  onSelectEvenement,
  onSelectTache,
}: {
  evenements: Evenement[];
  taches: Tache[];
  onSelectEvenement: (evenement: Evenement) => void;
  onSelectTache: (tache: Tache) => void;
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

  if (elements.length === 0) {
    return (
      <EmptyState
        title="Aucun élément à venir"
        description="Active les données de démo ou crée un événement ou une tâche."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {elements.map((el) => (
        <button
          key={`${el.type}-${el.type === 'evenement' ? el.evenement.id : el.tache.id}`}
          type="button"
          onClick={() =>
            el.type === 'evenement'
              ? onSelectEvenement(el.evenement)
              : onSelectTache(el.tache)
          }
          className="flex items-center justify-between gap-3 rounded-xl border border-trait bg-papier px-4 py-3 text-left transition-colors hover:bg-scene"
        >
          <span className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-encre-3">
              {formatDateFr(el.date)}
            </span>
            <span className="font-medium text-encre">
              {el.type === 'evenement' ? el.evenement.titre : el.tache.titre}
            </span>
          </span>
          {el.type === 'evenement' ? (
            <Badge tone="rose">Événement</Badge>
          ) : (
            <Badge tone="jaune">{STATUT_LABELS[el.tache.statut]}</Badge>
          )}
        </button>
      ))}
    </div>
  );
}
