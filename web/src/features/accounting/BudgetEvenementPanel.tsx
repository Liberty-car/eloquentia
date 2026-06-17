import { CalendarDays } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import { formatEuros } from './format';
import { totaux } from './aggregate';
import type { Mouvement } from './types';

export interface EvenementBudget {
  id: string;
  titre: string;
  date: string;
}

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

function Kpi({
  label,
  valeur,
  accent,
}: {
  label: string;
  valeur: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[10px] border border-trait bg-scene p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 text-xl font-extrabold tabular-nums',
          accent ? 'text-erreur' : 'text-encre',
        )}
      >
        {valeur}
      </p>
    </div>
  );
}

// Panneau de planification budgétaire d'un événement : résumé des mouvements
// rattachés et action pour ajouter une ligne de budget pré-reliée à l'événement.
export function BudgetEvenementPanel({
  evenement,
  mouvements,
  onAjouter,
}: {
  evenement: EvenementBudget;
  mouvements: Mouvement[];
  onAjouter: () => void;
}) {
  const t = totaux(mouvements);
  const nbLignes = mouvements.length;

  return (
    <div className="mb-4 rounded-xl border-2 border-projecteur bg-papier p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-encre-3">
            <CalendarDays size={14} />
            Budget de l'événement
          </span>
          <h2 className="mt-1 text-lg font-bold text-encre">
            {evenement.titre}
          </h2>
          <p className="text-xs text-encre-3">
            {formatDateCourte(evenement.date)} - {nbLignes} ligne
            {nbLignes > 1 ? 's' : ''} de budget
          </p>
        </div>
        <Button variant="primary" onClick={onAjouter}>
          Ajouter une ligne au budget
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi label="Revenus" valeur={formatEuros(t.revenus)} />
        <Kpi label="Dépenses" valeur={formatEuros(t.depenses)} />
        <Kpi
          label="Résultat"
          valeur={formatEuros(t.resultat)}
          accent={t.resultat < 0}
        />
      </div>
    </div>
  );
}
