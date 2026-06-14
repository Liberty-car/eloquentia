# Mail marketing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Module Mail marketing (phase de test, sans Brevo) : capture de leads vers le CRM, composition d'emails segmentés par badge (envoi MOCKÉ), et historique des campagnes.

**Architecture:** Module frontend `web/src/features/mail/`, calqué sur `features/calendar` et `features/accounting`. La capture de leads écrit dans `contactsStore` (CRM). Les campagnes vivent dans un `campagnesStore` localStorage. Aucun envoi réel.

**Tech Stack:** React 19, TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Tailwind v4, Vitest + Testing Library.

## Conventions verrouillées

- Français avec accents partout. Pas de tiret cadratin (—).
- Champs optionnels : objet `opts` conditionnel + spread (jamais `undefined` explicite).
- Stores async via `createCollectionStore`. Le jeton auth ne touche jamais localStorage (non concerné).
- Aucun envoi réel : « Envoyer » crée seulement une `Campagne` avec `statut: 'envoye'`.
- Contraintes dates démo : `<= 2026-09-30`. Date du jour utilisée pour les créations : `2026-06-14`.

Rappels CRM (déjà existants, `web/src/features/crm/`) :

- `contactsStore` (store.ts). `Contact`, `BadgeId`, `BADGES`, `BADGE_LABELS` (types.ts).
- Un lead = `Contact` avec `badges: ['lead']`, `etape: 'a_contacter'`, `source: 'formulaire'`.

---

### Tâche 1 : Types

**Files:**

- Create: `web/src/features/mail/types.ts`

- [ ] **Étape 1 : Écrire le fichier**

```ts
// Modèles du module Mail marketing.
import type { BadgeId } from '../crm/types';

// Segment de diffusion : un badge CRM précis, ou tous les contacts.
export type SegmentBadge = BadgeId | 'tous';

export interface Campagne {
  id: string;
  sujet: string;
  corps: string;
  segment: SegmentBadge;
  destinataires: number; // figé au moment de l'envoi
  date: string; // ISO AAAA-MM-JJ
  statut: 'envoye'; // envoi mocké
}

// Valeurs du formulaire de composition.
export interface ComposerValues {
  sujet: string;
  corps: string;
  segment: SegmentBadge;
}

// Valeurs du formulaire de capture de lead.
export interface LeadFormValues {
  prenom: string;
  nom: string;
  organisation: string;
  email: string;
  message: string;
}
```

- [ ] **Étape 2 : Commit**

```bash
git add web/src/features/mail/types.ts
git commit -m "feat(mail): types campagne et formulaires"
```

---

### Tâche 2 : Comptage des destinataires

**Files:**

- Create: `web/src/features/mail/recipients.ts`
- Test: `web/src/features/mail/recipients.test.ts`

Un destinataire = un contact AVEC email, correspondant au segment (`tous`, ou badge présent dans `contact.badges`).

- [ ] **Étape 1 : Écrire le test (rouge)**

```ts
import { describe, it, expect } from 'vitest';
import { compterDestinataires } from './recipients';
import type { Contact } from '../crm/types';

const c = (over: Partial<Contact>): Contact => ({
  id: 'x',
  prenom: 'A',
  nom: 'B',
  badges: [],
  etape: 'a_contacter',
  source: 'manuel',
  dateCreation: '2026-06-01',
  ...over,
});

const contacts: Contact[] = [
  c({ id: '1', email: 'a@x.fr', badges: ['partenaire'] }),
  c({ id: '2', email: 'b@x.fr', badges: ['jury', 'partenaire'] }),
  c({ id: '3', badges: ['partenaire'] }), // sans email -> exclu
  c({ id: '4', email: 'd@x.fr', badges: ['benevole'] }),
];

describe('compterDestinataires', () => {
  it('compte tous les contacts avec email pour le segment "tous"', () => {
    expect(compterDestinataires(contacts, 'tous')).toBe(3);
  });

  it('compte les contacts du badge ayant un email', () => {
    expect(compterDestinataires(contacts, 'partenaire')).toBe(2);
    expect(compterDestinataires(contacts, 'jury')).toBe(1);
    expect(compterDestinataires(contacts, 'benevole')).toBe(1);
  });

  it('renvoie 0 pour un badge sans destinataire', () => {
    expect(compterDestinataires(contacts, 'lead')).toBe(0);
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `cd web && npx vitest run src/features/mail/recipients.test.ts`
Expected: FAIL

- [ ] **Étape 3 : Écrire `recipients.ts`**

```ts
import type { Contact } from '../crm/types';
import type { SegmentBadge } from './types';

