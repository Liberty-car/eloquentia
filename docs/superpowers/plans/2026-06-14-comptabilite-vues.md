# Comptabilité - Plan 4b (dashboard + prévisionnel + export + intégration)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Compléter le module Comptabilité avec le tableau de bord (KPIs réel + graphiques), la vue prévisionnel (projection cumulée mensuelle jusqu'au 2028-07-31), l'export CSV (compatible Excel), un sélecteur de vues et l'intégration complète dans la page.

**Architecture:** Suite du Plan 4a (couche données + liste + fiche déjà en place dans `web/src/features/accounting/`). Recharts pour les graphiques (déjà installé). Aucun outil externe.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4, Recharts, Vitest + Testing Library.

## Conventions verrouillées (rappel)

- **`montant` TOUJOURS POSITIF**, direction via `type`. `resultat = revenus - depenses`.
- **Tableau de bord = RÉEL UNIQUEMENT** (`previsionnel === false`). Le prévisionnel vit dans sa propre vue.
- **Prévisionnel = axe TEMPS** : projection cumulée par mois jusqu'au 2028-07. `evenementId` n'est qu'un label optionnel.
- **Export = CSV avec BOM UTF-8**, séparateur `;` (ouverture native dans Excel fr-FR avec accents). Pas de dépendance SheetJS/xlsx (vulnérabilité haute non corrigée).
- Français avec accents. Pas de tiret cadratin.

Fichiers déjà existants (Plan 4a) : `types.ts`, `format.ts`, `aggregate.ts` (`totaux`), `seed.ts`, `store.ts` (`mouvementsStore`), `filter.ts`, `ComptaFilters.tsx`, `MouvementListView.tsx`, `MouvementFiche.tsx` (exporte aussi `OptionEvenement`).

---

### Tâche 1 : Projection mensuelle (aggregate)

**Files:**

- Modify: `web/src/features/accounting/aggregate.ts`
- Test: `web/src/features/accounting/projection.test.ts`

- [ ] **Étape 1 : Écrire le test (rouge)**

```ts
import { describe, it, expect } from 'vitest';
import { projectionMensuelle, moisDe, labelMois } from './aggregate';
import type { Mouvement } from './types';

const m = (over: Partial<Mouvement>): Mouvement => ({
  id: 'x',
  type: 'revenu',
  libelle: 'l',
  montant: 0,
  date: '2026-06-01',
  categorie: 'autre',
  previsionnel: false,
  ...over,
});

describe('moisDe / labelMois', () => {
  it('extrait le mois AAAA-MM', () => {
    expect(moisDe('2026-06-15')).toBe('2026-06');
  });
  it('formate un label français', () => {
    expect(labelMois('2026-06')).toBe('juin 2026');
  });
});

describe('projectionMensuelle', () => {
  it('cumule le résultat mois par mois jusqu’à la fin', () => {
    const mvts = [
      m({ date: '2026-06-10', type: 'revenu', montant: 1000 }),
      m({ date: '2026-07-10', type: 'depense', montant: 400 }),
    ];
    const points = projectionMensuelle(mvts, '2026-08');
    expect(points.map((p) => p.mois)).toEqual([
      '2026-06',
      '2026-07',
      '2026-08',
    ]);
    expect(points.map((p) => p.cumul)).toEqual([1000, 600, 600]);
  });

  it('renvoie une liste vide sans mouvement', () => {
    expect(projectionMensuelle([], '2028-07')).toEqual([]);
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/projection.test.ts` (depuis `web/`)
Expected: FAIL

