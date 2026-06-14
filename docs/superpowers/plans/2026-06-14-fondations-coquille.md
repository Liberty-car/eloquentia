# Fondations + Coquille : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place le design system, la couche de données factices et la coquille applicative (login factice, layout, navigation des 5 onglets) du prototype Eloquetia.

**Architecture:** Prototype 100% front dans `web/`. Les données passent par une fabrique de store adossée à localStorage avec des signatures asynchrones prêtes à devenir des appels API. Authentification factice en mémoire (jamais persistée). Tailwind v4 avec tokens `@theme` ancrés dans l'univers de l'éloquence.

**Tech Stack:** React 19, React Router v7 (mode librairie), Tailwind v4, TypeScript strict, Vitest + Testing Library, Plus Jakarta Sans (`@fontsource`), `lucide-react`.

**Périmètre:** Ce plan couvre les sections 4 (design), 5 (architecture) et 6 (coquille) du spec `docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md`. Le module CRM (section 7) fait l'objet d'un plan séparé.

**Commandes de vérification (scope web pour éviter la génération Prisma du serveur):**

- Tests : `npm run test --workspace web`
- Typecheck : `npm run typecheck --workspace web`
- Lint : `npm run lint`

---

## Phase 0 : Setup

### Task 1 : Ajouter les dépendances front

**Files:**

- Modify: `web/package.json`

- [ ] **Step 1 : Ajouter les dépendances runtime**

Ajouter dans `web/package.json`, section `dependencies` (ordre alphabétique) :

```json
"@fontsource/plus-jakarta-sans": "^5.1.0",
"lucide-react": "^0.460.0",
```

Le bloc `dependencies` devient :

```json
"dependencies": {
  "@fontsource/plus-jakarta-sans": "^5.1.0",
  "lucide-react": "^0.460.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router": "^7.1.1"
}
```

- [ ] **Step 2 : Installer**

Run: `npm install`
Expected: installation sans erreur, `node_modules/@fontsource/plus-jakarta-sans` et `node_modules/lucide-react` présents.

- [ ] **Step 3 : Commit**

```bash
git add web/package.json package-lock.json
git commit -m "chore(web): ajout des dependances design (police, icones)"
```

---

### Task 2 : Tokens du design system et police

**Files:**

- Modify: `web/src/index.css`
- Modify: `web/src/main.tsx:5` (imports de police)

- [ ] **Step 1 : Définir les tokens dans `index.css`**

Remplacer tout le contenu de `web/src/index.css` par :

```css
/* Tailwind v4 avec tokens ancres dans l'univers de l'eloquence (cf. spec). */
@import 'tailwindcss';

@theme {
  /* Surfaces et texte */
  --color-papier: #ffffff;
  --color-scene: #fbfaf8;
  --color-encre: #1f2937;
  --color-encre-2: #6b7280;
  --color-encre-3: #9ca3af;
  --color-encre-4: #c4c8cf;

  /* Accents */
  --color-gel-rose: #db6a8f;
  --color-velours: #ca3c66;
  --color-rose-voile: #e8aabe;
  --color-projecteur: #f5df4d;
  --color-projecteur-doux: #ffd777;

  /* Brumes (fonds pales) */
  --color-rose-brume: #fbe6ec;
  --color-jaune-brume: #fff6d9;

  /* Bordures */
  --color-trait: rgba(31, 41, 55, 0.08);
  --color-trait-fort: rgba(31, 41, 55, 0.14);
  --color-focus: #db6a8f;

  /* Semantiques */
  --color-succes: #2f9e6e;
  --color-alerte: #e0a23b;
  --color-erreur: #db5566;

  /* Typographie */
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    background-color: var(--color-scene);
    color: var(--color-encre);
    font-family: var(--font-sans);
  }
}
```

- [ ] **Step 2 : Importer la police dans `main.tsx`**

Dans `web/src/main.tsx`, ajouter les imports de police juste avant `import './index.css';` :

```tsx
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';
```

- [ ] **Step 3 : Vérifier que le build CSS passe**

Run: `npm run typecheck --workspace web`
Expected: PASS (aucune erreur TypeScript ; les imports CSS sont ignorés par tsc).

- [ ] **Step 4 : Commit**