export function destinataires(
  contacts: Contact[],
  segment: SegmentBadge,
): Contact[] {
  return contacts.filter(
    (c) =>
      Boolean(c.email) && (segment === 'tous' || c.badges.includes(segment)),
  );
}

export function compterDestinataires(
  contacts: Contact[],
  segment: SegmentBadge,
): number {
  return destinataires(contacts, segment).length;
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/mail/recipients.test.ts`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/mail/recipients.ts web/src/features/mail/recipients.test.ts
git commit -m "feat(mail): comptage des destinataires par segment"
```

---

### Tâche 3 : Données de démo et store

**Files:**

- Create: `web/src/features/mail/seed.ts`
- Create: `web/src/features/mail/store.ts`

- [ ] **Étape 1 : Écrire `seed.ts`** (6 campagnes, dates <= 2026-09-30)

```ts
import type { Campagne } from './types';

// 6 campagnes fictives déjà "envoyées" (mock).
export function seedCampagnes(): Campagne[] {
  return [
    {
      id: 'k1',
      sujet: 'Lancement de la saison 2026',
      corps:
        "Bonjour,\n\nLa nouvelle saison d'Eloquentia est lancée. Restez connectés pour les prochaines étapes du concours.\n\nÀ très vite,\nL'équipe Eloquentia",
      segment: 'tous',
      destinataires: 18,
      date: '2026-06-02',
      statut: 'envoye',
    },
    {
      id: 'k2',
      sujet: 'Appel à bénévoles - finale',
      corps:
        'Bonjour,\n\nNous recherchons des bénévoles pour la finale. Merci de nous indiquer vos disponibilités.\n\nMerci !',
      segment: 'benevole',
      destinataires: 4,
      date: '2026-06-18',
      statut: 'envoye',
    },
    {
      id: 'k3',
      sujet: 'Invitation jury - demi-finale',
      corps:
        'Cher membre du jury,\n\nNous avons le plaisir de vous convier à la demi-finale. Détails à suivre.\n\nBien à vous',
      segment: 'jury',
      destinataires: 3,
      date: '2026-07-22',
      statut: 'envoye',
    },
    {
      id: 'k4',
      sujet: 'Newsletter partenaires - juillet',
      corps:
        'Chers partenaires,\n\nDécouvrez les temps forts du mois et nos remerciements pour votre soutien.\n\nCordialement',
      segment: 'partenaire',
      destinataires: 6,
      date: '2026-07-30',
      statut: 'envoye',
    },
    {
      id: 'k5',
      sujet: 'La billetterie de la finale est ouverte',
      corps:
        'Bonjour,\n\nRéservez dès maintenant votre place pour la grande finale au Théâtre de la Ville.\n\nÀ bientôt',
      segment: 'tous',
      destinataires: 20,
      date: '2026-09-01',
      statut: 'envoye',
    },
    {
      id: 'k6',
      sujet: 'Merci aux intervenants',
      corps:
        'Bonjour,\n\nUn grand merci pour vos ateliers de cette saison. Vos retours sont précieux.\n\nMerci encore',
      segment: 'intervenant',
      destinataires: 2,
      date: '2026-09-20',
      statut: 'envoye',
    },
  ];
}
```

- [ ] **Étape 2 : Écrire `store.ts`**

```ts
import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Campagne } from './types';
import { seedCampagnes } from './seed';

export const campagnesStore = createCollectionStore<Campagne>(
  'mail:campagnes',
  seedCampagnes,
);
```

- [ ] **Étape 3 : Commit**

```bash
git add web/src/features/mail/seed.ts web/src/features/mail/store.ts
git commit -m "feat(mail): donnees de demo et store des campagnes"
```

---

### Tâche 4 : Sélecteur de vues

**Files:**

- Create: `web/src/features/mail/views.ts`
- Create: `web/src/features/mail/MailViewSwitcher.tsx`

- [ ] **Étape 1 : Écrire `views.ts`**

```ts
// Vues du module Mail (ordre du sélecteur).
export const VUES_MAIL = [
  { id: 'composer', label: 'Composer' },
  { id: 'leads', label: 'Capture de leads' },
  { id: 'historique', label: 'Historique' },
] as const;

export type VueMail = (typeof VUES_MAIL)[number]['id'];
```

- [ ] **Étape 2 : Écrire `MailViewSwitcher.tsx`**

```tsx
import { cn } from '../../lib/cn';
import { VUES_MAIL, type VueMail } from './views';

export function MailViewSwitcher({
  value,
  onChange,
}: {
  value: VueMail;
  onChange: (vue: VueMail) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-trait bg-papier p-1">
      {VUES_MAIL.map((vue) => (
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
git add web/src/features/mail/views.ts web/src/features/mail/MailViewSwitcher.tsx
git commit -m "feat(mail): selecteur de vues"
```

---

### Tâche 5 : Vue Composer

**Files:**

- Create: `web/src/features/mail/ComposerView.tsx`
- Test: `web/src/features/mail/ComposerView.test.tsx`

Chips de segment (`Tous` + chaque badge), aperçu du nombre de destinataires calculé depuis `contacts`, champ sujet, zone de corps. Bouton « Envoyer la campagne » désactivé si sujet vide OU 0 destinataire. À l'envoi : `onSend({ sujet, corps, segment })`.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComposerView } from './ComposerView';
import type { Contact } from '../crm/types';

const contacts: Contact[] = [
  {
    id: '1',
    prenom: 'A',
    nom: 'B',
    email: 'a@x.fr',
    badges: ['partenaire'],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-06-01',
  },
  {
    id: '2',
    prenom: 'C',
    nom: 'D',
    email: 'c@x.fr',
    badges: ['jury'],
    etape: 'a_contacter',
    source: 'manuel',
    dateCreation: '2026-06-01',
  },
];

describe('ComposerView', () => {
  it('affiche le nombre de destinataires du segment (par défaut "tous")', () => {
    render(<ComposerView contacts={contacts} onSend={() => {}} />);
    expect(screen.getByTestId('destinataires-count').textContent).toContain(
      '2',
    );
  });

  it('désactive l’envoi tant que le sujet est vide', () => {
    render(<ComposerView contacts={contacts} onSend={() => {}} />);
    const bouton = screen.getByRole('button', {
      name: /Envoyer la campagne/,
    });
    expect(bouton).toBeDisabled();
  });

  it('envoie avec le sujet, le corps et le segment', () => {
    const onSend = vi.fn();
    render(<ComposerView contacts={contacts} onSend={onSend} />);
    fireEvent.change(screen.getByLabelText('Sujet'), {
      target: { value: 'Bonjour' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Corps du message' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Envoyer la campagne/ }),
    );
    expect(onSend).toHaveBeenCalledWith({
      sujet: 'Bonjour',
      corps: 'Corps du message',
      segment: 'tous',
    });
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/mail/ComposerView.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Écrire le composant**

```tsx
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/cn';
import { BADGES, BADGE_LABELS, type Contact } from '../crm/types';
import { compterDestinataires } from './recipients';
import type { ComposerValues, SegmentBadge } from './types';

const SEGMENTS: SegmentBadge[] = ['tous', ...BADGES];

function labelSegment(segment: SegmentBadge): string {
  return segment === 'tous' ? 'Tous' : BADGE_LABELS[segment];
}

export function ComposerView({
  contacts,
  onSend,
}: {
  contacts: Contact[];
  onSend: (values: ComposerValues) => void;
}) {
  const [segment, setSegment] = useState<SegmentBadge>('tous');
  const [sujet, setSujet] = useState('');
  const [corps, setCorps] = useState('');

  const nbDestinataires = compterDestinataires(contacts, segment);
  const peutEnvoyer = sujet.trim() !== '' && nbDestinataires > 0;

  function envoyer() {
    if (!peutEnvoyer) return;
    onSend({ sujet: sujet.trim(), corps: corps.trim(), segment });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-encre-3">Segment</span>
        <div className="flex flex-wrap gap-1.5">
          {SEGMENTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSegment(s)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                segment === s
                  ? 'border-gel-rose bg-rose-brume text-velours'
                  : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
              )}
            >
              {labelSegment(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
          Destinataires (contacts avec email)
        </p>
        <p
          data-testid="destinataires-count"
          className="mt-1 text-2xl font-extrabold tabular-nums text-encre"
        >
          {nbDestinataires}
        </p>
      </div>

      <Input
        label="Sujet"
        value={sujet}
        onChange={(e) => setSujet(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="mail-corps"
          className="text-xs font-medium text-encre-3"
        >
          Message
        </label>
        <textarea
          id="mail-corps"
          rows={8}
          value={corps}
          onChange={(e) => setCorps(e.target.value)}
          className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-encre-3">
          Phase de test : l'envoi est simulé (aucun email réel n'est envoyé).
        </p>
        <Button variant="primary" onClick={envoyer} disabled={!peutEnvoyer}>
          Envoyer la campagne
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/mail/ComposerView.test.tsx`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/mail/ComposerView.tsx web/src/features/mail/ComposerView.test.tsx
git commit -m "feat(mail): vue composer avec segment et apercu destinataires"
```

---

### Tâche 6 : Vue Capture de leads

**Files:**

- Create: `web/src/features/mail/LeadCaptureView.tsx`
- Test: `web/src/features/mail/LeadCaptureView.test.tsx`

Formulaire public simulé : prénom, nom (requis), organisation, email, message. À la soumission valide : `onSubmit(values)` puis réinitialisation des champs. Bouton désactivé si prénom ou nom vide.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadCaptureView } from './LeadCaptureView';

describe('LeadCaptureView', () => {
  it('soumet les valeurs du lead puis réinitialise', () => {
    const onSubmit = vi.fn();
    render(<LeadCaptureView onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Marie' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Durand' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'marie@example.fr' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer/ }));
    expect(onSubmit).toHaveBeenCalledWith({
      prenom: 'Marie',
      nom: 'Durand',
      organisation: '',
      email: 'marie@example.fr',
      message: '',
    });
    // Réinitialisation.
    expect((screen.getByLabelText('Prénom') as HTMLInputElement).value).toBe(
      '',
    );
  });

  it('désactive l’envoi sans prénom ni nom', () => {
    render(<LeadCaptureView onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /Envoyer/ })).toBeDisabled();
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/mail/LeadCaptureView.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Écrire le composant**

```tsx
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { LeadFormValues } from './types';

const VIDE: LeadFormValues = {
  prenom: '',
  nom: '',
  organisation: '',
  email: '',
  message: '',
};

export function LeadCaptureView({
  onSubmit,
}: {
  onSubmit: (values: LeadFormValues) => void;
}) {
  const [values, setValues] = useState<LeadFormValues>(VIDE);

  function set<K extends keyof LeadFormValues>(
    key: K,
    value: LeadFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const peutEnvoyer = values.prenom.trim() !== '' && values.nom.trim() !== '';

  function envoyer() {
    if (!peutEnvoyer) return;
    onSubmit({
      prenom: values.prenom.trim(),
      nom: values.nom.trim(),
      organisation: values.organisation.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setValues(VIDE);
  }

  return (
    <div className="max-w-xl">
      <div className="rounded-xl border-2 border-projecteur bg-papier p-5">
        <h2 className="text-lg font-bold text-encre">Formulaire de contact</h2>
        <p className="mt-1 mb-4 text-sm text-encre-3">
          Simule un formulaire public : chaque envoi crée un contact « lead »
          dans le CRM (étape « À contacter »).
        </p>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              value={values.prenom}
              onChange={(e) => set('prenom', e.target.value)}
            />
            <Input
              label="Nom"
              value={values.nom}
              onChange={(e) => set('nom', e.target.value)}
            />
          </div>
          <Input
            label="Organisation"
            value={values.organisation}
            onChange={(e) => set('organisation', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lead-message"
              className="text-xs font-medium text-encre-3"
            >
              Message
            </label>
            <textarea
              id="lead-message"
              rows={4}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={envoyer} disabled={!peutEnvoyer}>
              Envoyer la demande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/mail/LeadCaptureView.test.tsx`
Expected: PASS

- [ ] **Étape 5 : Commit**

```bash
git add web/src/features/mail/LeadCaptureView.tsx web/src/features/mail/LeadCaptureView.test.tsx
git commit -m "feat(mail): formulaire de capture de leads"
```

---

### Tâche 7 : Vue Historique

**Files:**

- Create: `web/src/features/mail/HistoriqueView.tsx`

Liste des campagnes (plus récentes en premier), avec sujet, segment, date, nombre de destinataires, badge « Envoyé ». État vide via `EmptyState`.

- [ ] **Étape 1 : Écrire le composant**

```tsx
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { BADGE_LABELS } from '../crm/types';
import type { Campagne, SegmentBadge } from './types';

function labelSegment(segment: SegmentBadge): string {
  return segment === 'tous' ? 'Tous les contacts' : BADGE_LABELS[segment];
}

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

export function HistoriqueView({ campagnes }: { campagnes: Campagne[] }) {
  if (campagnes.length === 0) {
    return (
      <EmptyState
        title="Aucune campagne"
        description="Active les données de démo ou envoie une campagne depuis l'onglet Composer."
      />
    );
  }

  const triees = [...campagnes].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );

  return (
    <div className="flex flex-col gap-2">
      {triees.map((c) => (
        <article
          key={c.id}
          className="rounded-xl border-2 border-projecteur bg-papier p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-encre">{c.sujet}</h3>
              <p className="mt-0.5 text-xs text-encre-3">
                {labelSegment(c.segment)} - {c.destinataires} destinataire
                {c.destinataires > 1 ? 's' : ''} - {formatDateCourte(c.date)}
              </p>
            </div>
            <Badge tone="rose">Envoyé</Badge>
          </div>
          {c.corps && (
            <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-encre-2">
              {c.corps}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Étape 2 : Commit**

```bash
git add web/src/features/mail/HistoriqueView.tsx
git commit -m "feat(mail): vue historique des campagnes"
```

---

### Tâche 8 : Intégration en page

**Files:**

- Modify (réécriture complète) : `web/src/features/mail/index.tsx`
- Test: `web/src/features/mail/index.test.tsx`

La page orchestre : chargement `contactsStore` + `campagnesStore`, bouton « Données de démo » (sur `campagnesStore`), sélecteur de vues, bannière de confirmation après création de lead / envoi de campagne.

- [ ] **Étape 1 : Écrire le test (rouge)**

```tsx
import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MailPage from './index';
import { campagnesStore } from './store';
import { contactsStore } from '../crm/store';

describe('MailPage', () => {
  beforeEach(() => localStorage.clear());

  it('charge les campagnes de démo', async () => {
    render(<MailPage />);
    expect(
      screen.getByRole('heading', { name: 'Mail marketing' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
    await waitFor(async () => {
      expect(await campagnesStore.list()).toHaveLength(6);
    });
  });

  it('crée un lead dans le CRM depuis la capture', async () => {
    render(<MailPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Capture de leads' }));
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Marie' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Durand' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer la demande/ }));
    await waitFor(async () => {
      const contacts = await contactsStore.list();
      const lead = contacts.find((c) => c.nom === 'Durand');
      expect(lead).toBeTruthy();
      expect(lead?.badges).toContain('lead');
      expect(lead?.source).toBe('formulaire');
      expect(lead?.etape).toBe('a_contacter');
    });
  });

  it('envoie une campagne et l’ajoute à l’historique', async () => {
    render(<MailPage />);
    // Donne des destinataires : seed CRM via la démo de campagnes ? Non :
    // on crée d'abord un lead avec email pour avoir >= 1 destinataire.
    fireEvent.click(screen.getByRole('button', { name: 'Capture de leads' }));
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Jean' },
    });
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Martin' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jean@example.fr' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Envoyer la demande/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Composer' }));
    await waitFor(() =>
      expect(screen.getByTestId('destinataires-count').textContent).toContain(
        '1',
      ),
    );
    fireEvent.change(screen.getByLabelText('Sujet'), {
      target: { value: 'Test campagne' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Envoyer la campagne/ }),
    );
    await waitFor(async () => {
      const camps = await campagnesStore.list();
      expect(camps.some((c) => c.sujet === 'Test campagne')).toBe(true);
    });
  });
});
```

- [ ] **Étape 2 : Voir le test échouer**

Run: `npx vitest run src/features/mail/index.test.tsx`
Expected: FAIL

- [ ] **Étape 3 : Réécrire `index.tsx`**

```tsx
import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { cn } from '../../lib/cn';
import { campagnesStore } from './store';
import { contactsStore } from '../crm/store';
import { compterDestinataires } from './recipients';
import { MailViewSwitcher } from './MailViewSwitcher';
import { ComposerView } from './ComposerView';
import { LeadCaptureView } from './LeadCaptureView';
import { HistoriqueView } from './HistoriqueView';
import type { Campagne, ComposerValues, LeadFormValues } from './types';
import type { VueMail } from './views';
import type { Contact } from '../crm/types';

const AUJOURDHUI = '2026-06-14';

export default function MailPage() {
  const [vue, setVue] = useState<VueMail>('composer');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [demo, setDemo] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const rafraichir = useCallback(() => {
    void contactsStore.list().then(setContacts);
    void campagnesStore.list().then(setCampagnes);
    void campagnesStore.isSeeded().then(setDemo);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) await campagnesStore.clear();
    else await campagnesStore.seed();
    rafraichir();
  }

  async function creerLead(values: LeadFormValues) {
    const opts: Partial<Pick<Contact, 'organisation' | 'email' | 'notes'>> = {};
    if (values.organisation) opts.organisation = values.organisation;
    if (values.email) opts.email = values.email;
    if (values.message) opts.notes = values.message;
    await contactsStore.create({
      prenom: values.prenom,
      nom: values.nom,
      badges: ['lead'],
      etape: 'a_contacter',
      source: 'formulaire',
      dateCreation: AUJOURDHUI,
      ...opts,
    });
    setMessage(`Lead « ${values.prenom} ${values.nom} » ajouté au CRM.`);
    rafraichir();
  }

  async function envoyerCampagne(values: ComposerValues) {
    const destinataires = compterDestinataires(contacts, values.segment);
    await campagnesStore.create({
      sujet: values.sujet,
      corps: values.corps,
      segment: values.segment,
      destinataires,
      date: AUJOURDHUI,
      statut: 'envoye',
    });
    setMessage(
      `Campagne « ${values.sujet} » envoyée à ${destinataires} destinataire${destinataires > 1 ? 's' : ''} (simulation).`,
    );
    rafraichir();
    setVue('historique');
  }

  function changerVue(v: VueMail) {
    setMessage(null);
    setVue(v);
  }

  return (
    <>
      <PageHeader
        title="Mail marketing"
        description="Capture de leads, campagnes segmentées et historique (envoi simulé)."
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

      <div className="mb-4">
        <MailViewSwitcher value={vue} onChange={changerVue} />
      </div>

      {message && (
        <div className="mb-4 rounded-[10px] border border-gel-rose bg-rose-brume px-4 py-2 text-sm font-medium text-velours">
          {message}
        </div>
      )}

      {vue === 'composer' && (
        <ComposerView contacts={contacts} onSend={envoyerCampagne} />
      )}
      {vue === 'leads' && <LeadCaptureView onSubmit={creerLead} />}
      {vue === 'historique' && <HistoriqueView campagnes={campagnes} />}
    </>
  );
}
```

- [ ] **Étape 4 : Voir le test passer**

Run: `npx vitest run src/features/mail/index.test.tsx`
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
git add web/src/features/mail/index.tsx web/src/features/mail/index.test.tsx
git commit -m "feat(mail): integration de la page (composer, leads, historique)"
```

---

## Self-review

- Couverture spec : types (T1), comptage destinataires (T2), démo + store (T3), sélecteur (T4), composer segmenté + aperçu (T5), capture lead -> CRM (T6), historique (T7), intégration + bannière de confirmation (T8).
- Cohérence types : `SegmentBadge`, `Campagne`, `ComposerValues`, `LeadFormValues` (types.ts) ; `compterDestinataires` (recipients.ts) utilisé par ComposerView et la page ; lead créé avec `badges:['lead']`, `etape:'a_contacter'`, `source:'formulaire'`.
- Conventions : accents, pas de tiret cadratin, champs optionnels via `opts` conditionnel, envoi mocké (`statut:'envoye'`), aucune dépendance externe.
- Le jaune n'est jamais sous du texte (chips actifs en rose-brume/velours ; badge « Envoyé » en tone rose).
