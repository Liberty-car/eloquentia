# Comptabilité - Plan 4a (données + liste + fiche)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Poser la couche données du module Comptabilité (types, format, store, données de démo, filtrage) puis la vue Liste avec filtres et total, et la fiche créer/éditer/supprimer.

**Architecture:** Module frontend autonome dans `web/src/features/accounting/`, calqué sur `features/calendar`. Store localStorage via `createCollectionStore`. Aucun outil externe.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4 (tokens @theme), Vitest + Testing Library.

## Conventions verrouillées (NE PAS dévier)

- **`montant` est TOUJOURS POSITIF.** La direction vient de `type` (`revenu` | `depense`).
  Toute agrégation : `revenus = Σ montant où type==='revenu'`, `depenses = Σ montant où type==='depense'`, `resultat = revenus - depenses`. Ne jamais stocker un montant négatif, ne jamais faire `Math.abs`.
- **Réel** : `previsionnel === false`, `date <= 2026-09-30`. **Prévisionnel** : `previsionnel === true`, `date <= 2028-07-31`.
- Champs optionnels (`evenementId`, `justificatif`) : ne jamais assigner `undefined` (objet `opts` conditionnel + spread). Pour vider en édition, utiliser `store.replace` (enregistrement complet).
- Français avec accents partout. Pas de tiret cadratin.

---

### Tâche 1 : Types et catégories

**Files:**

- Create: `web/src/features/accounting/types.ts`

- [ ] **Étape 1 : Écrire le fichier**

```ts
// Modèle du module Comptabilité : mouvements (revenus et dépenses).

export const TYPES_MOUVEMENT = ['revenu', 'depense'] as const;
export type TypeMouvement = (typeof TYPES_MOUVEMENT)[number];

export const TYPE_LABELS: Record<TypeMouvement, string> = {
  revenu: 'Revenu',
  depense: 'Dépense',
};

export const CATEGORIES_REVENU = [
  'dons',
  'subventions',
  'sponsoring',
  'billetterie',
  'autre',
] as const;

export const CATEGORIES_DEPENSE = [
  'logistique',
  'communication',
  'materiel',
  'restauration',
  'autre',
] as const;

export const CATEGORIE_LABELS: Record<string, string> = {
  dons: 'Dons',
  subventions: 'Subventions',
  sponsoring: 'Sponsoring',
  billetterie: 'Billetterie',
  logistique: 'Logistique',
  communication: 'Communication',
  materiel: 'Matériel',
  restauration: 'Restauration',
  autre: 'Autre',
};

export function categoriesPour(type: TypeMouvement): readonly string[] {
  return type === 'revenu' ? CATEGORIES_REVENU : CATEGORIES_DEPENSE;
}

export function libelleCategorie(categorie: string): string {
  return CATEGORIE_LABELS[categorie] ?? categorie;
}

export interface Mouvement {
  id: string;
  type: TypeMouvement;
  libelle: string;
  montant: number; // EUR, TOUJOURS POSITIF. La direction vient de `type`.
  date: string; // ISO AAAA-MM-JJ. Réel <= 2026-09-30 ; prévisionnel <= 2028-07-31.
  categorie: string;
  previsionnel: boolean;
  evenementId?: string;
  justificatif?: string; // nom de fichier seulement (pas le contenu)
}

// Champs éditables dans la fiche (saisie brute).
export interface MouvementFormValues {
  type: TypeMouvement;
  libelle: string;
  montant: string;
  date: string;
  categorie: string;
  previsionnel: boolean;
  evenementId: string;
  justificatif: string;
}
```

- [ ] **Étape 2 : Commit**

```bash
git add web/src/features/accounting/types.ts
git commit -m "feat(compta): types et categories des mouvements"
```

---

### Tâche 2 : Format euros et totaux

**Files:**

- Create: `web/src/features/accounting/format.ts`
- Create: `web/src/features/accounting/aggregate.ts`
- Test: `web/src/features/accounting/aggregate.test.ts`

- [ ] **Étape 1 : Écrire `format.ts`**

```ts
// Formatage monétaire fr-FR.
export function formatEuros(montant: number): string {
  return montant.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
```

- [ ] **Étape 2 : Écrire le test `aggregate.test.ts` (rouge)**

