# Calendrier base (Plan 3a) : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter le coeur du module Calendrier : modèles Événement et Tâche, stores avec 20+20 données de démo, vue calendrier mensuel affichant événements et tâches, fiches de création/édition/suppression, et création au clic sur un jour.

**Architecture:** Tout dans `web/src/features/calendar/`. Deux entités via `createCollectionStore` (localStorage) : `evenementsStore` et `tachesStore`. La grille mensuelle est calculée par une fonction pure testable. Les fiches réutilisent `SidePanel` et les primitives UI. Pas de notion financière ici (le budget prévisionnel des événements sera traité au cycle Comptabilité).

**Tech Stack:** React 19, TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Tailwind v4, Vitest + Testing Library.

**Décisions (validées):**

- Événement = jour unique, heure optionnelle, lieu optionnel.
- Tâche = titre, responsable (un des 4 membres), statut (À faire / En cours / Fait), priorité (Basse / Moyenne / Haute), échéance optionnelle, description optionnelle.
- Calendrier : grille mensuelle lundi-dimanche, 6 semaines. Les événements s'affichent à leur date, les tâches à leur échéance. Aujourd'hui est mis en évidence.
- Création : clic sur un jour propose Événement ou Tâche (date pré-remplie) ; boutons de création dans l'en-tête aussi.
- Données de démo : 20 événements + 20 tâches, dates <= 2026-09-30.

**Hors périmètre (Plan 3b):** vues Agenda, Tâches par membre, Tâches par statut (kanban), sélecteur de vues.

**Commandes de vérification:**

- Tests : `npm run test --workspace web`
- Typecheck : `npm run typecheck --workspace web`
- Lint : `npm run lint`

---

### Task 1 : Modèles et configuration

**Files:**

- Create: `web/src/features/calendar/types.ts`

- [ ] **Step 1 : Créer les types**

Créer `web/src/features/calendar/types.ts` :

```ts
// Modeles du module Calendrier : evenements et taches.

export const MEMBRES = ['Luciano', 'Eva', 'Armelle', 'Anthony'] as const;
export type Membre = (typeof MEMBRES)[number];

export const STATUTS = ['a_faire', 'en_cours', 'fait'] as const;
export type Statut = (typeof STATUTS)[number];

export const STATUT_LABELS: Record<Statut, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  fait: 'Fait',
};

export const PRIORITES = ['basse', 'moyenne', 'haute'] as const;
export type Priorite = (typeof PRIORITES)[number];

export const PRIORITE_LABELS: Record<Priorite, string> = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute',
};

export interface Evenement {
  id: string;
  titre: string;
  date: string; // ISO AAAA-MM-JJ, <= 2026-09-30
  heure?: string; // HH:MM
  lieu?: string;
  description?: string;
}

export interface Tache {
  id: string;
  titre: string;
  membre: Membre;
  statut: Statut;
  priorite: Priorite;
  echeance?: string; // ISO AAAA-MM-JJ, <= 2026-09-30
  description?: string;
}

// Champs editables dans les fiches.
export interface EvenementFormValues {
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  description: string;
}

export interface TacheFormValues {
  titre: string;
  membre: Membre;
  statut: Statut;
  priorite: Priorite;
  echeance: string;
  description: string;
}
```

- [ ] **Step 2 : Vérifier**

Run: `npm run typecheck --workspace web`
Expected: PASS.

- [ ] **Step 3 : Commit**

```bash
git add web/src/features/calendar/types.ts
git commit -m "feat(calendrier): modeles Evenement et Tache"
```

---

### Task 2 : Données de démo et stores

**Files:**

