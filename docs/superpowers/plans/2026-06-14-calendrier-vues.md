# Calendrier vues supplémentaires (Plan 3b) : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter trois vues au module Calendrier (Agenda chronologique, Tâches par membre, Tâches par statut en kanban) et un sélecteur de vues, en plus de la vue mensuelle existante.

**Architecture:** Tout dans `web/src/features/calendar/`. Chaque vue est un composant présentationnel autonome recevant les données + callbacks. La page `index.tsx` orchestre le choix de vue. Le kanban des tâches modifie le statut via le store au drop (`@dnd-kit/core`, déjà installé).

**Tech Stack:** React 19, TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Tailwind v4, Vitest + Testing Library, `@dnd-kit/core`.

**Décisions:** l'Agenda liste tous les éléments datés (événements + tâches avec échéance) par ordre chronologique croissant. Tâches par membre : une section par membre (Luciano, Eva, Armelle, Anthony). Tâches par statut : colonnes À faire / En cours / Fait, glisser-déposer pour changer le statut.

**Commandes de vérification:**

- Tests : `npm run test --workspace web`
- Typecheck : `npm run typecheck --workspace web`
- Lint : `npm run lint`

---

### Task 1 : Sélecteur de vues

**Files:**

- Create: `web/src/features/calendar/views.ts`
- Create: `web/src/features/calendar/CalViewSwitcher.tsx`
- Test: `web/src/features/calendar/CalViewSwitcher.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/CalViewSwitcher.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalViewSwitcher } from './CalViewSwitcher';

describe('CalViewSwitcher', () => {
  it('affiche les vues et émet la sélection', () => {
    const onChange = vi.fn();
    render(<CalViewSwitcher value="mois" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Mois' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agenda' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Agenda' }));
    expect(onChange).toHaveBeenCalledWith('agenda');
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- CalViewSwitcher`
Expected: FAIL.

- [ ] **Step 3 : Créer la configuration**

Créer `web/src/features/calendar/views.ts` :

```ts
// Vues du module Calendrier (ordre du selecteur).
export const VUES_CAL = [
  { id: 'mois', label: 'Mois' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'membres', label: 'Par membre' },
  { id: 'statut', label: 'Par statut' },
] as const;

export type VueCal = (typeof VUES_CAL)[number]['id'];
```

- [ ] **Step 4 : Créer le sélecteur**

Créer `web/src/features/calendar/CalViewSwitcher.tsx` :

```tsx
import { cn } from '../../lib/cn';
import { VUES_CAL, type VueCal } from './views';

export function CalViewSwitcher({
  value,
  onChange,
}: {
  value: VueCal;
  onChange: (vue: VueCal) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-trait bg-papier p-1">
      {VUES_CAL.map((vue) => (
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

- [ ] **Step 5 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- CalViewSwitcher`
Expected: PASS (1 test).

- [ ] **Step 6 : Commit**

```bash
git add web/src/features/calendar/views.ts web/src/features/calendar/CalViewSwitcher.tsx web/src/features/calendar/CalViewSwitcher.test.tsx
git commit -m "feat(calendrier): selecteur de vues"
```

---

### Task 2 : Format de date et vue Agenda

**Files:**

- Create: `web/src/features/calendar/dates.ts`
- Create: `web/src/features/calendar/AgendaView.tsx`
- Test: `web/src/features/calendar/dates.test.ts`
- Test: `web/src/features/calendar/AgendaView.test.tsx`

- [ ] **Step 1 : Écrire les tests qui échouent**

Créer `web/src/features/calendar/dates.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { formatDateFr } from './dates';

describe('formatDateFr', () => {
  it('formate une date ISO en français', () => {
    expect(formatDateFr('2026-09-12')).toMatch(/12/);
    expect(formatDateFr('2026-09-12')).toMatch(/2026/);
  });
});
```