- [ ] **Étape 3 : Ajouter à `aggregate.ts`** (à la suite de l'existant, sans modifier `totaux`)

```ts
const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

const MOIS_LONGS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

// 'AAAA-MM-JJ' -> 'AAAA-MM'
export function moisDe(dateIso: string): string {
  return dateIso.slice(0, 7);
}

// 'AAAA-MM' -> 'juin 2026'
export function labelMois(mois: string): string {
  const parts = mois.split('-');
  const annee = parts[0] ?? '';
  const indice = Number(parts[1] ?? '1') - 1;
  return `${MOIS_LONGS[indice] ?? ''} ${annee}`.trim();
}

// 'AAAA-MM' -> 'juin' (court, pour les axes)
export function labelMoisCourt(mois: string): string {
  const parts = mois.split('-');
  const indice = Number(parts[1] ?? '1') - 1;
  const annee = (parts[0] ?? '').slice(2);
  return `${MOIS_COURTS[indice] ?? ''} ${annee}`.trim();
}

function enumererMois(debut: string, fin: string): string[] {
  const res: string[] = [];
  const pd = debut.split('-');
  const pf = fin.split('-');
  let annee = Number(pd[0] ?? '2026');
  let mois = Number(pd[1] ?? '1');
  const anneeFin = Number(pf[0] ?? '2028');
  const moisFin = Number(pf[1] ?? '7');
  while (annee < anneeFin || (annee === anneeFin && mois <= moisFin)) {
    res.push(`${annee}-${String(mois).padStart(2, '0')}`);
    mois += 1;
    if (mois > 12) {
      mois = 1;
      annee += 1;
    }
  }
  return res;
}

export interface PointProjection {
  mois: string; // 'AAAA-MM'
  label: string; // court, pour l'axe
  resultatMensuel: number;
  cumul: number;
}

// Projection cumulée du résultat, mois par mois, du premier mouvement
// jusqu'à `finMois` inclus. Inclut réel ET prévisionnel.
export function projectionMensuelle(
  mouvements: Mouvement[],
  finMois = '2028-07',
): PointProjection[] {
  if (mouvements.length === 0) return [];
  const moisDebut = mouvements
    .map((m) => moisDe(m.date))
    .reduce((min, cur) => (cur < min ? cur : min));
  const debut = moisDebut < finMois ? moisDebut : finMois;
  let cumul = 0;
  return enumererMois(debut, finMois).map((mois) => {
    let resultatMensuel = 0;
    for (const m of mouvements) {
      if (moisDe(m.date) === mois) {
        resultatMensuel += m.type === 'revenu' ? m.montant : -m.montant;
      }
    }
    cumul += resultatMensuel;
    return { mois, label: labelMoisCourt(mois), resultatMensuel, cumul };
  });
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/projection.test.ts`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/aggregate.ts web/src/features/accounting/projection.test.ts
git commit -m "feat(compta): projection mensuelle cumulee"
```

---

### Tâche 2 : Export CSV

**Files:**

- Create: `web/src/features/accounting/export.ts`
- Test: `web/src/features/accounting/export.test.ts`

- [ ] **Étape 1 : Écrire le test (rouge)**

```ts
import { describe, it, expect } from 'vitest';
import { mouvementsVersCsv } from './export';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Don; spécial',
    montant: 1500,
    date: '2026-06-12',
    categorie: 'dons',
    previsionnel: false,
  },
];

