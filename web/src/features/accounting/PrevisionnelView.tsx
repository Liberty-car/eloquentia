import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import { formatEuros } from './format';
import { projectionMensuelle, totaux } from './aggregate';
import { libelleCategorie, TYPE_LABELS, type Mouvement } from './types';

const FIN_PROJECTION = '2028-07';

function KpiCard({
  label,
  valeur,
  accent,
}: {
  label: string;
  valeur: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
        {label}
      </p>
      <p
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

export function PrevisionnelView({ mouvements }: { mouvements: Mouvement[] }) {
  const previsionnels = mouvements.filter((m) => m.previsionnel);

  if (previsionnels.length === 0) {
    return (
      <EmptyState
        title="Aucun mouvement prévisionnel"
        description="Ajoute des mouvements prévisionnels (cases « prévisionnel ») pour projeter le budget jusqu'à juillet 2028."
      />
    );
  }

  const points = projectionMensuelle(mouvements, FIN_PROJECTION);
  const cumulFinal = points.length > 0 ? points[points.length - 1]!.cumul : 0;
  const tPrev = totaux(previsionnels);

  // Groupement des mouvements prévisionnels par année.
  const annees = [
    ...new Set(previsionnels.map((m) => m.date.slice(0, 4))),
  ].sort();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Revenus prévus" valeur={formatEuros(tPrev.revenus)} />
        <KpiCard
          label="Dépenses prévues"
          valeur={formatEuros(tPrev.depenses)}
        />
        <KpiCard
          label="Résultat prévisionnel"
          valeur={formatEuros(tPrev.resultat)}
          accent={tPrev.resultat < 0}
        />
        <KpiCard
          label="Trésorerie projetée (juil. 2028)"
          valeur={formatEuros(cumulFinal)}
          accent={cumulFinal < 0}
        />
      </div>

      <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
        <h2 className="mb-1 text-sm font-bold text-encre">
          Trésorerie cumulée projetée
        </h2>
        <p className="mb-4 text-xs text-encre-3">
          Réel et prévisionnel confondus, cumulés mois par mois jusqu'à juillet
          2028.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid stroke="rgba(31,41,55,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v: number) => formatEuros(v)} />
              <Line
                type="monotone"
                dataKey="cumul"
                stroke="#CA3C66"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {annees.map((annee) => {
          const liste = previsionnels.filter((m) => m.date.startsWith(annee));
          const tAnnee = totaux(liste);
          return (
            <section
              key={annee}
              className="rounded-xl border-2 border-projecteur bg-papier p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-encre">{annee}</h3>
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    tAnnee.resultat >= 0 ? 'text-succes' : 'text-erreur',
                  )}
                >
                  {formatEuros(tAnnee.resultat)}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {liste.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-encre">{m.libelle}</span>
                      <Badge tone="neutre">
                        {libelleCategorie(m.categorie)}
                      </Badge>
                    </span>
                    <span
                      className={cn(
                        'whitespace-nowrap font-medium tabular-nums',
                        m.type === 'revenu' ? 'text-succes' : 'text-erreur',
                      )}
                    >
                      {m.type === 'revenu' ? '+' : '-'}
                      {formatEuros(m.montant)}
                      <span className="ml-1 text-xs text-encre-3">
                        {TYPE_LABELS[m.type]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