Créer `web/src/features/calendar/AgendaView.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgendaView } from './AgendaView';
import type { Evenement, Tache } from './types';

const evenements: Evenement[] = [
  { id: 'e1', titre: 'Finale Eloquentia', date: '2026-09-12', heure: '19:00' },
];
const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Briefer le jury',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'moyenne',
    echeance: '2026-09-05',
  },
  {
    id: 't2',
    titre: 'Tâche sans échéance',
    membre: 'Eva',
    statut: 'a_faire',
    priorite: 'basse',
  },
];

describe('AgendaView', () => {
  it('liste les éléments datés par ordre chronologique et réagit aux clics', () => {
    const onSelectEvenement = vi.fn();
    render(
      <AgendaView
        evenements={evenements}
        taches={taches}
        onSelectEvenement={onSelectEvenement}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Finale Eloquentia')).toBeInTheDocument();
    expect(screen.getByText('Briefer le jury')).toBeInTheDocument();
    // La tache sans echeance n'apparait pas dans l'agenda.
    expect(screen.queryByText('Tâche sans échéance')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Finale Eloquentia'));
    expect(onSelectEvenement).toHaveBeenCalledWith(evenements[0]);
  });

  it('affiche un état vide sans élément daté', () => {
    render(
      <AgendaView
        evenements={[]}
        taches={[]}
        onSelectEvenement={() => {}}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Aucun élément à venir')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer les tests pour vérifier l'échec**

Run: `npm run test --workspace web -- "calendar/dates" AgendaView`
Expected: FAIL.

- [ ] **Step 3 : Créer le format de date**

Créer `web/src/features/calendar/dates.ts` :

```ts
// Formate une date ISO (AAAA-MM-JJ) en francais, sans decalage de fuseau.
export function formatDateFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
```

- [ ] **Step 4 : Implémenter la vue Agenda**

Créer `web/src/features/calendar/AgendaView.tsx` :

```tsx
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatDateFr } from './dates';
import { STATUT_LABELS, type Evenement, type Tache } from './types';

type Element =
  | { type: 'evenement'; date: string; evenement: Evenement }
  | { type: 'tache'; date: string; tache: Tache };