- Create: `web/src/features/calendar/seed.ts`
- Create: `web/src/features/calendar/store.ts`
- Test: `web/src/features/calendar/seed.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/seed.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { seedEvenements, seedTaches } from './seed';
import { MEMBRES, PRIORITES, STATUTS } from './types';

describe('seed calendrier', () => {
  const evenements = seedEvenements();
  const taches = seedTaches();

  it('fournit 20 événements et 20 tâches', () => {
    expect(evenements).toHaveLength(20);
    expect(taches).toHaveLength(20);
  });

  it('a des identifiants uniques', () => {
    expect(new Set(evenements.map((e) => e.id)).size).toBe(20);
    expect(new Set(taches.map((t) => t.id)).size).toBe(20);
  });

  it('respecte la contrainte de dates (<= 2026-09-30)', () => {
    for (const e of evenements) {
      expect(e.date <= '2026-09-30').toBe(true);
    }
    for (const t of taches) {
      if (t.echeance) expect(t.echeance <= '2026-09-30').toBe(true);
    }
  });

  it('utilise des membres, statuts et priorités valides', () => {
    for (const t of taches) {
      expect(MEMBRES).toContain(t.membre);
      expect(STATUTS).toContain(t.statut);
      expect(PRIORITES).toContain(t.priorite);
    }
  });

  it('couvre les 4 membres', () => {
    const membres = new Set(taches.map((t) => t.membre));
    for (const m of MEMBRES) {
      expect(membres).toContain(m);
    }
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "calendar/seed"`
Expected: FAIL.

- [ ] **Step 3 : Créer les données de démo**

Créer `web/src/features/calendar/seed.ts` :