```ts
import { describe, it, expect } from 'vitest';
import { totaux } from './aggregate';
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

describe('totaux', () => {
  it('additionne revenus et dépenses et calcule le résultat', () => {
    const mvts = [
      m({ type: 'revenu', montant: 1000 }),
      m({ type: 'revenu', montant: 500 }),
      m({ type: 'depense', montant: 300 }),
    ];
    expect(totaux(mvts)).toEqual({
      revenus: 1500,
      depenses: 300,
      resultat: 1200,
    });
  });

  it('renvoie des zéros sur une liste vide', () => {
    expect(totaux([])).toEqual({ revenus: 0, depenses: 0, resultat: 0 });
  });
});
```

- [ ] **Étape 3 : Lancer le test pour le voir échouer**

Run: `npx vitest run src/features/accounting/aggregate.test.ts` (depuis `web/`)
Expected: FAIL (`totaux` introuvable)

- [ ] **Étape 4 : Écrire `aggregate.ts`**

```ts
import type { Mouvement } from './types';

export interface Totaux {
  revenus: number;
  depenses: number;
  resultat: number;
}

// Convention : montant toujours positif, direction via `type`.
export function totaux(mouvements: Mouvement[]): Totaux {
  let revenus = 0;
  let depenses = 0;
  for (const m of mouvements) {
    if (m.type === 'revenu') revenus += m.montant;
    else depenses += m.montant;
  }
  return { revenus, depenses, resultat: revenus - depenses };
}
```

- [ ] **Étape 5 : Lancer le test (vert)**

Run: `npx vitest run src/features/accounting/aggregate.test.ts`
Expected: PASS

- [ ] **Étape 6 : Commit**

```bash
git add web/src/features/accounting/format.ts web/src/features/accounting/aggregate.ts web/src/features/accounting/aggregate.test.ts
git commit -m "feat(compta): formatEuros et calcul des totaux"
```

---

### Tâche 3 : Données de démo et store

**Files:**

- Create: `web/src/features/accounting/seed.ts`
- Create: `web/src/features/accounting/store.ts`

- [ ] **Étape 1 : Écrire `seed.ts`** (20 mouvements : 14 réel <= 2026-09-30, 6 prévisionnel <= 2028-07-31)

