import { CalendarDays } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateFr } from './dates';
import { MEMBRES, PRIORITE_LABELS, STATUT_LABELS, type Tache } from './types';

export function TachesParMembreView({
  taches,
  onSelectTache,
}: {
  taches: Tache[];
  onSelectTache: (tache: Tache) => void;
}) {
  const groupes = MEMBRES.map((membre) => ({
    membre,
    liste: taches.filter((t) => t.membre === membre),
  })).filter((g) => g.liste.length > 0);

  if (groupes.length === 0) {
    return (
      <EmptyState
        title="Aucune tâche"
        description="Active les données de démo ou crée une tâche."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {groupes.map(({ membre, liste }) => (
        <section key={membre}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-encre">
            {membre}
            <span className="rounded-full bg-scene px-2 text-xs font-medium text-encre-3">
              {liste.length}
            </span>
          </h2>
          <div className="flex flex-col gap-2">
            {liste.map((tache) => (
              <button
                key={tache.id}
                type="button"
                onClick={() => onSelectTache(tache)}
                className="flex flex-col gap-1.5 rounded-xl border border-trait bg-papier p-3 text-left transition-colors hover:bg-scene"
              >
                <span className="text-sm font-medium text-encre">
                  {tache.titre}
                </span>
                {tache.echeance && (
                  <span className="inline-flex items-center gap-1 text-xs text-encre-3">
                    <CalendarDays size={12} />
                    {formatDateFr(tache.echeance)}
                  </span>
                )}
                <span className="flex flex-wrap gap-1.5">
                  <Badge tone="jaune">{STATUT_LABELS[tache.statut]}</Badge>
                  <Badge tone="rose">{PRIORITE_LABELS[tache.priorite]}</Badge>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
