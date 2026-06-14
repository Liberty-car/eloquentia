import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import { formatEuros } from './format';
import { totaux } from './aggregate';
import {
  CATEGORIES_DEPENSE,
  CATEGORIES_REVENU,
  CATEGORIE_LABELS,
  type Mouvement,
} from './types';

function KpiCard({
  label,
  valeur,
  testId,
  accent,
}: {
  label: string;
  valeur: string;
  testId: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
        {label}
      </p>
      <p
        data-testid={testId}
        className={cn(
          'mt-1 text-2xl font-extrabold tabular-nums',
          accent ? 'text-erreur' : 'text-encre',
        )}
      >
        {valeur}
      </p>
    </div>
  );
}

function parCategorie(
  mouvements: Mouvement[],
  categories: readonly string[],
): { nom: string; valeur: number }[] {
  return categories.map((cat) => ({
    nom: CATEGORIE_LABELS[cat] ?? cat,
    valeur: mouvements
      .filter((m) => m.categorie === cat)
      .reduce((s, m) => s + m.montant, 0),
  }));
}

export function ComptaDashboardView({
  mouvements,
}: {
  mouvements: Mouvement[];
}) {
  const reel = mouvements.filter((m) => !m.previsionnel);

  if (reel.length === 0) {
    return (
      <EmptyState
        title="Aucun mouvement réel"
        description="Active les données de démo ou ajoute un mouvement réel pour voir le tableau de bord."
      />
    );
  }

  const t = totaux(reel);
  const revenusReels = reel.filter((m) => m.type === 'revenu');
  const depensesReelles = reel.filter((m) => m.type === 'depense');
  const dataRevenus = parCategorie(revenusReels, CATEGORIES_REVENU);
  const dataDepenses = parCategorie(depensesReelles, CATEGORIES_DEPENSE);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          label="Revenus réels"
          valeur={formatEuros(t.revenus)}
          testId="kpi-revenus"
        />
        <KpiCard
          label="Dépenses réelles"
          valeur={formatEuros(t.depenses)}
          testId="kpi-depenses"
        />
        <KpiCard
          label="Résultat réel"
          valeur={formatEuros(t.resultat)}
          testId="kpi-resultat"
          accent={t.resultat < 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
          <h2 className="mb-4 text-sm font-bold text-encre">
            Revenus par catégorie
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRevenus}>
                <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => formatEuros(v)}
                  cursor={{ fill: 'rgba(31,41,55,0.04)' }}
                />
                <Bar dataKey="valeur" radius={[6, 6, 0, 0]} fill="#DB6A8F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
          <h2 className="mb-4 text-sm font-bold text-encre">
            Dépenses par catégorie
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataDepenses}>
                <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => formatEuros(v)}
                  cursor={{ fill: 'rgba(31,41,55,0.04)' }}
                />
                <Bar dataKey="valeur" radius={[6, 6, 0, 0]} fill="#F5DF4D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