```ts
import type { Mouvement } from './types';

// 20 mouvements fictifs.
// Réel (previsionnel:false) : date <= 2026-09-30.
// Prévisionnel (previsionnel:true) : date <= 2028-07-31.
export function seedMouvements(): Mouvement[] {
  return [
    // --- Revenus réels ---
    {
      id: 'm1',
      type: 'revenu',
      libelle: 'Subvention Région Île-de-France',
      montant: 8000,
      date: '2026-06-05',
      categorie: 'subventions',
      previsionnel: false,
    },
    {
      id: 'm2',
      type: 'revenu',
      libelle: 'Don mécène fondateur',
      montant: 1500,
      date: '2026-06-12',
      categorie: 'dons',
      previsionnel: false,
    },
    {
      id: 'm3',
      type: 'revenu',
      libelle: 'Sponsoring BNP Paribas',
      montant: 5000,
      date: '2026-07-01',
      categorie: 'sponsoring',
      previsionnel: false,
    },
    {
      id: 'm4',
      type: 'revenu',
      libelle: 'Billetterie demi-finale',
      montant: 2200,
      date: '2026-08-05',
      categorie: 'billetterie',
      previsionnel: false,
      evenementId: 'e8',
    },
    {
      id: 'm5',
      type: 'revenu',
      libelle: 'Billetterie finale',
      montant: 4800,
      date: '2026-09-12',
      categorie: 'billetterie',
      previsionnel: false,
      evenementId: 'e10',
    },
    {
      id: 'm6',
      type: 'revenu',
      libelle: 'Subvention Mairie de Paris',
      montant: 3000,
      date: '2026-06-20',
      categorie: 'subventions',
      previsionnel: false,
    },
    {
      id: 'm7',
      type: 'revenu',
      libelle: 'Dons campagne en ligne',
      montant: 950,
      date: '2026-07-18',
      categorie: 'dons',
      previsionnel: false,
    },
    // --- Dépenses réelles ---
    {
      id: 'm8',
      type: 'depense',
      libelle: 'Location Théâtre de la Ville',
      montant: 3500,
      date: '2026-08-26',
      categorie: 'logistique',
      previsionnel: false,
      evenementId: 'e9',
    },
    {
      id: 'm9',
      type: 'depense',
      libelle: 'Impression affiches et flyers',
      montant: 680,
      date: '2026-06-25',
      categorie: 'communication',
      previsionnel: false,
    },
    {
      id: 'm10',
      type: 'depense',
      libelle: 'Trophées et récompenses',
      montant: 450,
      date: '2026-08-20',
      categorie: 'materiel',
      previsionnel: false,
    },
    {
      id: 'm11',
      type: 'depense',
      libelle: 'Traiteur finale',
      montant: 1200,
      date: '2026-09-12',
      categorie: 'restauration',
      previsionnel: false,
      evenementId: 'e10',
    },
    {
      id: 'm12',
      type: 'depense',
      libelle: 'Matériel sonorisation',
      montant: 900,
      date: '2026-08-12',
      categorie: 'materiel',
      previsionnel: false,
    },
    {
      id: 'm13',
      type: 'depense',
      libelle: 'Frais de déplacement bénévoles',
      montant: 540,
      date: '2026-07-08',
      categorie: 'logistique',
      previsionnel: false,
    },
    {
      id: 'm14',
      type: 'depense',
      libelle: 'Campagne réseaux sociaux',
      montant: 750,
      date: '2026-07-30',
      categorie: 'communication',
      previsionnel: false,
    },
    // --- Prévisionnel (saisons 2027 et 2028) ---
    {
      id: 'm15',
      type: 'revenu',
      libelle: 'Subvention prévisionnelle saison 2027',
      montant: 9000,
      date: '2027-01-15',
      categorie: 'subventions',
      previsionnel: true,
    },
    {
      id: 'm16',
      type: 'revenu',
      libelle: 'Sponsoring prévisionnel 2027',
      montant: 6000,
      date: '2027-03-01',
      categorie: 'sponsoring',
      previsionnel: true,
    },
    {
      id: 'm17',
      type: 'depense',
      libelle: 'Location salle finale 2027 (prév.)',
      montant: 3800,
      date: '2027-06-15',
      categorie: 'logistique',
      previsionnel: true,
    },
    {
      id: 'm18',
      type: 'revenu',
      libelle: 'Billetterie prévisionnelle finale 2027',
      montant: 5200,
      date: '2027-09-10',
      categorie: 'billetterie',
      previsionnel: true,
    },
    {
      id: 'm19',
      type: 'depense',
      libelle: 'Budget communication 2028 (prév.)',
      montant: 2500,
      date: '2028-02-01',
      categorie: 'communication',
      previsionnel: true,
    },
    {
      id: 'm20',
      type: 'depense',
      libelle: 'Finale 2028 - logistique prévisionnelle',
      montant: 4200,
      date: '2028-07-15',
      categorie: 'logistique',
      previsionnel: true,
    },
  ];
}
```

- [ ] **Étape 2 : Écrire `store.ts`**

```ts
import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Mouvement } from './types';
import { seedMouvements } from './seed';

export const mouvementsStore = createCollectionStore<Mouvement>(
  'accounting:mouvements',
  seedMouvements,
);
```

- [ ] **Étape 3 : Commit**

```bash
git add web/src/features/accounting/seed.ts web/src/features/accounting/store.ts
git commit -m "feat(compta): donnees de demo et store des mouvements"
```

---

### Tâche 4 : Filtrage

**Files:**

- Create: `web/src/features/accounting/filter.ts`
- Test: `web/src/features/accounting/filter.test.ts`

- [ ] **Étape 1 : Écrire le test (rouge)**