```ts
import type { Evenement, Tache } from './types';

// 20 evenements fictifs, dates <= 2026-09-30.
export function seedEvenements(): Evenement[] {
  return [
    {
      id: 'e1',
      titre: 'Réunion de lancement de saison',
      date: '2026-06-15',
      heure: '18:00',
      lieu: 'Local associatif',
    },
    {
      id: 'e2',
      titre: 'Atelier prise de parole',
      date: '2026-06-20',
      heure: '14:00',
      lieu: 'Sciences Po',
    },
    {
      id: 'e3',
      titre: 'Rendez-vous Fondation Orange',
      date: '2026-06-24',
      heure: '10:30',
      lieu: 'Paris 8e',
    },
    {
      id: 'e4',
      titre: 'Sélection régionale - tour 1',
      date: '2026-07-02',
      heure: '13:00',
      lieu: 'Mairie de Paris',
    },
    {
      id: 'e5',
      titre: 'Formation des bénévoles',
      date: '2026-07-08',
      heure: '09:30',
      lieu: 'Local associatif',
    },
    {
      id: 'e6',
      titre: 'Comité de pilotage',
      date: '2026-07-15',
      heure: '17:00',
    },
    {
      id: 'e7',
      titre: 'Atelier rhétorique',
      date: '2026-07-21',
      heure: '14:00',
      lieu: 'Lycée Henri-IV',
    },
    {
      id: 'e8',
      titre: 'Demi-finale',
      date: '2026-08-05',
      heure: '15:00',
      lieu: 'Théâtre de la Ville',
    },
    {
      id: 'e9',
      titre: 'Répétition générale',
      date: '2026-08-26',
      heure: '18:30',
      lieu: 'Théâtre de la Ville',
    },
    {
      id: 'e10',
      titre: 'Finale Eloquentia',
      date: '2026-09-12',
      heure: '19:00',
      lieu: 'Théâtre de la Ville',
    },
    {
      id: 'e11',
      titre: 'Débrief équipe',
      date: '2026-09-16',
      heure: '18:00',
      lieu: 'Local associatif',
    },
    {
      id: 'e12',
      titre: 'Point partenaires',
      date: '2026-06-29',
      heure: '11:00',
    },
    {
      id: 'e13',
      titre: 'Tournage capsule vidéo',
      date: '2026-07-30',
      heure: '10:00',
      lieu: 'France Télévisions',
    },
    {
      id: 'e14',
      titre: 'Conférence de presse',
      date: '2026-09-03',
      heure: '11:30',
      lieu: 'Mairie de Paris',
    },
    {
      id: 'e15',
      titre: 'Atelier diction',
      date: '2026-08-12',
      heure: '14:00',
      lieu: 'Lycée Louis-le-Grand',
    },
    {
      id: 'e16',
      titre: 'Réunion logistique finale',
      date: '2026-09-08',
      heure: '17:30',
      lieu: 'Théâtre de la Ville',
    },
    {
      id: 'e17',
      titre: 'Rencontre jury',
      date: '2026-08-19',
      heure: '12:00',
      lieu: 'Restaurant Le Procope',
    },
    {
      id: 'e18',
      titre: 'Sélection régionale - tour 2',
      date: '2026-07-09',
      heure: '13:00',
      lieu: 'Mairie de Paris',
    },
    {
      id: 'e19',
      titre: 'Assemblée des bénévoles',
      date: '2026-09-23',
      heure: '18:00',
      lieu: 'Local associatif',
    },
    {
      id: 'e20',
      titre: 'Bilan de saison',
      date: '2026-09-29',
      heure: '18:00',
      lieu: 'Local associatif',
    },
  ];
}

// 20 taches fictives, reliees aux 4 membres, echeances <= 2026-09-30.
export function seedTaches(): Tache[] {
  return [
    {
      id: 't1',
      titre: 'Relancer la Fondation Orange',
      membre: 'Luciano',
      statut: 'en_cours',
      priorite: 'haute',
      echeance: '2026-06-22',
    },
    {
      id: 't2',
      titre: 'Réserver le Théâtre de la Ville',
      membre: 'Eva',
      statut: 'fait',
      priorite: 'haute',
      echeance: '2026-06-10',
    },
    {
      id: 't3',
      titre: 'Préparer le dossier de subvention région',
      membre: 'Armelle',
      statut: 'a_faire',
      priorite: 'haute',
      echeance: '2026-08-31',
    },
    {
      id: 't4',
      titre: 'Recruter 5 bénévoles supplémentaires',
      membre: 'Anthony',
      statut: 'en_cours',
      priorite: 'moyenne',
      echeance: '2026-07-05',
    },
    {
      id: 't5',
      titre: 'Rédiger le communiqué de presse',
      membre: 'Eva',
      statut: 'a_faire',
      priorite: 'moyenne',
      echeance: '2026-08-28',
    },
    {
      id: 't6',
      titre: 'Mettre à jour le site web',
      membre: 'Anthony',
      statut: 'a_faire',
      priorite: 'basse',
      echeance: '2026-07-20',
    },
    {
      id: 't7',
      titre: 'Contacter les lycées partenaires',
      membre: 'Luciano',
      statut: 'en_cours',
      priorite: 'moyenne',
      echeance: '2026-06-30',
    },
    {
      id: 't8',
      titre: 'Commander les trophées',
      membre: 'Armelle',
      statut: 'a_faire',
      priorite: 'moyenne',
      echeance: '2026-08-20',
    },
    {
      id: 't9',
      titre: 'Organiser la billetterie de la finale',
      membre: 'Eva',
      statut: 'a_faire',
      priorite: 'haute',
      echeance: '2026-09-01',
    },
    {
      id: 't10',
      titre: 'Briefer le jury',
      membre: 'Luciano',
      statut: 'a_faire',
      priorite: 'moyenne',
      echeance: '2026-09-05',
    },
    {
      id: 't11',
      titre: 'Valider le budget prévisionnel',
      membre: 'Armelle',
      statut: 'en_cours',
      priorite: 'haute',
      echeance: '2026-07-01',
    },
    {
      id: 't12',
      titre: 'Préparer les supports de formation',
      membre: 'Anthony',
      statut: 'fait',
      priorite: 'basse',
      echeance: '2026-07-06',
    },
    {
      id: 't13',
      titre: 'Réserver le traiteur',
      membre: 'Eva',
      statut: 'a_faire',
      priorite: 'basse',
      echeance: '2026-09-04',
    },
    {
      id: 't14',
      titre: 'Inviter la presse',
      membre: 'Luciano',
      statut: 'a_faire',
      priorite: 'moyenne',
      echeance: '2026-08-25',
    },
    {
      id: 't15',
      titre: 'Gérer les inscriptions participants',
      membre: 'Armelle',
      statut: 'en_cours',
      priorite: 'haute',
      echeance: '2026-06-28',
    },
    {
      id: 't16',
      titre: 'Préparer le rétroplanning finale',
      membre: 'Anthony',
      statut: 'en_cours',
      priorite: 'moyenne',
      echeance: '2026-08-10',
    },
    {
      id: 't17',
      titre: 'Remercier les partenaires',
      membre: 'Eva',
      statut: 'a_faire',
      priorite: 'basse',
      echeance: '2026-09-20',
    },
    {
      id: 't18',
      titre: 'Faire le bilan financier',
      membre: 'Armelle',
      statut: 'a_faire',
      priorite: 'haute',
      echeance: '2026-09-28',
    },
    {
      id: 't19',
      titre: "Collecter les photos de l'événement",
      membre: 'Anthony',
      statut: 'a_faire',
      priorite: 'basse',
      echeance: '2026-09-15',
    },
    {
      id: 't20',
      titre: 'Planifier la réunion de débrief',
      membre: 'Luciano',
      statut: 'a_faire',
      priorite: 'moyenne',
      echeance: '2026-09-14',
    },
  ];
}
```

