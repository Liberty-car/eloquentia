import {
  CalendarCheck,
  CheckCircle2,
  Cookie,
  Flame,
  Handshake,
  Mail,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserX,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';
import type { MascotteContexte } from './useMascotte';
import type { HumeurBande, JournalEntry, ReactionType } from './types';

const ICONES: Record<ReactionType, LucideIcon> = {
  tache_faite: CheckCircle2,
  contact_conclu: Handshake,
  revenu: TrendingUp,
  evenement: CalendarCheck,
  campagne: Mail,
  depense: TrendingDown,
  contact_perdu: UserX,
  levelup: Sparkles,
  repas: Cookie,
};

function couleurFaim(faim: number): string {
  if (faim >= 50) return 'bg-succes';
  if (faim >= 25) return 'bg-alerte';
  return 'bg-erreur';
}

const COULEUR_BANDE: Record<HumeurBande, string> = {
  epuise: 'bg-erreur',
  fatigue: 'bg-alerte',
  serein: 'bg-projecteur-doux',
  radieux: 'bg-gel-rose',
};

function formatHeure(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function deltaTexte(entry: JournalEntry): string {
  if (entry.type === 'levelup') return 'évolution';
  if (entry.axe === 'xp') return `+${entry.delta} XP`;
  return `${entry.delta}`;
}

export function MascottePanel({
  data,
  onClose,
}: {
  data: MascotteContexte;
  onClose: () => void;
}) {
  const {
    stadeNom,
    bandeLabel,
    humeur,
    humeurBande,
    xp,
    xpDansStade,
    xpStadeSuivant,
    progressionStade,
    journal,
    conseil,
    faim,
    peutNourrir,
    nourrir,
    streak,
  } = data;
  const entrees = journal.slice(0, 5);

  return (
    <div className="w-72 rounded-2xl border-2 border-projecteur bg-papier p-4 shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-extrabold text-encre">{stadeNom}</p>
          <p className="text-xs text-encre-3">
            Humeur {bandeLabel} - {xp} XP
          </p>
          {streak > 1 && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-velours">
              <Flame size={12} />
              {streak} jours d'activité
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le panneau de Quetia"
          className="rounded-full p-1 text-encre-3 transition-colors hover:bg-scene hover:text-encre"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progression XP */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-encre-3">
          <span>Évolution</span>
          <span className="tabular-nums">
            {xpStadeSuivant === null
              ? 'Stade maximal'
              : `${xpDansStade} / ${xpStadeSuivant}`}
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-scene">
          <div
            className="h-full rounded-full bg-gel-rose transition-[width] duration-500"
            style={{ width: `${Math.round(progressionStade * 100)}%` }}
          />
        </div>
      </div>

      {/* Jauge d'humeur */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-encre-3">
          <span>Humeur</span>
          <span className="tabular-nums">{humeur} / 100</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-scene">
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500',
              COULEUR_BANDE[humeurBande],
            )}
            style={{ width: `${humeur}%` }}
          />
        </div>
      </div>

      {/* Jauge de faim */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-encre-3">
          <span>Faim</span>
          <span className="tabular-nums">{faim} / 100</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-scene">
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500',
              couleurFaim(faim),
            )}
            style={{ width: `${faim}%` }}
          />
        </div>
      </div>

      {/* Nourrir */}
      <Button
        variant="primary"
        className="mt-3 w-full justify-center"
        disabled={!peutNourrir}
        onClick={() => nourrir()}
      >
        <Cookie size={16} />
        {peutNourrir ? 'Nourrir' : 'Rassasiée'}
      </Button>

      {/* Journal */}
      <div className="mt-3">
        <p className="text-[11px] font-medium text-encre-3">Journal</p>
        {entrees.length === 0 ? (
          <p className="mt-1 text-xs text-encre-3">
            Aucune activité pour l'instant.
          </p>
        ) : (
          <ul className="mt-1 flex flex-col gap-1.5">
            {entrees.map((e) => {
              const Icone = ICONES[e.type];
              const positif = e.type === 'levelup' || e.delta > 0;
              return (
                <li key={e.id} className="flex items-center gap-2 text-xs">
                  <Icone
                    size={14}
                    className={cn(
                      'shrink-0',
                      positif ? 'text-succes' : 'text-erreur',
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-encre-2">
                    {e.label}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-semibold tabular-nums',
                      positif ? 'text-succes' : 'text-erreur',
                    )}
                  >
                    {deltaTexte(e)}
                  </span>
                  <span className="shrink-0 text-[10px] text-encre-4">
                    {formatHeure(e.date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Conseil */}
      {conseil && (
        <p className="mt-3 rounded-[10px] bg-rose-brume px-3 py-2 text-xs text-velours">
          {conseil}
        </p>
      )}
    </div>
  );
}