```ts
import { describe, it, expect } from 'vitest';
import { filterMouvements, type ComptaFiltres } from './filter';
import type { Mouvement } from './types';

const base: ComptaFiltres = {
  recherche: '',
  type: 'tous',
  categorie: 'toutes',
};

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Subvention Région',
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
];

describe('filterMouvements', () => {
  it('filtre par type', () => {
    const r = filterMouvements(mvts, { ...base, type: 'depense' });
    expect(r.map((m) => m.id)).toEqual(['b']);
  });

  it('filtre par catégorie', () => {
    const r = filterMouvements(mvts, { ...base, categorie: 'subventions' });
    expect(r.map((m) => m.id)).toEqual(['a']);
  });

  it('filtre par recherche sur le libellé (insensible à la casse)', () => {
    const r = filterMouvements(mvts, { ...base, recherche: 'affi' });
    expect(r.map((m) => m.id)).toEqual(['b']);
  });

  it('renvoie tout sans filtre', () => {
    expect(filterMouvements(mvts, base)).toHaveLength(2);
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/filter.test.ts`
Expected: FAIL

- [ ] **Étape 3 : Écrire `filter.ts`**

```ts
import type { Mouvement, TypeMouvement } from './types';

export interface ComptaFiltres {
  recherche: string;
  type: TypeMouvement | 'tous';
  categorie: string | 'toutes';
}

export function filterMouvements(
  mouvements: Mouvement[],
  filtres: ComptaFiltres,
): Mouvement[] {
  const q = filtres.recherche.trim().toLowerCase();
  return mouvements.filter((m) => {
    if (filtres.type !== 'tous' && m.type !== filtres.type) return false;
    if (filtres.categorie !== 'toutes' && m.categorie !== filtres.categorie) {
      return false;
    }
    if (q && !m.libelle.toLowerCase().includes(q)) return false;
    return true;
  });
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/filter.test.ts`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/filter.ts web/src/features/accounting/filter.test.ts
git commit -m "feat(compta): filtrage des mouvements"
```

---

### Tâche 5 : Barre de filtres

**Files:**

- Create: `web/src/features/accounting/ComptaFilters.tsx`

Filtres sur une seule ligne : recherche + chips de type (Tous / Revenu / Dépense) + select natif de catégorie (toutes les catégories connues). Style aligné sur `CrmFilters`/chips de `TacheFiche`.

- [ ] **Étape 1 : Écrire le composant**

```tsx
import { CATEGORIE_LABELS, TYPES_MOUVEMENT, TYPE_LABELS } from './types';
import type { ComptaFiltres } from './filter';
import { cn } from '../../lib/cn';

const TYPE_OPTIONS = ['tous', ...TYPES_MOUVEMENT] as const;
const CATEGORIES = Object.keys(CATEGORIE_LABELS);

export function ComptaFilters({
  filtres,
  onChange,
}: {
  filtres: ComptaFiltres;
  onChange: (filtres: ComptaFiltres) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={filtres.recherche}
        onChange={(e) => onChange({ ...filtres, recherche: e.target.value })}
        placeholder="Rechercher un libellé"
        className="h-9 w-56 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      />

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <div className="inline-flex items-center gap-1">
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange({ ...filtres, type: t })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filtres.type === t
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
            )}
          >
            {t === 'tous' ? 'Tous' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <span className="mx-1 h-5 w-px bg-trait-fort" />

      <select
        value={filtres.categorie}
        onChange={(e) => onChange({ ...filtres, categorie: e.target.value })}
        className="h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
      >
        <option value="toutes">Toutes les catégories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORIE_LABELS[c]}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add web/src/features/accounting/ComptaFilters.tsx
git commit -m "feat(compta): barre de filtres"
```

---

### Tâche 6 : Vue Liste

**Files:**

- Create: `web/src/features/accounting/MouvementListView.tsx`
- Test: `web/src/features/accounting/MouvementListView.test.tsx`

Tableau des mouvements (date, libellé, catégorie, badge type/prévisionnel, montant signé visuellement) + ligne de total (revenus / dépenses / résultat). Clic sur une ligne -> `onSelect`. État vide via `EmptyState`.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MouvementListView } from './MouvementListView';
import type { Mouvement } from './types';

const mvts: Mouvement[] = [
  {
    id: 'a',
    type: 'revenu',
    libelle: 'Subvention Région',
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
];

describe('MouvementListView', () => {
  it('affiche les mouvements et réagit au clic', () => {
    const onSelect = vi.fn();
    render(<MouvementListView mouvements={mvts} onSelect={onSelect} />);
    expect(screen.getByText('Subvention Région')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Subvention Région'));
    expect(onSelect).toHaveBeenCalledWith(mvts[0]);
  });

  it('affiche un état vide sans mouvement', () => {
    render(<MouvementListView mouvements={[]} onSelect={() => {}} />);
    expect(screen.getByText('Aucun mouvement')).toBeInTheDocument();
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/accounting/MouvementListView.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Écrire le composant**

```tsx
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import { formatEuros } from './format';
import { totaux } from './aggregate';
import { libelleCategorie, TYPE_LABELS, type Mouvement } from './types';

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