export function AgendaView({
  evenements,
  taches,
  onSelectEvenement,
  onSelectTache,
}: {
  evenements: Evenement[];
  taches: Tache[];
  onSelectEvenement: (evenement: Evenement) => void;
  onSelectTache: (tache: Tache) => void;
}) {
  const elements: Element[] = [
    ...evenements.map(
      (e): Element => ({ type: 'evenement', date: e.date, evenement: e }),
    ),
    ...taches
      .filter((t) => t.echeance)
      .map(
        (t): Element => ({
          type: 'tache',
          date: t.echeance as string,
          tache: t,
        }),
      ),
  ].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  if (elements.length === 0) {
    return (
      <EmptyState
        title="Aucun élément à venir"
        description="Active les données de démo ou crée un événement ou une tâche."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {elements.map((el) => (
        <button
          key={`${el.type}-${el.type === 'evenement' ? el.evenement.id : el.tache.id}`}
          type="button"
          onClick={() =>
            el.type === 'evenement'
              ? onSelectEvenement(el.evenement)
              : onSelectTache(el.tache)
          }
          className="flex items-center justify-between gap-3 rounded-xl border border-trait bg-papier px-4 py-3 text-left transition-colors hover:bg-scene"
        >
          <span className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-encre-3">
              {formatDateFr(el.date)}
            </span>
            <span className="font-medium text-encre">
              {el.type === 'evenement' ? el.evenement.titre : el.tache.titre}
            </span>
          </span>
          {el.type === 'evenement' ? (
            <Badge tone="rose">Événement</Badge>
          ) : (
            <Badge tone="jaune">{STATUT_LABELS[el.tache.statut]}</Badge>
          )}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5 : Lancer les tests pour vérifier le succès**

Run: `npm run test --workspace web -- "calendar/dates" AgendaView`
Expected: PASS (3 tests).

- [ ] **Step 6 : Commit**

```bash
git add web/src/features/calendar/dates.ts web/src/features/calendar/dates.test.ts web/src/features/calendar/AgendaView.tsx web/src/features/calendar/AgendaView.test.tsx
git commit -m "feat(calendrier): vue agenda chronologique"
```

---

### Task 3 : Vue Tâches par membre

**Files:**

- Create: `web/src/features/calendar/TachesParMembreView.tsx`
- Test: `web/src/features/calendar/TachesParMembreView.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/TachesParMembreView.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TachesParMembreView } from './TachesParMembreView';
import type { Tache } from './types';

const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Relancer Orange',
    membre: 'Luciano',
    statut: 'en_cours',
    priorite: 'haute',
  },
  {
    id: 't2',
    titre: 'Réserver salle',
    membre: 'Eva',
    statut: 'fait',
    priorite: 'haute',
  },
];

describe('TachesParMembreView', () => {
  it('regroupe les tâches par membre et réagit aux clics', () => {
    const onSelectTache = vi.fn();
    render(
      <TachesParMembreView taches={taches} onSelectTache={onSelectTache} />,
    );
    expect(
      screen.getByRole('heading', { name: /Luciano/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Eva/ })).toBeInTheDocument();
    fireEvent.click(screen.getByText('Relancer Orange'));
    expect(onSelectTache).toHaveBeenCalledWith(taches[0]);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- TachesParMembreView`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la vue**

Créer `web/src/features/calendar/TachesParMembreView.tsx` :

```tsx
import { Badge } from '../../components/ui/Badge';
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
                <span className="flex gap-1.5">
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
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- TachesParMembreView`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/TachesParMembreView.tsx web/src/features/calendar/TachesParMembreView.test.tsx
git commit -m "feat(calendrier): vue taches par membre"
```

---

### Task 4 : Vue Tâches par statut (kanban)

**Files:**

- Create: `web/src/features/calendar/TachesStatutView.tsx`
- Test: `web/src/features/calendar/TachesStatutView.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/TachesStatutView.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TachesStatutView } from './TachesStatutView';
import type { Tache } from './types';

const taches: Tache[] = [
  {
    id: 't1',
    titre: 'Relancer Orange',
    membre: 'Luciano',
    statut: 'a_faire',
    priorite: 'haute',
  },
  {
    id: 't2',
    titre: 'Réserver salle',
    membre: 'Eva',
    statut: 'fait',
    priorite: 'haute',
  },
];

describe('TachesStatutView', () => {
  it('affiche une colonne par statut et réagit au clic', () => {
    const onSelectTache = vi.fn();
    render(
      <TachesStatutView
        taches={taches}
        onChangeStatut={() => {}}
        onSelectTache={onSelectTache}
      />,
    );
    expect(screen.getByText('À faire')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText('Fait')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Relancer Orange'));
    expect(onSelectTache).toHaveBeenCalledWith(taches[0]);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- TachesStatutView`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la vue**

Créer `web/src/features/calendar/TachesStatutView.tsx` :

```tsx
import { useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/cn';
import {
  PRIORITE_LABELS,
  STATUTS,
  STATUT_LABELS,
  type Statut,
  type Tache,
} from './types';

function CarteTache({
  tache,
  onSelect,
}: {
  tache: Tache;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: tache.id,
    });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  const depart = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onPointerDownCapture={(e) => {
        depart.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const d = depart.current;
        if (
          d &&
          (Math.abs(e.clientX - d.x) > 5 || Math.abs(e.clientY - d.y) > 5)
        ) {
          return;
        }
        onSelect();
      }}
      className={cn(
        'cursor-pointer rounded-xl border border-trait bg-papier p-3',
        isDragging && 'opacity-50',
      )}
    >
      <p className="text-sm font-medium text-encre">{tache.titre}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone="rose">{PRIORITE_LABELS[tache.priorite]}</Badge>
        <span className="text-xs text-encre-3">{tache.membre}</span>
      </div>
    </div>
  );
}

function Colonne({
  statut,
  taches,
  onSelect,
}: {
  statut: Statut;
  taches: Tache[];
  onSelect: (tache: Tache) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: statut });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 flex-shrink-0 flex-col gap-2 rounded-xl bg-scene p-2',
        isOver && 'ring-2 ring-gel-rose',
      )}
    >
      <div className="flex items-center justify-between px-1 py-1 text-sm font-semibold text-encre">
        <span>{STATUT_LABELS[statut]}</span>
        <span className="rounded-full bg-papier px-2 text-xs text-encre-3">
          {taches.length}
        </span>
      </div>
      {taches.map((tache) => (
        <CarteTache
          key={tache.id}
          tache={tache}
          onSelect={() => onSelect(tache)}
        />
      ))}
    </div>
  );
}

export function TachesStatutView({
  taches,
  onChangeStatut,
  onSelectTache,
}: {
  taches: Tache[];
  onChangeStatut: (id: string, statut: Statut) => void;
  onSelectTache: (tache: Tache) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    onChangeStatut(String(active.id), over.id as Statut);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUTS.map((statut) => (
          <Colonne
            key={statut}
            statut={statut}
            taches={taches.filter((t) => t.statut === statut)}
            onSelect={onSelectTache}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- TachesStatutView`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/TachesStatutView.tsx web/src/features/calendar/TachesStatutView.test.tsx
git commit -m "feat(calendrier): vue taches par statut (kanban)"
```

---

### Task 5 : Intégration des vues dans la page

**Files:**

- Modify: `web/src/features/calendar/index.tsx` (remplacement complet)
- Modify: `web/src/features/calendar/index.test.tsx`

- [ ] **Step 1 : Ajouter le test**

Dans `web/src/features/calendar/index.test.tsx`, ajouter ce test à la fin du `describe` (avant la `});` de fermeture du describe) :

```tsx
it('bascule sur la vue Par statut', async () => {
  render(<CalendarPage />);
  fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
  await waitFor(async () => {
    expect(await tachesStore.list()).toHaveLength(20);
  });
  fireEvent.click(screen.getByRole('button', { name: 'Par statut' }));
  expect(await screen.findByText('En cours')).toBeInTheDocument();
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "calendar/index"`
Expected: FAIL (le bouton "Par statut" n'existe pas encore).

- [ ] **Step 3 : Remplacer la page**

Remplacer tout le contenu de `web/src/features/calendar/index.tsx` par :

```tsx
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import { evenementsStore, tachesStore } from './store';
import { MonthCalendar } from './MonthCalendar';
import { AgendaView } from './AgendaView';
import { TachesParMembreView } from './TachesParMembreView';
import { TachesStatutView } from './TachesStatutView';
import { CalViewSwitcher } from './CalViewSwitcher';
import { EvenementFiche } from './EvenementFiche';
import { TacheFiche } from './TacheFiche';
import { aujourdhuiIso, NOMS_MOIS } from './grille';
import type { VueCal } from './views';
import type {
  Evenement,
  EvenementFormValues,
  Statut,
  Tache,
  TacheFormValues,
} from './types';

function vide(v: string): string | undefined {
  const t = v.trim();
  return t === '' ? undefined : t;
}

export default function CalendarPage() {
  const maintenant = new Date();
  const [annee, setAnnee] = useState(maintenant.getFullYear());
  const [mois, setMois] = useState(maintenant.getMonth());
  const [vue, setVue] = useState<VueCal>('mois');
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [demo, setDemo] = useState(false);

  const [dateChoisie, setDateChoisie] = useState(aujourdhuiIso());
  const [chooserOuvert, setChooserOuvert] = useState(false);
  const [evFiche, setEvFiche] = useState<{
    open: boolean;
    evenement: Evenement | null;
  }>({
    open: false,
    evenement: null,
  });
  const [tFiche, setTFiche] = useState<{ open: boolean; tache: Tache | null }>({
    open: false,
    tache: null,
  });

  const rafraichir = useCallback(() => {
    void evenementsStore.list().then(setEvenements);
    void tachesStore.list().then(setTaches);
    void evenementsStore.isSeeded().then(setDemo);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) {
      await evenementsStore.clear();
      await tachesStore.clear();
    } else {
      await evenementsStore.seed();
      await tachesStore.seed();
    }
    rafraichir();
  }

  function moisPrecedent() {
    setMois((m) => {
      if (m === 0) {
        setAnnee((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function moisSuivant() {
    setMois((m) => {
      if (m === 11) {
        setAnnee((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function ouvrirJour(iso: string) {
    setDateChoisie(iso);
    setChooserOuvert(true);
  }

  function nouvelEvenement() {
    setChooserOuvert(false);
    setEvFiche({ open: true, evenement: null });
  }

  function nouvelleTache() {
    setChooserOuvert(false);
    setTFiche({ open: true, tache: null });
  }

  async function enregistrerEvenement(values: EvenementFormValues) {
    const opts: Partial<Pick<Evenement, 'heure' | 'lieu' | 'description'>> = {};
    const heure = vide(values.heure);
    if (heure !== undefined) opts.heure = heure;
    const lieu = vide(values.lieu);
    if (lieu !== undefined) opts.lieu = lieu;
    const description = vide(values.description);
    if (description !== undefined) opts.description = description;
    const base = { titre: values.titre.trim(), date: values.date, ...opts };
    if (evFiche.evenement) {
      await evenementsStore.replace(evFiche.evenement.id, base);
    } else {
      await evenementsStore.create(base);
    }
    setEvFiche({ open: false, evenement: null });
    rafraichir();
  }

  async function supprimerEvenement() {
    if (evFiche.evenement) await evenementsStore.remove(evFiche.evenement.id);
    setEvFiche({ open: false, evenement: null });
    rafraichir();
  }

  async function enregistrerTache(values: TacheFormValues) {
    const opts: Partial<Pick<Tache, 'echeance' | 'description'>> = {};
    const echeance = vide(values.echeance);
    if (echeance !== undefined) opts.echeance = echeance;
    const description = vide(values.description);
    if (description !== undefined) opts.description = description;
    const base = {
      titre: values.titre.trim(),
      membre: values.membre,
      statut: values.statut,
      priorite: values.priorite,
      ...opts,
    };
    if (tFiche.tache) {
      await tachesStore.replace(tFiche.tache.id, base);
    } else {
      await tachesStore.create(base);
    }
    setTFiche({ open: false, tache: null });
    rafraichir();
  }

  async function supprimerTache() {
    if (tFiche.tache) await tachesStore.remove(tFiche.tache.id);
    setTFiche({ open: false, tache: null });
    rafraichir();
  }

  async function changerStatut(id: string, statut: Statut) {
    const tache = taches.find((t) => t.id === id);
    if (!tache || tache.statut === statut) return;
    await tachesStore.update(id, { statut });
    rafraichir();
  }

  const selectEvenement = (e: Evenement) =>
    setEvFiche({ open: true, evenement: e });
  const selectTache = (t: Tache) => setTFiche({ open: true, tache: t });

  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Événements, tâches et échéances."
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
            <Button variant="outline" onClick={nouvelleTache}>
              Nouvelle tâche
            </Button>
            <Button variant="primary" onClick={nouvelEvenement}>
              Nouvel événement
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <CalViewSwitcher value={vue} onChange={setVue} />
      </div>

      {vue === 'mois' && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={moisPrecedent}
              aria-label="Mois précédent"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="min-w-44 text-center text-lg font-bold text-encre">
              {NOMS_MOIS[mois]} {annee}
            </span>
            <Button
              variant="ghost"
              onClick={moisSuivant}
              aria-label="Mois suivant"
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAnnee(maintenant.getFullYear());
                setMois(maintenant.getMonth());
              }}
            >
              Aujourd'hui
            </Button>
          </div>
          <MonthCalendar
            annee={annee}
            mois={mois}
            evenements={evenements}
            taches={taches}
            aujourdhui={aujourdhuiIso()}
            onJourClic={ouvrirJour}
            onSelectEvenement={selectEvenement}
            onSelectTache={selectTache}
          />
        </>
      )}

      {vue === 'agenda' && (
        <AgendaView
          evenements={evenements}
          taches={taches}
          onSelectEvenement={selectEvenement}
          onSelectTache={selectTache}
        />
      )}

      {vue === 'membres' && (
        <TachesParMembreView taches={taches} onSelectTache={selectTache} />
      )}

      {vue === 'statut' && (
        <TachesStatutView
          taches={taches}
          onChangeStatut={changerStatut}
          onSelectTache={selectTache}
        />
      )}

      <SidePanel
        open={chooserOuvert}
        title={`Ajouter le ${dateChoisie}`}
        onClose={() => setChooserOuvert(false)}
      >
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={nouvelEvenement}>
            Nouvel événement
          </Button>
          <Button variant="outline" onClick={nouvelleTache}>
            Nouvelle tâche
          </Button>
        </div>
      </SidePanel>

      <EvenementFiche
        open={evFiche.open}
        evenement={evFiche.evenement}
        dateInitiale={dateChoisie}
        onClose={() => setEvFiche({ open: false, evenement: null })}
        onSave={enregistrerEvenement}
        onDelete={supprimerEvenement}
      />

      <TacheFiche
        open={tFiche.open}
        tache={tFiche.tache}
        dateInitiale={dateChoisie}
        onClose={() => setTFiche({ open: false, tache: null })}
        onSave={enregistrerTache}
        onDelete={supprimerTache}
      />
    </>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- "calendar/index"`
Expected: PASS (3 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/index.tsx web/src/features/calendar/index.test.tsx
git commit -m "feat(calendrier): integration des vues (mois, agenda, membre, statut)"
```

---

### Task 6 : Vérification finale et revue

**Files:** aucun (vérification)

- [ ] **Step 1 : Typecheck**

Run: `npm run typecheck --workspace web`
Expected: PASS.

- [ ] **Step 2 : Lint**

Run: `npm run lint`
Expected: 0 erreur.

- [ ] **Step 3 : Tests complets**

Run: `npm run test --workspace web`
Expected: PASS.

- [ ] **Step 4 : Contrôle visuel manuel**

Run: `npm run dev --workspace web`, se connecter, aller sur Calendrier, activer la démo.
Vérifier le sélecteur de vues :

- Mois : inchangé.
- Agenda : liste chronologique des événements et tâches datés ; clic ouvre la fiche.
- Par membre : 4 sections, tâches avec statut et priorité.
- Par statut : 3 colonnes, glisser une tâche change son statut (persistant), clic ouvre la fiche sans déclencher après un drag.

- [ ] **Step 5 : Mettre à jour le statut du spec**

Dans `docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md`, ligne 4, remplacer le statut par :
`- Statut : coquille + CRM complet + module Calendrier complet (mois, agenda, par membre, par statut) implémentés`

```bash
git add docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md
git commit -m "docs: statut spec, module calendrier complet"
```

---

## Self-review (couverture)

- Sélecteur de vues : Task 1.
- Agenda chronologique (événements + tâches datées, état vide) : Task 2.
- Tâches par membre : Task 3.
- Tâches par statut (kanban drag-and-drop, clic/drag distingués) : Task 4.
- Intégration + changement de statut au drop : Task 5.

Module Calendrier complet après ce plan.