describe('mouvementsVersCsv', () => {
  it('génère un en-tête et une ligne, en échappant le séparateur', () => {
    const csv = mouvementsVersCsv(mvts);
    const lignes = csv.split('\r\n');
    expect(lignes[0]).toBe(
      'Date;Type;Libellé;Catégorie;Montant;Prévisionnel;Justificatif',
    );
    // Le point-virgule dans le libellé force les guillemets.
    expect(lignes[1]).toBe('2026-06-12;Revenu;"Don; spécial";Dons;1500;Non;');
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/export.test.ts`
Expected: FAIL

- [ ] **Étape 3 : Écrire `export.ts`**

```ts
import { libelleCategorie, TYPE_LABELS, type Mouvement } from './types';

function echapper(valeur: string): string {
  if (/[";\n\r]/.test(valeur)) {
    return `"${valeur.replace(/"/g, '""')}"`;
  }
  return valeur;
}

const ENTETES = [
  'Date',
  'Type',
  'Libellé',
  'Catégorie',
  'Montant',
  'Prévisionnel',
  'Justificatif',
];

export function mouvementsVersCsv(mouvements: Mouvement[]): string {
  const lignes = mouvements.map((m) =>
    [
      m.date,
      TYPE_LABELS[m.type],
      m.libelle,
      libelleCategorie(m.categorie),
      String(m.montant),
      m.previsionnel ? 'Oui' : 'Non',
      m.justificatif ?? '',
    ]
      .map(echapper)
      .join(';'),
  );
  return [ENTETES.join(';'), ...lignes].join('\r\n');
}

// Déclenche le téléchargement d'un CSV (BOM UTF-8 pour Excel fr-FR).
export function telechargerCsv(nomFichier: string, contenu: string): void {
  const blob = new Blob(['﻿' + contenu], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/export.test.ts`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/export.ts web/src/features/accounting/export.test.ts
git commit -m "feat(compta): export CSV compatible Excel"
```

---

### Tâche 3 : Sélecteur de vues

**Files:**

- Create: `web/src/features/accounting/views.ts`
- Create: `web/src/features/accounting/ComptaViewSwitcher.tsx`

- [ ] **Étape 1 : Écrire `views.ts`**

```ts
// Vues du module Comptabilité (ordre du sélecteur).
export const VUES_COMPTA = [
  { id: 'liste', label: 'Liste' },
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'previsionnel', label: 'Prévisionnel' },
] as const;

export type VueCompta = (typeof VUES_COMPTA)[number]['id'];
```

- [ ] **Étape 2 : Écrire `ComptaViewSwitcher.tsx`**

```tsx
import { cn } from '../../lib/cn';
import { VUES_COMPTA, type VueCompta } from './views';

export function ComptaViewSwitcher({
  value,
  onChange,
}: {
  value: VueCompta;
  onChange: (vue: VueCompta) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-trait bg-papier p-1">
      {VUES_COMPTA.map((vue) => (
        <button
          key={vue.id}
          type="button"
          onClick={() => onChange(vue.id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === vue.id
              ? 'bg-rose-brume text-velours'
              : 'text-encre-2 hover:bg-scene',
          )}
        >
          {vue.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Étape 3 : Commit**

```bash
git add web/src/features/accounting/views.ts web/src/features/accounting/ComptaViewSwitcher.tsx
git commit -m "feat(compta): selecteur de vues"
```

---

### Tâche 4 : Tableau de bord (réel uniquement)

**Files:**

- Create: `web/src/features/accounting/ComptaDashboardView.tsx`
- Test: `web/src/features/accounting/ComptaDashboardView.test.tsx`

KPIs calculés sur les mouvements RÉELS (`previsionnel === false`) : Revenus, Dépenses, Résultat (accent rouge si négatif). Deux graphiques recharts : revenus réels par catégorie, dépenses réelles par catégorie. État vide si aucun mouvement réel.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComptaDashboardView } from './ComptaDashboardView';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Subvention',
    montant: 8000,
    date: '2026-06-05',
    categorie: 'subventions',
    previsionnel: false,
  },
  {
    id: 'b',
    type: 'depense',
    libelle: 'Affiches',
    montant: 680,
    date: '2026-06-25',
    categorie: 'communication',
    previsionnel: false,
  },
  {
    id: 'c',
    type: 'revenu',
    libelle: 'Prévision 2027',
    montant: 9000,
    date: '2027-01-15',
    categorie: 'subventions',
    previsionnel: true,
  },
];

describe('ComptaDashboardView', () => {
  it('calcule les KPIs sur le réel uniquement (ignore le prévisionnel)', () => {
    render(<ComptaDashboardView mouvements={mvts} />);
    // Revenus réels = 8000 (la prévision de 9000 est exclue).
    expect(screen.getByTestId('kpi-revenus').textContent).toContain('8');
    expect(screen.getByTestId('kpi-revenus').textContent).not.toContain('17');
    expect(screen.getByTestId('kpi-depenses').textContent).toContain('680');
  });

  it('affiche un état vide sans mouvement réel', () => {
    const prevSeul: Mouvement[] = [mvts[2]!];
    render(<ComptaDashboardView mouvements={prevSeul} />);
    expect(screen.getByText('Aucun mouvement réel')).toBeInTheDocument();
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/ComptaDashboardView.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Écrire le composant**

```tsx
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
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/ComptaDashboardView.test.tsx`
Expected: PASS (recharts peut émettre un avertissement de largeur en jsdom : sans gravité)

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/ComptaDashboardView.tsx web/src/features/accounting/ComptaDashboardView.test.tsx
git commit -m "feat(compta): tableau de bord (KPIs reels et graphiques)"
```

---

### Tâche 5 : Vue Prévisionnel

**Files:**

- Create: `web/src/features/accounting/PrevisionnelView.tsx`
- Test: `web/src/features/accounting/PrevisionnelView.test.tsx`

Projection cumulée mensuelle (graphique ligne) jusqu'au 2028-07 + KPIs prévisionnel (revenus, dépenses, résultat prévisionnel + résultat cumulé projeté fin juillet 2028) + tableau des mouvements prévisionnels groupés par année. État vide si aucun prévisionnel.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrevisionnelView } from './PrevisionnelView';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'r',
    type: 'revenu',
    libelle: 'Billetterie réelle',
    montant: 4800,
    date: '2026-09-12',
    categorie: 'billetterie',
    previsionnel: false,
  },
  {
    id: 'p1',
    type: 'revenu',
    libelle: 'Subvention 2027',
    montant: 9000,
    date: '2027-01-15',
    categorie: 'subventions',
    previsionnel: true,
  },
  {
    id: 'p2',
    type: 'depense',
    libelle: 'Logistique 2028',
    montant: 4200,
    date: '2028-07-15',
    categorie: 'logistique',
    previsionnel: true,
  },
];

describe('PrevisionnelView', () => {
  it('affiche les mouvements prévisionnels groupés par année', () => {
    render(<PrevisionnelView mouvements={mvts} />);
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('2028')).toBeInTheDocument();
    expect(screen.getByText('Subvention 2027')).toBeInTheDocument();
    // Le mouvement réel n'apparaît pas dans le détail prévisionnel.
    expect(screen.queryByText('Billetterie réelle')).not.toBeInTheDocument();
  });

  it('affiche un état vide sans prévisionnel', () => {
    const reelSeul: Mouvement[] = [mvts[0]!];
    render(<PrevisionnelView mouvements={reelSeul} />);
    expect(
      screen.getByText('Aucun mouvement prévisionnel'),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/PrevisionnelView.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Écrire le composant**

```tsx
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
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/PrevisionnelView.test.tsx`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/PrevisionnelView.tsx web/src/features/accounting/PrevisionnelView.test.tsx
git commit -m "feat(compta): vue previsionnel (projection cumulee)"
```

---

### Tâche 6 : Intégration en page

**Files:**

- Modify (réécriture complète) : `web/src/features/accounting/index.tsx`
- Test: `web/src/features/accounting/index.test.tsx`

La page orchestre : chargement `mouvementsStore` + `evenementsStore` (options de la fiche), bouton « Données de démo » (sur `mouvementsStore` seulement), bouton « Exporter (Excel/CSV) », bouton « Nouveau mouvement », sélecteur de vues, filtres (vue liste), fiche CRUD. Conversion `MouvementFormValues` -> données : `montant = Number(...)` (>= 0), `opts` conditionnel pour `evenementId`/`justificatif`, `create` ou `replace`.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountingPage from './index';
import { mouvementsStore } from './store';

describe('AccountingPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les données de démo', async () => {
    render(<AccountingPage />);
    expect(
      screen.getByRole('heading', { name: 'Comptabilité' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await mouvementsStore.list()).toHaveLength(20);
    });
  });

  it('ouvre la création via "Nouveau mouvement"', async () => {
    render(<AccountingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nouveau mouvement' }));
    expect(
      await screen.findByText('Nouveau mouvement', { selector: 'h2' }),
    ).toBeInTheDocument();
  });

  it('bascule sur la vue Tableau de bord', async () => {
    render(<AccountingPage />);
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await mouvementsStore.list()).toHaveLength(20);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tableau de bord' }));
    expect(await screen.findByTestId('kpi-revenus')).toBeInTheDocument();
  });
});
```

Note : `SidePanel` rend son titre dans un `<h2>` (cf. `EvenementFiche`). Si ce n'est pas le cas, adapte le sélecteur du test à la structure réelle de `SidePanel` (vérifie le composant avant d'implémenter).

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/index.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Réécrire `index.tsx`**

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import { mouvementsStore } from './store';
import { evenementsStore } from '../calendar/store';
import { ComptaViewSwitcher } from './ComptaViewSwitcher';
import { ComptaFilters } from './ComptaFilters';
import { MouvementListView } from './MouvementListView';
import { ComptaDashboardView } from './ComptaDashboardView';
import { PrevisionnelView } from './PrevisionnelView';
import { MouvementFiche, type OptionEvenement } from './MouvementFiche';
import { filterMouvements, type ComptaFiltres } from './filter';
import { mouvementsVersCsv, telechargerCsv } from './export';
import type { Mouvement, MouvementFormValues } from './types';
import type { VueCompta } from './views';

const FILTRES_INITIAUX: ComptaFiltres = {
  recherche: '',
  type: 'tous',
  categorie: 'toutes',
};

export default function AccountingPage() {
  const [vue, setVue] = useState<VueCompta>('liste');
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [evenements, setEvenements] = useState<OptionEvenement[]>([]);
  const [demo, setDemo] = useState(false);
  const [filtres, setFiltres] = useState<ComptaFiltres>(FILTRES_INITIAUX);
  const [fiche, setFiche] = useState<{
    open: boolean;
    mouvement: Mouvement | null;
  }>({ open: false, mouvement: null });

  const rafraichir = useCallback(() => {
    void mouvementsStore.list().then(setMouvements);
    void mouvementsStore.isSeeded().then(setDemo);
    void evenementsStore
      .list()
      .then((evs) =>
        setEvenements(evs.map((e) => ({ id: e.id, titre: e.titre }))),
      );
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) await mouvementsStore.clear();
    else await mouvementsStore.seed();
    rafraichir();
  }

  function nouveau() {
    setFiche({ open: true, mouvement: null });
  }

  async function enregistrer(values: MouvementFormValues) {
    const montant = Math.max(0, Number(values.montant) || 0);
    const opts: Partial<Pick<Mouvement, 'evenementId' | 'justificatif'>> = {};
    if (values.evenementId) opts.evenementId = values.evenementId;
    const justificatif = values.justificatif.trim();
    if (justificatif) opts.justificatif = justificatif;
    const base = {
      type: values.type,
      libelle: values.libelle.trim(),
      montant,
      date: values.date,
      categorie: values.categorie,
      previsionnel: values.previsionnel,
      ...opts,
    };
    if (fiche.mouvement) {
      await mouvementsStore.replace(fiche.mouvement.id, base);
    } else {
      await mouvementsStore.create(base);
    }
    setFiche({ open: false, mouvement: null });
    rafraichir();
  }

  async function supprimer() {
    if (fiche.mouvement) await mouvementsStore.remove(fiche.mouvement.id);
    setFiche({ open: false, mouvement: null });
    rafraichir();
  }

  function exporter() {
    telechargerCsv('comptabilite-eloquetia.csv', mouvementsVersCsv(mouvements));
  }

  const filtres_appliques = useMemo(
    () => filterMouvements(mouvements, filtres),
    [mouvements, filtres],
  );

  return (
    <>
      <PageHeader
        title="Comptabilité"
        description="Achats, revenus et prévisionnel."
        actions={
          <>
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
            <Button variant="outline" onClick={exporter}>
              Exporter (Excel/CSV)
            </Button>
            <Button variant="primary" onClick={nouveau}>
              Nouveau mouvement
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ComptaViewSwitcher value={vue} onChange={setVue} />
        {vue === 'liste' && (
          <ComptaFilters filtres={filtres} onChange={setFiltres} />
        )}
      </div>

      {vue === 'liste' && (
        <MouvementListView
          mouvements={filtres_appliques}
          onSelect={(m) => setFiche({ open: true, mouvement: m })}
        />
      )}
      {vue === 'dashboard' && <ComptaDashboardView mouvements={mouvements} />}
      {vue === 'previsionnel' && <PrevisionnelView mouvements={mouvements} />}

      <MouvementFiche
        open={fiche.open}
        mouvement={fiche.mouvement}
        dateInitiale="2026-06-15"
        evenements={evenements}
        onClose={() => setFiche({ open: false, mouvement: null })}
        onSave={enregistrer}
        onDelete={supprimer}
      />
    </>
  );
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/index.test.tsx`
Expected: PASS

- [ ] **Étape 5 : Vérifs complètes**

```bash
npm run typecheck --workspace web
npm run test --workspace web
npm run lint
```

Expected: typecheck PASS, tous les tests verts, lint 0 erreur (1 warning préexistant toléré).

- [ ] **Étape 6 : Commit**

```bash
git add web/src/features/accounting/index.tsx web/src/features/accounting/index.test.tsx
git commit -m "feat(compta): integration de la page (vues, export, CRUD)"
```

---

## Self-review

- Couverture : projection (T1), export CSV (T2), sélecteur (T3), tableau de bord réel (T4), prévisionnel cumulé (T5), intégration page + CRUD + export + démo (T6).
- Cohérence types : `VueCompta` (views.ts) ; `OptionEvenement` importé depuis `MouvementFiche` (Plan 4a) ; `projectionMensuelle`/`totaux`/`labelMoisCourt` depuis `aggregate.ts` ; `mouvementsVersCsv`/`telechargerCsv` depuis `export.ts`.
- Conventions : montant positif partout ; dashboard = réel uniquement ; prévisionnel sur axe temps ; champs optionnels via `opts` conditionnel + `replace`.
- Avant d'implémenter T6, vérifier que `SidePanel` rend bien le titre dans un `<h2>` (sinon adapter le sélecteur du test).