```bash
git add web/src/index.css web/src/main.tsx
git commit -m "feat(web): tokens du design system et police Plus Jakarta Sans"
```

---

## Phase 1 : Couche de données

### Task 3 : Fabrique de store de collection

**Files:**

- Create: `web/src/lib/store/createCollectionStore.ts`
- Test: `web/src/lib/store/createCollectionStore.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/lib/store/createCollectionStore.test.ts` :

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { createCollectionStore } from './createCollectionStore';

interface Widget {
  id: string;
  name: string;
}

const seeder = (): Widget[] => [
  { id: 'w1', name: 'Alpha' },
  { id: 'w2', name: 'Beta' },
];

describe('createCollectionStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('démarre vide et non seedé', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    expect(await store.list()).toEqual([]);
    expect(await store.isSeeded()).toBe(false);
  });

  it('crée et relit un élément avec un id généré', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    expect(created.id).toBeTruthy();
    expect(await store.list()).toHaveLength(1);
    expect(await store.get(created.id)).toEqual(created);
  });

  it('met à jour un élément', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    const updated = await store.update(created.id, { name: 'Delta' });
    expect(updated.name).toBe('Delta');
    expect((await store.get(created.id))?.name).toBe('Delta');
  });

  it('supprime un élément', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    await store.remove(created.id);
    expect(await store.list()).toEqual([]);
  });

  it('seed injecte les données de démo et marque comme seedé', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    await store.seed();
    expect(await store.list()).toHaveLength(2);
    expect(await store.isSeeded()).toBe(true);
  });

  it('clear vide la collection et le marqueur', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    await store.seed();
    await store.clear();
    expect(await store.list()).toEqual([]);
    expect(await store.isSeeded()).toBe(false);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- createCollectionStore`
Expected: FAIL (`createCollectionStore` introuvable).

- [ ] **Step 3 : Implémenter la fabrique**

Créer `web/src/lib/store/createCollectionStore.ts` :

```ts
// Fabrique de store de collection adossee a localStorage.
// Les methodes sont asynchrones pour rester compatibles avec un futur apiFetch.

export interface Identifiable {
  id: string;
}

export interface CollectionStore<T extends Identifiable> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, 'id'>>): Promise<T>;
  remove(id: string): Promise<void>;
  seed(): Promise<void>;
  clear(): Promise<void>;
  isSeeded(): Promise<boolean>;
}

