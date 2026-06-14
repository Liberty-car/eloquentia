import { cn } from '../../lib/cn';
import { moisGrille, NOMS_JOURS } from './grille';
import type { Evenement, Tache } from './types';

export function MonthCalendar({
  annee,
  mois,
  evenements,
  taches,
  aujourdhui,
  onJourClic,
  onSelectEvenement,
  onSelectTache,
}: {
  annee: number;
  mois: number;
  evenements: Evenement[];
  taches: Tache[];
  aujourdhui: string;
  onJourClic: (iso: string) => void;
  onSelectEvenement: (evenement: Evenement) => void;
  onSelectTache: (tache: Tache) => void;
}) {
  const jours = moisGrille(annee, mois);

  return (
    <div className="overflow-hidden rounded-xl border border-trait bg-papier">
      <div className="grid grid-cols-7 border-b border-trait">
        {NOMS_JOURS.map((nom) => (
          <div
            key={nom}
            className="px-2 py-2 text-center text-xs font-semibold text-encre-3"
          >
            {nom}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {jours.map((jour) => {
          const evJour = evenements.filter((e) => e.date === jour.iso);
          const tJour = taches.filter((t) => t.echeance === jour.iso);
          const estAujourdhui = jour.iso === aujourdhui;
          return (
            <div
              key={jour.iso}
              className={cn(
                'relative min-h-24 border-b border-r border-trait',
                !jour.dansLeMois && 'bg-scene',
              )}
            >
              {/* Couche de fond cliquable (ajout sur ce jour), sans imbriquer d'interactifs. */}
              <button
                type="button"
                aria-label={`Ajouter le ${jour.iso}`}
                onClick={() => onJourClic(jour.iso)}
                className="absolute inset-0 h-full w-full hover:bg-scene"
              />
              <div className="pointer-events-none relative flex flex-col gap-1 p-1.5">
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    jour.dansLeMois ? 'text-encre' : 'text-encre-4',
                    estAujourdhui && 'bg-gel-rose text-white',
                  )}
                >
                  {jour.jour}
                </span>
                {evJour.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onSelectEvenement(e)}
                    className="pointer-events-auto truncate rounded bg-rose-brume px-1.5 py-0.5 text-left text-[11px] font-medium text-velours"
                  >
                    {e.heure ? <span>{e.heure} </span> : null}
                    {e.titre}
                  </button>
                ))}
                {tJour.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTache(t)}
                    className={cn(
                      'pointer-events-auto truncate rounded bg-jaune-brume px-1.5 py-0.5 text-left text-[11px] font-medium text-[#9a7b16]',
                      t.statut === 'fait' && 'line-through opacity-60',
                    )}
                  >
                    {t.titre}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