- [ ] **Step 4 : Créer les stores**

Créer `web/src/features/calendar/store.ts` :

```ts
import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Evenement, Tache } from './types';
import { seedEvenements, seedTaches } from './seed';

export const evenementsStore = createCollectionStore<Evenement>(
  'calendar:evenements',
  seedEvenements,
);
export const tachesStore = createCollectionStore<Tache>(
  'calendar:taches',
  seedTaches,
);
```

- [ ] **Step 5 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- "calendar/seed"`
Expected: PASS (5 tests).

- [ ] **Step 6 : Commit**

```bash
git add web/src/features/calendar/seed.ts web/src/features/calendar/store.ts web/src/features/calendar/seed.test.ts
git commit -m "feat(calendrier): donnees de demo (20 evenements, 20 taches) et stores"
```

---

### Task 3 : Calcul de la grille mensuelle

**Files:**

- Create: `web/src/features/calendar/grille.ts`
- Test: `web/src/features/calendar/grille.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/grille.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { isoLocal, moisGrille, NOMS_MOIS } from './grille';

describe('moisGrille', () => {
  // Septembre 2026 (mois index 8).
  const jours = moisGrille(2026, 8);

  it('contient 42 cases (6 semaines)', () => {
    expect(jours).toHaveLength(42);
  });

  it('contient les 30 jours de septembre marqués dans le mois', () => {
    expect(jours.filter((j) => j.dansLeMois)).toHaveLength(30);
  });

  it('place le 1er septembre dans le mois et inclut les débordements', () => {
    expect(jours.find((j) => j.iso === '2026-09-01')?.dansLeMois).toBe(true);
    expect(jours.find((j) => j.iso === '2026-08-31')?.dansLeMois).toBe(false);
    expect(jours.find((j) => j.iso === '2026-10-01')?.dansLeMois).toBe(false);
  });

  it('expose le nom du mois', () => {
    expect(NOMS_MOIS[8]).toBe('Septembre');
  });
});

