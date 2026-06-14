import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../lib/cn';
import { tousBadges } from './badges';
import { ETAPES, ETAPE_LABELS, type Contact } from './types';

function KpiCard({
  label,
  valeur,
  testId,
  accent,
}: {
  label: string;
  valeur: number;
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
          'mt-1 text-3xl font-extrabold tabular-nums',
          accent ? 'text-erreur' : 'text-encre',
        )}
      >
        {valeur}
      </p>
    </div>
  );
}

export function CrmDashboardView({ contacts }: { contacts: Contact[] }) {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const parEtape = ETAPES.map((etape) => ({
    nom: ETAPE_LABELS[etape],
    valeur: contacts.filter((c) => c.etape === etape).length,
  }));
  const parBadge = tousBadges().map((badge) => ({
    nom: badge.label,
    valeur: contacts.filter((c) => c.badges.includes(badge.id)).length,
  }));
  const relances = contacts.filter((c) => c.prochaineRelance);
  const enRetard = relances.filter((c) => c.prochaineRelance! < aujourdhui);
  const enDiscussion = contacts.filter(
    (c) => c.etape === 'en_discussion',
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Contacts"
          valeur={contacts.length}
          testId="kpi-contacts"
        />
        <KpiCard
          label="En discussion"
          valeur={enDiscussion}
          testId="kpi-discussion"
        />
        <KpiCard
          label="Relances à venir"
          valeur={relances.length}
          testId="kpi-relances"
        />
        <KpiCard
          label="Relances en retard"
          valeur={enRetard.length}
          testId="kpi-retard"
          accent
        />
      </div>

      <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
        <h2 className="mb-4 text-sm font-bold text-encre">
          Pipeline par étape
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={parEtape}>
              <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="valeur" radius={[6, 6, 0, 0]} fill="#DB6A8F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
        <h2 className="mb-4 text-sm font-bold text-encre">
          Répartition par badge
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={parBadge}>
              <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="valeur" radius={[6, 6, 0, 0]} fill="#F5DF4D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