function readRaw<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeRaw<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export function createCollectionStore<T extends Identifiable>(
  namespace: string,
  seeder: () => T[],
): CollectionStore<T> {
  const key = `eloquetia:${namespace}`;
  const seededKey = `${key}:seeded`;

  return {
    async list() {
      return readRaw<T>(key);
    },
    async get(id) {
      return readRaw<T>(key).find((item) => item.id === id) ?? null;
    },
    async create(data) {
      const items = readRaw<T>(key);
      const created = { ...data, id: generateId() } as unknown as T;
      writeRaw(key, [...items, created]);
      return created;
    },
    async update(id, patch) {
      const items = readRaw<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Élément introuvable : ${id}`);
      }
      const updated = { ...items[index], ...patch };
      items[index] = updated;
      writeRaw(key, items);
      return updated;
    },
    async remove(id) {
      const items = readRaw<T>(key).filter((item) => item.id !== id);
      writeRaw(key, items);
    },
    async seed() {
      writeRaw(key, seeder());
      localStorage.setItem(seededKey, 'true');
    },
    async clear() {
      localStorage.removeItem(key);
      localStorage.removeItem(seededKey);
    },
    async isSeeded() {
      return localStorage.getItem(seededKey) === 'true';
    },
  };
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- createCollectionStore`
Expected: PASS (6 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/lib/store/
git commit -m "feat(web): fabrique de store de collection (localStorage, API-ready)"
```

---

## Phase 2 : Primitives UI

### Task 4 : Helper `cn` et composant Button

**Files:**

- Create: `web/src/lib/cn.ts`
- Create: `web/src/components/ui/Button.tsx`
- Test: `web/src/components/ui/Button.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/ui/Button.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('affiche son libellé', () => {
    render(<Button>Enregistrer</Button>);
    expect(
      screen.getByRole('button', { name: 'Enregistrer' }),
    ).toBeInTheDocument();
  });

  it('applique la variante primaire', () => {
    render(<Button variant="primary">Valider</Button>);
    expect(screen.getByRole('button', { name: 'Valider' }).className).toContain(
      'bg-gel-rose',
    );
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- Button`
Expected: FAIL (`Button` introuvable).

- [ ] **Step 3 : Créer le helper `cn`**

Créer `web/src/lib/cn.ts` :

```ts
// Concatene des classes en ignorant les valeurs falsy.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
```

- [ ] **Step 4 : Implémenter Button**

Créer `web/src/components/ui/Button.tsx` :

```tsx
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[10px] text-sm font-semibold transition-colors duration-200 active:duration-50 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus';

const variants: Record<Variant, string> = {
  primary: 'bg-gel-rose text-white hover:bg-velours',
  outline: 'bg-papier text-encre border border-trait-fort hover:bg-scene',
  ghost: 'text-encre hover:bg-scene',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'outline',
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
```

- [ ] **Step 5 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- Button`
Expected: PASS (2 tests).

- [ ] **Step 6 : Commit**

```bash
git add web/src/lib/cn.ts web/src/components/ui/Button.tsx web/src/components/ui/Button.test.tsx
git commit -m "feat(web): helper cn et composant Button"
```

---

### Task 5 : Composants Badge et Avatar

**Files:**

- Create: `web/src/components/ui/Badge.tsx`
- Create: `web/src/components/ui/Avatar.tsx`
- Test: `web/src/components/ui/Badge.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/ui/Badge.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

describe('Badge', () => {
  it('affiche son contenu', () => {
    render(<Badge tone="rose">Partenaire</Badge>);
    expect(screen.getByText('Partenaire')).toBeInTheDocument();
  });
});

describe('Avatar', () => {
  it('affiche les initiales', () => {
    render(<Avatar initials="LM" />);
    expect(screen.getByText('LM')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- Badge`
Expected: FAIL (`Badge` introuvable).

- [ ] **Step 3 : Implémenter Badge**

Créer `web/src/components/ui/Badge.tsx` :

```tsx
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'rose' | 'jaune' | 'neutre';

const tones: Record<Tone, { wrap: string; dot: string }> = {
  rose: { wrap: 'bg-rose-brume text-velours', dot: 'bg-gel-rose' },
  jaune: { wrap: 'bg-jaune-brume text-[#9a7b16]', dot: 'bg-projecteur' },
  neutre: { wrap: 'bg-scene text-encre-2', dot: 'bg-encre-3' },
};

export function Badge({
  tone = 'neutre',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold',
        t.wrap,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', t.dot)} />
      {children}
    </span>
  );
}
```

- [ ] **Step 4 : Implémenter Avatar**

Créer `web/src/components/ui/Avatar.tsx` :

```tsx
export function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{
        background:
          'linear-gradient(135deg, var(--color-rose-voile), var(--color-gel-rose))',
      }}
    >
      {initials}
    </span>
  );
}
```

- [ ] **Step 5 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- Badge`
Expected: PASS (2 tests).

- [ ] **Step 6 : Commit**

```bash
git add web/src/components/ui/Badge.tsx web/src/components/ui/Avatar.tsx web/src/components/ui/Badge.test.tsx
git commit -m "feat(web): composants Badge et Avatar"
```

---

### Task 6 : Composants Card, EmptyState et PageHeader

**Files:**

- Create: `web/src/components/ui/Card.tsx`
- Create: `web/src/components/ui/EmptyState.tsx`
- Create: `web/src/components/ui/PageHeader.tsx`
- Test: `web/src/components/ui/Card.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/ui/Card.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';

describe('Card', () => {
  it('affiche son contenu', () => {
    render(<Card>Contenu</Card>);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('affiche le titre', () => {
    render(<EmptyState title="Aucun contact" />);
    expect(screen.getByText('Aucun contact')).toBeInTheDocument();
  });
});

describe('PageHeader', () => {
  it('affiche le titre en heading', () => {
    render(<PageHeader title="Accueil" />);
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- Card`
Expected: FAIL (`Card` introuvable).

- [ ] **Step 3 : Implémenter Card**

Créer `web/src/components/ui/Card.tsx` :

```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-projecteur bg-papier p-4',
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4 : Implémenter EmptyState**

Créer `web/src/components/ui/EmptyState.tsx` :

```tsx
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-trait bg-papier py-12 text-center">
      <p className="text-base font-semibold text-encre">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-encre-3">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
```

- [ ] **Step 5 : Implémenter PageHeader**

Créer `web/src/components/ui/PageHeader.tsx` :

```tsx
import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-encre">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-encre-3">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
```

- [ ] **Step 6 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- Card`
Expected: PASS (3 tests).

- [ ] **Step 7 : Commit**

```bash
git add web/src/components/ui/Card.tsx web/src/components/ui/EmptyState.tsx web/src/components/ui/PageHeader.tsx web/src/components/ui/Card.test.tsx
git commit -m "feat(web): composants Card, EmptyState et PageHeader"
```

---

### Task 7 : Composant Input

**Files:**

- Create: `web/src/components/ui/Input.tsx`
- Test: `web/src/components/ui/Input.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/ui/Input.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('relie le label au champ', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- Input`
Expected: FAIL (`Input` introuvable).

- [ ] **Step 3 : Implémenter Input**

Créer `web/src/components/ui/Input.tsx` :

```tsx
import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-encre-3">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30',
          className,
        )}
        {...props}
      />
    </div>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- Input`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/components/ui/Input.tsx web/src/components/ui/Input.test.tsx
git commit -m "feat(web): composant Input"
```

---

### Task 8 : Composant SidePanel

**Files:**

- Create: `web/src/components/ui/SidePanel.tsx`
- Test: `web/src/components/ui/SidePanel.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/ui/SidePanel.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidePanel } from './SidePanel';

describe('SidePanel', () => {
  it('ne rend rien quand fermé', () => {
    render(
      <SidePanel open={false} title="Fiche" onClose={() => {}}>
        Contenu
      </SidePanel>,
    );
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
  });

  it('rend le contenu et déclenche onClose', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open title="Fiche" onClose={onClose}>
        Contenu
      </SidePanel>,
    );
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Fermer le panneau'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- SidePanel`
Expected: FAIL (`SidePanel` introuvable).

- [ ] **Step 3 : Implémenter SidePanel**

Créer `web/src/components/ui/SidePanel.tsx` :

```tsx
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function SidePanel({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fermer"
        className="flex-1 bg-encre/20"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col bg-papier shadow-2xl">
        <header className="flex items-center justify-between border-b border-trait px-5 py-4">
          <h2 className="text-lg font-bold text-encre">{title}</h2>
          <button
            type="button"
            aria-label="Fermer le panneau"
            onClick={onClose}
            className="text-encre-3 hover:text-encre"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- SidePanel`
Expected: PASS (2 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/components/ui/SidePanel.tsx web/src/components/ui/SidePanel.test.tsx
git commit -m "feat(web): composant SidePanel"
```

---

## Phase 3 : Coquille applicative

### Task 9 : Contexte d'authentification factice

**Files:**

- Create: `web/src/lib/auth/AuthContext.tsx`
- Test: `web/src/lib/auth/AuthContext.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/lib/auth/AuthContext.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { tokenStore } from './tokenStore';

function Probe() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'anonyme'}</span>
      <button onClick={() => login('a@b.fr')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('connecte et déconnecte un utilisateur en mémoire', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByTestId('user')).toHaveTextContent('anonyme');

    fireEvent.click(screen.getByText('login'));
    expect(screen.getByTestId('user')).toHaveTextContent('a@b.fr');
    expect(tokenStore.get()).not.toBeNull();

    fireEvent.click(screen.getByText('logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('anonyme');
    expect(tokenStore.get()).toBeNull();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- AuthContext`
Expected: FAIL (`AuthContext` introuvable).

- [ ] **Step 3 : Implémenter le contexte**

Créer `web/src/lib/auth/AuthContext.tsx` :

```tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tokenStore } from './tokenStore';

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email: string) => {
        // Phase factice : aucune verification. Jeton fictif EN MEMOIRE seulement.
        tokenStore.set('factice');
        setUser({ email });
      },
      logout: () => {
        tokenStore.clear();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return ctx;
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- AuthContext`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/lib/auth/AuthContext.tsx web/src/lib/auth/AuthContext.test.tsx
git commit -m "feat(web): contexte d'authentification factice en memoire"
```

---

### Task 10 : Garde de route et page de login

**Files:**

- Create: `web/src/components/RequireAuth.tsx`
- Create: `web/src/features/auth/LoginPage.tsx`
- Test: `web/src/features/auth/LoginPage.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/auth/LoginPage.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../lib/auth/AuthContext';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('affiche le formulaire de connexion', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Se connecter' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- LoginPage`
Expected: FAIL (`LoginPage` introuvable).

- [ ] **Step 3 : Implémenter RequireAuth**

Créer `web/src/components/RequireAuth.tsx` :

```tsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../lib/auth/AuthContext';

export function RequireAuth() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
```

- [ ] **Step 4 : Implémenter LoginPage**

Créer `web/src/features/auth/LoginPage.tsx` :

```tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    login(email);
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-scene px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border-2 border-projecteur bg-papier p-8"
      >
        <h1 className="text-2xl font-extrabold text-encre">Eloquetia</h1>
        <p className="mt-1 text-sm text-encre-3">
          Connexion à l'outil de pilotage
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@eloquentia.fr"
          />
          <Input
            label="Mot de passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Mot de passe"
          />
          <Button type="submit" variant="primary" className="w-full">
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 5 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- LoginPage`
Expected: PASS (1 test).

- [ ] **Step 6 : Commit**

```bash
git add web/src/components/RequireAuth.tsx web/src/features/auth/
git commit -m "feat(web): page de login factice et garde de route"
```

---

### Task 11 : Composant DemoDataToggle

**Files:**

- Create: `web/src/components/DemoDataToggle.tsx`
- Test: `web/src/components/DemoDataToggle.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/components/DemoDataToggle.test.tsx` :

```tsx
import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DemoDataToggle } from './DemoDataToggle';
import { createCollectionStore } from '../lib/store/createCollectionStore';

interface Widget {
  id: string;
  name: string;
}

const seeder = (): Widget[] => [{ id: 'w1', name: 'Alpha' }];

describe('DemoDataToggle', () => {
  beforeEach(() => localStorage.clear());

  it('active puis désactive les données de démo', async () => {
    const store = createCollectionStore<Widget>('test:demo', seeder);
    render(<DemoDataToggle store={store} />);

    const button = await screen.findByRole('button');
    expect(button).toHaveTextContent('désactivées');

    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('activées'));
    expect(await store.list()).toHaveLength(1);

    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('désactivées'));
    expect(await store.list()).toHaveLength(0);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- DemoDataToggle`
Expected: FAIL (`DemoDataToggle` introuvable).

- [ ] **Step 3 : Implémenter DemoDataToggle**

Créer `web/src/components/DemoDataToggle.tsx` :

```tsx
import { useEffect, useState } from 'react';
import type {
  CollectionStore,
  Identifiable,
} from '../lib/store/createCollectionStore';
import { cn } from '../lib/cn';

export function DemoDataToggle<T extends Identifiable>({
  store,
  onChange,
}: {
  store: CollectionStore<T>;
  onChange?: () => void;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    void store.isSeeded().then(setOn);
  }, [store]);

  async function toggle() {
    if (on) {
      await store.clear();
      setOn(false);
    } else {
      await store.seed();
      setOn(true);
    }
    onChange?.();
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors',
        on
          ? 'border-gel-rose bg-rose-brume text-velours'
          : 'border-trait-fort bg-papier text-encre-2',
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          on ? 'bg-gel-rose' : 'bg-encre-4',
        )}
      />
      Données de démo {on ? 'activées' : 'désactivées'}
    </button>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- DemoDataToggle`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit**

```bash
git add web/src/components/DemoDataToggle.tsx web/src/components/DemoDataToggle.test.tsx
git commit -m "feat(web): bouton d'activation des donnees de demo"
```

---

### Task 12 : Pages des 5 onglets (remap des stubs)

**Files:**

- Create: `web/src/features/home/index.tsx`
- Create: `web/src/features/crm/index.tsx`
- Create: `web/src/features/calendar/index.tsx`
- Create: `web/src/features/mail/index.tsx`
- Create: `web/src/features/accounting/index.tsx`
- Delete: `web/src/features/dashboard/`, `web/src/features/partners/`, `web/src/features/jury/`, `web/src/features/events/`, `web/src/features/tasks/`, `web/src/features/emailing/`

- [ ] **Step 1 : Créer la page Accueil**

Créer `web/src/features/home/index.tsx` :

```tsx
import { PageHeader } from '../../components/ui/PageHeader';

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Accueil"
        description="Synthèse de l'activité (hors comptabilité)."
      />
      <p className="text-sm text-encre-3">Module à implémenter.</p>
    </>
  );
}
```

- [ ] **Step 2 : Créer la page CRM**

Créer `web/src/features/crm/index.tsx` :

```tsx
import { PageHeader } from '../../components/ui/PageHeader';

export default function CrmPage() {
  return (
    <>
      <PageHeader title="CRM" description="Contacts, prospection et badges." />
      <p className="text-sm text-encre-3">Module à implémenter.</p>
    </>
  );
}
```

- [ ] **Step 3 : Créer la page Calendrier**

Créer `web/src/features/calendar/index.tsx` :

```tsx
import { PageHeader } from '../../components/ui/PageHeader';

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Événements, tâches et échéances."
      />
      <p className="text-sm text-encre-3">Module à implémenter.</p>
    </>
  );
}
```

- [ ] **Step 4 : Créer la page Mail marketing**

Créer `web/src/features/mail/index.tsx` :

```tsx
import { PageHeader } from '../../components/ui/PageHeader';

export default function MailPage() {
  return (
    <>
      <PageHeader
        title="Mail marketing"
        description="Capture de leads et envois."
      />
      <p className="text-sm text-encre-3">Module à implémenter.</p>
    </>
  );
}
```

- [ ] **Step 5 : Créer la page Comptabilité**

Créer `web/src/features/accounting/index.tsx` :

```tsx
import { PageHeader } from '../../components/ui/PageHeader';

export default function AccountingPage() {
  return (
    <>
      <PageHeader
        title="Comptabilité"
        description="Achats, revenus et prévisionnel."
      />
      <p className="text-sm text-encre-3">Module à implémenter.</p>
    </>
  );
}
```

- [ ] **Step 6 : Supprimer les anciens stubs**

Run:

```bash
git rm -r web/src/features/dashboard web/src/features/partners web/src/features/jury web/src/features/events web/src/features/tasks web/src/features/emailing
```

Expected: les 6 dossiers sont supprimés (le routeur et le test smoke seront corrigés aux tâches 13 et 14, donc la compilation est volontairement cassée entre-temps).

- [ ] **Step 7 : Commit**

```bash
git add web/src/features/
git commit -m "feat(web): pages des 5 onglets et suppression des anciens stubs"
```

---

### Task 13 : RootLayout avec sidebar

**Files:**

- Modify: `web/src/RootLayout.tsx` (remplacement complet)

- [ ] **Step 1 : Remplacer RootLayout**

Remplacer tout le contenu de `web/src/RootLayout.tsx` par :

```tsx
import { NavLink, Outlet } from 'react-router';
import { Calendar, Home, LogOut, Mail, Users, Wallet } from 'lucide-react';
import { useAuth } from './lib/auth/AuthContext';
import { cn } from './lib/cn';

const links = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/crm', label: 'CRM', icon: Users, end: false },
  { to: '/calendrier', label: 'Calendrier', icon: Calendar, end: false },
  { to: '/mail', label: 'Mail marketing', icon: Mail, end: false },
  { to: '/comptabilite', label: 'Comptabilité', icon: Wallet, end: false },
];

export function RootLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-scene">
      <aside className="flex w-62 flex-col border-r border-trait px-3 py-5">
        <div className="px-3 pb-6 text-xl font-extrabold text-encre">
          Eloquetia
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-jaune-brume font-semibold text-encre'
                    : 'text-encre-2 hover:bg-papier',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-encre-2 hover:bg-papier"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
        {user && (
          <span className="px-3 pt-1 text-xs text-encre-3">{user.email}</span>
        )}
      </aside>
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add web/src/RootLayout.tsx
git commit -m "feat(web): layout avec sidebar des 5 onglets"
```

---

### Task 14 : Routeur, AuthProvider et test smoke

**Files:**

- Modify: `web/src/router.tsx` (remplacement complet)
- Modify: `web/src/main.tsx` (wrapper AuthProvider)
- Modify: `web/src/test/smoke.test.tsx` (remplacement complet)

- [ ] **Step 1 : Remplacer le routeur**

Remplacer tout le contenu de `web/src/router.tsx` par :

```tsx
import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { RequireAuth } from './components/RequireAuth';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home';
import CrmPage from './features/crm';
import CalendarPage from './features/calendar';
import MailPage from './features/mail';
import AccountingPage from './features/accounting';

// Routeur en mode librairie (React Router v7).
// /login est public ; les 5 onglets sont proteges par RequireAuth.
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'crm', element: <CrmPage /> },
          { path: 'calendrier', element: <CalendarPage /> },
          { path: 'mail', element: <MailPage /> },
          { path: 'comptabilite', element: <AccountingPage /> },
        ],
      },
    ],
  },
]);
```

- [ ] **Step 2 : Envelopper l'app dans AuthProvider**

Remplacer tout le contenu de `web/src/main.tsx` par :

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { AuthProvider } from './lib/auth/AuthContext';
import { router } from './router';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément racine #root introuvable');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
```

- [ ] **Step 3 : Remplacer le test smoke**

Remplacer tout le contenu de `web/src/test/smoke.test.tsx` par :

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../features/home';

describe('smoke', () => {
  it("affiche l'en-tête de l'accueil", () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: 'Accueil' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 4 : Lancer toute la suite de tests**

Run: `npm run test --workspace web`
Expected: PASS (tous les fichiers de test verts).

- [ ] **Step 5 : Commit**

```bash
git add web/src/router.tsx web/src/main.tsx web/src/test/smoke.test.tsx
git commit -m "feat(web): routeur des 5 onglets, AuthProvider et test smoke"
```

---

### Task 15 : Vérification finale et contrôle visuel

**Files:** aucun (vérification)

- [ ] **Step 1 : Typecheck**

Run: `npm run typecheck --workspace web`
Expected: PASS (aucune erreur).

- [ ] **Step 2 : Lint**

Run: `npm run lint`
Expected: PASS (aucune erreur ; corriger le cas échéant avec `npm run lint:fix`).

- [ ] **Step 3 : Tests complets**

Run: `npm run test --workspace web`
Expected: PASS.

- [ ] **Step 4 : Contrôle visuel manuel**

Run: `npm run dev` puis ouvrir `http://localhost:5173`.
Vérifier :

- L'accès à `/` redirige vers `/login` (non connecté).
- La connexion (email quelconque) mène à l'Accueil.
- La sidebar affiche les 5 onglets, l'onglet actif a un fond jaune pâle.
- La navigation entre les 5 pages fonctionne.
- La police Plus Jakarta Sans est appliquée, le fond est blanc cassé chaud.
- La déconnexion ramène à `/login`.

- [ ] **Step 5 : Mettre à jour le statut du spec**

Dans `docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md`, ligne 4, remplacer le statut par :
`- Statut : fondations et coquille implémentées ; CRM à venir`

```bash
git add docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md
git commit -m "docs: mise a jour du statut du spec apres la coquille"
```

---

## Self-review (couverture du spec)

- Section 4.2 tokens : Task 2.
- Section 4.3 typographie : Tasks 1, 2, 14.
- Section 4.5 composants signature : Tasks 4 à 8 (Button, Badge, Avatar, Card, EmptyState, Input, SidePanel) + PageHeader.
- Section 5.2 couche de données : Task 3.
- Section 5.3 bouton données de démo : Task 11.
- Section 5.4 login factice (jeton en mémoire) : Tasks 9, 10.
- Section 5.5 remap des stubs : Tasks 12, 14.
- Section 6 coquille : Tasks 9 à 14.

Non couvert ici (volontairement, plan CRM séparé) : section 7 (module CRM), ainsi que `recharts`, `@dnd-kit/core` et `papaparse` qui seront ajoutés au cycle correspondant.

```

```