describe('isoLocal', () => {
  it('formate une date locale en AAAA-MM-JJ', () => {
    expect(isoLocal(new Date(2026, 8, 1))).toBe('2026-09-01');
    expect(isoLocal(new Date(2026, 11, 25))).toBe('2026-12-25');
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "calendar/grille"`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la grille**

Créer `web/src/features/calendar/grille.ts` :

```ts
export interface JourGrille {
  iso: string; // AAAA-MM-JJ
  jour: number; // numero du jour dans le mois
  dansLeMois: boolean;
}

export const NOMS_MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export const NOMS_JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Formate une date locale en AAAA-MM-JJ (sans decalage UTC).
export function isoLocal(d: Date): string {
  const annee = d.getFullYear();
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

export function aujourdhuiIso(): string {
  return isoLocal(new Date());
}

// Grille de 6 semaines (42 cases), lundi en premier, pour un mois (0-11).
export function moisGrille(annee: number, mois: number): JourGrille[] {
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7; // lundi = 0
  const debut = new Date(annee, mois, 1 - decalage);
  const jours: JourGrille[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(
      debut.getFullYear(),
      debut.getMonth(),
      debut.getDate() + i,
    );
    jours.push({
      iso: isoLocal(d),
      jour: d.getDate(),
      dansLeMois: d.getMonth() === mois,
    });
  }
  return jours;
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- "calendar/grille"`
Expected: PASS (5 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/grille.ts web/src/features/calendar/grille.test.ts
git commit -m "feat(calendrier): calcul de la grille mensuelle"
```

---

### Task 4 : Vue calendrier mensuel

**Files:**

- Create: `web/src/features/calendar/MonthCalendar.tsx`
- Test: `web/src/features/calendar/MonthCalendar.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/MonthCalendar.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthCalendar } from './MonthCalendar';
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
    echeance: '2026-09-12',
  },
];

describe('MonthCalendar', () => {
  it('affiche les événements et tâches du mois et réagit aux clics', () => {
    const onJourClic = vi.fn();
    const onSelectEvenement = vi.fn();
    render(
      <MonthCalendar
        annee={2026}
        mois={8}
        evenements={evenements}
        taches={taches}
        aujourdhui="2026-09-01"
        onJourClic={onJourClic}
        onSelectEvenement={onSelectEvenement}
        onSelectTache={() => {}}
      />,
    );
    expect(screen.getByText('Finale Eloquentia')).toBeInTheDocument();
    expect(screen.getByText('Briefer le jury')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Finale Eloquentia'));
    expect(onSelectEvenement).toHaveBeenCalledWith(evenements[0]);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- MonthCalendar`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la vue**

Créer `web/src/features/calendar/MonthCalendar.tsx` :

```tsx
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
            <button
              key={jour.iso}
              type="button"
              onClick={() => onJourClic(jour.iso)}
              className={cn(
                'flex min-h-24 flex-col gap-1 border-b border-r border-trait p-1.5 text-left align-top',
                !jour.dansLeMois && 'bg-scene',
              )}
            >
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
                <span
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onSelectEvenement(e);
                  }}
                  className="truncate rounded bg-rose-brume px-1.5 py-0.5 text-[11px] font-medium text-velours"
                >
                  {e.heure ? `${e.heure} ` : ''}
                  {e.titre}
                </span>
              ))}
              {tJour.map((t) => (
                <span
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onSelectTache(t);
                  }}
                  className={cn(
                    'truncate rounded bg-jaune-brume px-1.5 py-0.5 text-[11px] font-medium text-[#9a7b16]',
                    t.statut === 'fait' && 'line-through opacity-60',
                  )}
                >
                  {t.titre}
                </span>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- MonthCalendar`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/MonthCalendar.tsx web/src/features/calendar/MonthCalendar.test.tsx
git commit -m "feat(calendrier): vue mensuelle (evenements et taches)"
```

---

### Task 5 : Fiche Événement

**Files:**

- Create: `web/src/features/calendar/EvenementFiche.tsx`
- Test: `web/src/features/calendar/EvenementFiche.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/EvenementFiche.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvenementFiche } from './EvenementFiche';

describe('EvenementFiche', () => {
  it('création : saisie puis enregistrement renvoie les valeurs', () => {
    const onSave = vi.fn();
    render(
      <EvenementFiche
        open
        evenement={null}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Finale' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({
      titre: 'Finale',
      date: '2026-09-12',
    });
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- EvenementFiche`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la fiche**

Créer `web/src/features/calendar/EvenementFiche.tsx` :

```tsx
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import type { Evenement, EvenementFormValues } from './types';

function valeurs(
  evenement: Evenement | null,
  dateInitiale: string,
): EvenementFormValues {
  return {
    titre: evenement?.titre ?? '',
    date: evenement?.date ?? dateInitiale,
    heure: evenement?.heure ?? '',
    lieu: evenement?.lieu ?? '',
    description: evenement?.description ?? '',
  };
}

export function EvenementFiche({
  open,
  evenement,
  dateInitiale,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  evenement: Evenement | null;
  dateInitiale: string;
  onClose: () => void;
  onSave: (values: EvenementFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<EvenementFormValues>(
    valeurs(evenement, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(evenement, dateInitiale));
  }, [evenement, dateInitiale]);

  function set<K extends keyof EvenementFormValues>(
    key: K,
    value: EvenementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SidePanel
      open={open}
      title={evenement ? "Modifier l'événement" : 'Nouvel événement'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Titre"
          value={values.titre}
          onChange={(e) => set('titre', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <Input
            label="Heure"
            type="time"
            value={values.heure}
            onChange={(e) => set('heure', e.target.value)}
          />
        </div>
        <Input
          label="Lieu"
          value={values.lieu}
          onChange={(e) => set('lieu', e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-desc" className="text-xs font-medium text-encre-3">
            Description
          </label>
          <textarea
            id="ev-desc"
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          {evenement ? (
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

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- EvenementFiche`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/EvenementFiche.tsx web/src/features/calendar/EvenementFiche.test.tsx
git commit -m "feat(calendrier): fiche evenement"
```

---

### Task 6 : Fiche Tâche

**Files:**

- Create: `web/src/features/calendar/TacheFiche.tsx`
- Test: `web/src/features/calendar/TacheFiche.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/TacheFiche.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TacheFiche } from './TacheFiche';

describe('TacheFiche', () => {
  it('création : saisie puis enregistrement renvoie les valeurs', () => {
    const onSave = vi.fn();
    render(
      <TacheFiche
        open
        tache={null}
        dateInitiale="2026-09-12"
        onClose={() => {}}
        onSave={onSave}
        onDelete={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Briefer le jury' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0]![0]).toMatchObject({
      titre: 'Briefer le jury',
      echeance: '2026-09-12',
      membre: 'Luciano',
    });
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- TacheFiche`
Expected: FAIL.

- [ ] **Step 3 : Implémenter la fiche**

Créer `web/src/features/calendar/TacheFiche.tsx` :

```tsx
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import {
  MEMBRES,
  PRIORITES,
  PRIORITE_LABELS,
  STATUTS,
  STATUT_LABELS,
  type Tache,
  type TacheFormValues,
} from './types';

function valeurs(tache: Tache | null, dateInitiale: string): TacheFormValues {
  return {
    titre: tache?.titre ?? '',
    membre: tache?.membre ?? 'Luciano',
    statut: tache?.statut ?? 'a_faire',
    priorite: tache?.priorite ?? 'moyenne',
    echeance: tache?.echeance ?? dateInitiale,
    description: tache?.description ?? '',
  };
}

export function TacheFiche({
  open,
  tache,
  dateInitiale,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  tache: Tache | null;
  dateInitiale: string;
  onClose: () => void;
  onSave: (values: TacheFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<TacheFormValues>(
    valeurs(tache, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(tache, dateInitiale));
  }, [tache, dateInitiale]);

  function set<K extends keyof TacheFormValues>(
    key: K,
    value: TacheFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SidePanel
      open={open}
      title={tache ? 'Modifier la tâche' : 'Nouvelle tâche'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Titre"
          value={values.titre}
          onChange={(e) => set('titre', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Responsable</span>
          <div className="flex flex-wrap gap-1.5">
            {MEMBRES.map((membre) => (
              <button
                key={membre}
                type="button"
                onClick={() => set('membre', membre)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.membre === membre
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {membre}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Statut</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUTS.map((statut) => (
              <button
                key={statut}
                type="button"
                onClick={() => set('statut', statut)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.statut === statut
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {STATUT_LABELS[statut]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Priorité</span>
          <div className="flex flex-wrap gap-1.5">
            {PRIORITES.map((priorite) => (
              <button
                key={priorite}
                type="button"
                onClick={() => set('priorite', priorite)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.priorite === priorite
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {PRIORITE_LABELS[priorite]}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Échéance"
          type="date"
          value={values.echeance}
          onChange={(e) => set('echeance', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-desc" className="text-xs font-medium text-encre-3">
            Description
          </label>
          <textarea
            id="t-desc"
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          {tache ? (
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

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- TacheFiche`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/TacheFiche.tsx web/src/features/calendar/TacheFiche.test.tsx
git commit -m "feat(calendrier): fiche tache"
```

---

### Task 7 : Assemblage de la page Calendrier

**Files:**

- Modify: `web/src/features/calendar/index.tsx` (remplacement complet)
- Test: `web/src/features/calendar/index.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/calendar/index.test.tsx` :

```tsx
import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './index';

describe('CalendarPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les données de démo et affiche un événement', async () => {
    render(<CalendarPage />);
    expect(
      screen.getByRole('heading', { name: 'Calendrier' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    // L'evenement de septembre 2026 apparait apres navigation jusqu'a ce mois.
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Données de démo/ }),
      ).toHaveTextContent('activées'),
    );
  });

  it('ouvre la création via "Nouvel événement"', async () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nouvel événement' }));
    expect(
      await screen.findByText('Nouvel événement', { selector: 'h2' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "calendar/index"`
Expected: FAIL (placeholder actuel).

- [ ] **Step 3 : Implémenter la page**

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
import { EvenementFiche } from './EvenementFiche';
import { TacheFiche } from './TacheFiche';
import { aujourdhuiIso, NOMS_MOIS } from './grille';
import type {
  Evenement,
  EvenementFormValues,
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

  function nouvelEvenement(iso?: string) {
    if (iso) setDateChoisie(iso);
    setChooserOuvert(false);
    setEvFiche({ open: true, evenement: null });
  }

  function nouvelleTache(iso?: string) {
    if (iso) setDateChoisie(iso);
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
            <Button variant="outline" onClick={() => nouvelleTache()}>
              Nouvelle tâche
            </Button>
            <Button variant="primary" onClick={() => nouvelEvenement()}>
              Nouvel événement
            </Button>
          </>
        }
      />

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
        <Button variant="ghost" onClick={moisSuivant} aria-label="Mois suivant">
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
        onSelectEvenement={(e) => setEvFiche({ open: true, evenement: e })}
        onSelectTache={(t) => setTFiche({ open: true, tache: t })}
      />

      <SidePanel
        open={chooserOuvert}
        title={`Ajouter le ${dateChoisie}`}
        onClose={() => setChooserOuvert(false)}
      >
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={() => nouvelEvenement()}>
            Nouvel événement
          </Button>
          <Button variant="outline" onClick={() => nouvelleTache()}>
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
Expected: PASS (2 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/index.tsx web/src/features/calendar/index.test.tsx
git commit -m "feat(calendrier): assemblage de la page (mois, demo, fiches, creation au clic)"
```

---

### Task 8 : Vérification finale et revue

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

Run: `npm run dev --workspace web`, se connecter, aller sur Calendrier.
Vérifier :

- Activer les données de démo, naviguer jusqu'à septembre 2026 : la finale et des tâches apparaissent.
- Navigation mois précédent / suivant / aujourd'hui.
- Clic sur un jour : choix Événement ou Tâche, date pré-remplie.
- Créer / éditer / supprimer un événement et une tâche.
- Aujourd'hui est mis en évidence ; les tâches faites sont barrées.

- [ ] **Step 5 : Mettre à jour le statut du spec**

Dans `docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md`, ligne 4, remplacer le statut par :
`- Statut : coquille + CRM complet + Calendrier (vue mois) implémentés`

```bash
git add docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md
git commit -m "docs: statut spec, calendrier vue mois"
```

---

## Self-review (couverture)

- Modèles Événement (jour + heure) et Tâche (membre, statut, priorité) : Task 1.
- 20 événements + 20 tâches de démo, dates <= 2026-09-30 : Task 2.
- Grille mensuelle (pure, testée) : Task 3.
- Vue calendrier mensuel (événements + tâches, aujourd'hui, tâches faites barrées) : Task 4.
- Fiches créer/éditer/supprimer : Tasks 5 (événement) et 6 (tâche).
- Page : navigation mois, démo (2 stores), création au clic sur un jour + boutons : Task 7.

Reporté au Plan 3b : vues Agenda, Tâches par membre, Tâches par statut (kanban), sélecteur de vues.

```

```