export function MouvementListView({
  mouvements,
  onSelect,
}: {
  mouvements: Mouvement[];
  onSelect: (mouvement: Mouvement) => void;
}) {
  if (mouvements.length === 0) {
    return (
      <EmptyState
        title="Aucun mouvement"
        description="Active les données de démo ou ajoute un mouvement."
      />
    );
  }

  const t = totaux(mouvements);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border-2 border-projecteur bg-papier">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-trait text-xs uppercase tracking-wide text-encre-3">
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Libellé</th>
              <th className="px-4 py-2 font-medium">Catégorie</th>
              <th className="px-4 py-2 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((m) => (
              <tr
                key={m.id}
                onClick={() => onSelect(m)}
                className="cursor-pointer border-b border-trait last:border-0 transition-colors hover:bg-scene"
              >
                <td className="whitespace-nowrap px-4 py-3 text-encre-3">
                  {formatDateCourte(m.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-encre">{m.libelle}</span>
                    {m.previsionnel && <Badge tone="jaune">Prévision</Badge>}
                  </span>
                </td>
                <td className="px-4 py-3 text-encre-2">
                  {libelleCategorie(m.categorie)}
                </td>
                <td
                  className={cn(
                    'whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums',
                    m.type === 'revenu' ? 'text-succes' : 'text-erreur',
                  )}
                >
                  {m.type === 'revenu' ? '+' : '-'}
                  {formatEuros(m.montant)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
        <span className="text-encre-2">
          Revenus :{' '}
          <span className="font-semibold text-succes tabular-nums">
            {formatEuros(t.revenus)}
          </span>
        </span>
        <span className="text-encre-2">
          Dépenses :{' '}
          <span className="font-semibold text-erreur tabular-nums">
            {formatEuros(t.depenses)}
          </span>
        </span>
        <span className="text-encre-2">
          Résultat :{' '}
          <span
            className={cn(
              'font-bold tabular-nums',
              t.resultat >= 0 ? 'text-succes' : 'text-erreur',
            )}
          >
            {formatEuros(t.resultat)}
          </span>
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/accounting/MouvementListView.test.tsx`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/accounting/MouvementListView.tsx web/src/features/accounting/MouvementListView.test.tsx
git commit -m "feat(compta): vue liste des mouvements avec total"
```

---

### Tâche 7 : Fiche Mouvement

**Files:**

- Create: `web/src/features/accounting/MouvementFiche.tsx`

Panneau latéral (SidePanel) pour créer / éditer / supprimer. Type (2 chips), catégorie (chips selon le type, réinitialisée à `autre` si le type change vers un type ne contenant pas la catégorie), libellé, montant (number), date, case « Prévisionnel », lien événement (select natif depuis une liste `evenements` passée en prop), justificatif (input file -> stocke `file.name`). Le bouton Enregistrer transmet `MouvementFormValues`.

- [ ] **Étape 1 : Écrire le composant**

```tsx
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import {
  CATEGORIE_LABELS,
  categoriesPour,
  TYPES_MOUVEMENT,
  TYPE_LABELS,
  type Mouvement,
  type MouvementFormValues,
  type TypeMouvement,
} from './types';

export interface OptionEvenement {
  id: string;
  titre: string;
}

function valeurs(
  mouvement: Mouvement | null,
  dateInitiale: string,
): MouvementFormValues {
  return {
    type: mouvement?.type ?? 'revenu',
    libelle: mouvement?.libelle ?? '',
    montant: mouvement ? String(mouvement.montant) : '',
    date: mouvement?.date ?? dateInitiale,
    categorie: mouvement?.categorie ?? 'dons',
    previsionnel: mouvement?.previsionnel ?? false,
    evenementId: mouvement?.evenementId ?? '',
    justificatif: mouvement?.justificatif ?? '',
  };
}

export function MouvementFiche({
  open,
  mouvement,
  dateInitiale,
  evenements,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  mouvement: Mouvement | null;
  dateInitiale: string;
  evenements: OptionEvenement[];
  onClose: () => void;
  onSave: (values: MouvementFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<MouvementFormValues>(
    valeurs(mouvement, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(mouvement, dateInitiale));
  }, [mouvement, dateInitiale]);

  function set<K extends keyof MouvementFormValues>(
    key: K,
    value: MouvementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function changerType(type: TypeMouvement) {
    setValues((prev) => {
      const categories = categoriesPour(type);
      const categorie = categories.includes(prev.categorie)
        ? prev.categorie
        : (categories[0] as string);
      return { ...prev, type, categorie };
    });
  }

  const categories = categoriesPour(values.type);

  return (
    <SidePanel
      open={open}
      title={mouvement ? 'Modifier le mouvement' : 'Nouveau mouvement'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Type</span>
          <div className="flex gap-1.5">
            {TYPES_MOUVEMENT.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => changerType(type)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.type === type
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Libellé"
          value={values.libelle}
          onChange={(e) => set('libelle', e.target.value)}
        />

        <Input
          label="Montant (EUR)"
          type="number"
          min="0"
          value={values.montant}
          onChange={(e) => set('montant', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Catégorie</span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((categorie) => (
              <button
                key={categorie}
                type="button"
                onClick={() => set('categorie', categorie)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.categorie === categorie
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {CATEGORIE_LABELS[categorie]}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => set('date', e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-encre-2">
          <input
            type="checkbox"
            checked={values.previsionnel}
            onChange={(e) => set('previsionnel', e.target.checked)}
            className="h-4 w-4 rounded border-trait-fort text-gel-rose focus:ring-focus/30"
          />
          Mouvement prévisionnel
        </label>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="m-evenement"
            className="text-xs font-medium text-encre-3"
          >
            Événement lié (optionnel)
          </label>
          <select
            id="m-evenement"
            value={values.evenementId}
            onChange={(e) => set('evenementId', e.target.value)}
            className="h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          >
            <option value="">Aucun</option>
            {evenements.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.titre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="m-justif"
            className="text-xs font-medium text-encre-3"
          >
            Justificatif (optionnel)
          </label>
          <input
            id="m-justif"
            type="file"
            onChange={(e) => {
              const fichier = e.target.files?.[0];
              if (fichier) set('justificatif', fichier.name);
            }}
            className="text-sm text-encre-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-brume file:px-3 file:py-1 file:text-xs file:font-medium file:text-velours"
          />
          {values.justificatif && (
            <span className="flex items-center gap-2 text-xs text-encre-2">
              {values.justificatif}
              <button
                type="button"
                onClick={() => set('justificatif', '')}
                className="text-erreur hover:underline"
              >
                Retirer
              </button>
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          {mouvement ? (
            <Button variant="ghost" className="text-erreur" onClick={onDelete}>
              Supprimer
            </Button>
          ) : (
            <span />
          )}
          <Button variant="primary" onClick={() => onSave(values)}>
            Enregistrer
          </Button>
        </div>
      </div>
    </SidePanel>
  );
}
```

- [ ] **Étape 2 : Vérifier le typecheck**

Run: `npm run typecheck --workspace web` (depuis la racine)
Expected: PASS

- [ ] **Étape 3 : Commit**

```bash
git add web/src/features/accounting/MouvementFiche.tsx
git commit -m "feat(compta): fiche mouvement (creer/editer/supprimer)"
```

---

## Self-review

- Couverture spec : types + catégories (T1), format + totaux (T2), démo + store (T3), filtrage (T4), barre de filtres (T5), liste + total (T6), fiche CRUD (T7). L'intégration en page (sélecteur, dashboard, prévisionnel, export) est dans le **Plan 4b**.
- Cohérence : `montant` positif partout ; `totaux` utilisé par la liste ; `categoriesPour`/`CATEGORIE_LABELS` partagés ; champs optionnels gérés par la fiche (form values toujours présentes, conversion en `opts` conditionnel côté page en 4b).
- Pas de placeholder. Tests fournis pour aggregate, filter, list view.
