import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  Users,
  Wallet,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { cn } from '../../lib/cn';
import { contactsStore } from '../crm/store';
import { evenementsStore, tachesStore } from '../calendar/store';
import { mouvementsStore } from '../accounting/store';
import { campagnesStore } from '../mail/store';
import { libelleBadge, toneBadge } from '../crm/badges';
import { MascotteHabitat } from '../mascotte/MascotteHabitat';
import { type Contact } from '../crm/types';
import type { Evenement, Tache } from '../calendar/types';
import {
  chargeParMembre,
  compterLeads,
  derniersContacts,
  evenementsAVenir,
  tachesActives,
} from './summary';

const AUJOURDHUI = '2026-06-14';

const TOUS_STORES = [
  contactsStore,
  evenementsStore,
  tachesStore,
  mouvementsStore,
  campagnesStore,
];

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

function KpiCard({ label, valeur }: { label: string; valeur: number }) {
  return (
    <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums text-encre">
        {valeur}
      </p>
    </div>
  );
}

const RACCOURCIS = [
  { to: '/crm', label: 'CRM', icon: Users, desc: 'Contacts et prospection' },
  {
    to: '/calendrier',
    label: 'Calendrier',
    icon: CalendarIcon,
    desc: 'Événements et tâches',
  },
  {
    to: '/mail',
    label: 'Mail marketing',
    icon: MailIcon,
    desc: 'Leads et campagnes',
  },
  {
    to: '/comptabilite',
    label: 'Comptabilité',
    icon: Wallet,
    desc: 'Revenus et prévisionnel',
  },
];

function SectionCard({
  titre,
  lien,
  lienLabel,
  children,
}: {
  titre: string;
  lien: string;
  lienLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border-2 border-projecteur bg-papier p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-encre">{titre}</h2>
        <Link
          to={lien}
          className="inline-flex items-center gap-1 text-xs font-medium text-velours hover:underline"
        >
          {lienLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [demo, setDemo] = useState(false);

  const rafraichir = useCallback(() => {
    void contactsStore.list().then(setContacts);
    void evenementsStore.list().then(setEvenements);
    void tachesStore.list().then(setTaches);
    // La démo de l'Accueil est globale : on la considère active seulement
    // si les 5 stores de l'app sont effectivement remplis.
    void Promise.all(TOUS_STORES.map((s) => s.isSeeded())).then((seeds) =>
      setDemo(seeds.every(Boolean)),
    );
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) {
      await Promise.all(TOUS_STORES.map((s) => s.clear()));
    } else {
      await Promise.all(TOUS_STORES.map((s) => s.seed()));
    }
    rafraichir();
  }

  const prochains = evenementsAVenir(evenements, AUJOURDHUI);
  const charges = chargeParMembre(taches);
  const recents = derniersContacts(contacts);
  const nbTachesActives = tachesActives(taches).length;
  const nbLeads = compterLeads(contacts);

  return (
    <>
      <PageHeader
        title="Accueil"
        description="Vue d'ensemble de l'activité (hors comptabilité)."
        actions={
          <button
            type="button"
            onClick={() => void basculerDemo()}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors',
              demo
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                demo ? 'bg-gel-rose' : 'bg-encre-4',
              )}
            />
            Données de démo {demo ? 'activées' : 'désactivées'}
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Contacts" valeur={contacts.length} />
        <KpiCard label="Leads" valeur={nbLeads} />
        <KpiCard label="Événements à venir" valeur={prochains.length} />
        <KpiCard label="Tâches à faire" valeur={nbTachesActives} />
      </div>

      <MascotteHabitat />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          titre="Prochains événements"
          lien="/calendrier"
          lienLabel="Calendrier"
        >
          {prochains.length === 0 ? (
            <p className="text-sm text-encre-3">Aucun événement à venir.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {prochains.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-encre">{e.titre}</span>
                  <span className="shrink-0 text-xs text-encre-3">
                    {formatDateCourte(e.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          titre="Tâches actives par membre"
          lien="/calendrier"
          lienLabel="Calendrier"
        >
          <ul className="flex flex-col gap-2">
            {charges.map(({ membre, total }) => (
              <li
                key={membre}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-encre">{membre}</span>
                <span className="rounded-full bg-scene px-2 text-xs font-medium tabular-nums text-encre-2">
                  {total}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard titre="Derniers contacts" lien="/crm" lienLabel="CRM">
          {recents.length === 0 ? (
            <p className="text-sm text-encre-3">Aucun contact.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recents.map((c) => (
                <li key={c.id} className="flex items-center gap-2.5">
                  <Avatar
                    initials={`${c.prenom[0] ?? ''}${c.nom[0] ?? ''}`.toUpperCase()}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-encre">
                      {c.prenom} {c.nom}
                    </span>
                    {c.organisation && (
                      <span className="block truncate text-xs text-encre-3">
                        {c.organisation}
                      </span>
                    )}
                  </span>
                  {c.badges[0] && (
                    <Badge tone={toneBadge(c.badges[0])}>
                      {libelleBadge(c.badges[0])}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RACCOURCIS.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-trait bg-papier p-4 transition-colors hover:bg-scene"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-rose-brume text-velours">
              <Icon size={18} />
            </span>
            <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-encre">
              {label}
              <ArrowRight
                size={14}
                className="text-encre-3 transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="mt-0.5 block text-xs text-encre-3">{desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
