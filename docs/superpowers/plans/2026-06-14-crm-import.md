# CRM import CSV + correctif édition (Plan 2c) : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre d'importer des contacts depuis un fichier CSV, et corriger l'édition pour qu'on puisse vider un champ optionnel d'un contact.

**Architecture:** Un correctif côté store (`replace`, remplacement complet d'un enregistrement) résout le fait qu'une édition ne peut pas vider un champ. L'import CSV repose sur `papaparse` : une fonction pure `parseContactsCsv` (testable) et un panneau latéral `ContactImport` câblé dans la page CRM.

**Tech Stack:** React 19, TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Tailwind v4, Vitest + Testing Library, `papaparse`.

**Référence:** section 7.7 du spec + limite « vider un champ optionnel » notée à la revue du Plan 2a.

**Commandes de vérification:**

- Tests : `npm run test --workspace web`
- Typecheck : `npm run typecheck --workspace web`
- Lint : `npm run lint`

---

### Task 1 : Méthode `replace` du store

**Files:**

- Modify: `web/src/lib/store/createCollectionStore.ts`
- Modify: `web/src/lib/store/createCollectionStore.test.ts`

- [ ] **Step 1 : Ajouter les tests qui échouent**

Dans `web/src/lib/store/createCollectionStore.test.ts`, ajouter ces deux tests à la fin du `describe` (avant la dernière `});` de fermeture) :

```ts
it('replace remplace entièrement et peut vider un champ', async () => {
  interface Truc {
    id: string;
    a: string;
    b?: string;
  }
  const store = createCollectionStore<Truc>('test:replace', () => []);
  const cree = await store.create({ a: 'x', b: 'y' });
  const remplace = await store.replace(cree.id, { a: 'x2' });
  expect(remplace.a).toBe('x2');
  expect(remplace.b).toBeUndefined();
  expect((await store.get(cree.id))?.b).toBeUndefined();
});

it('replace jette si introuvable', async () => {
  const store = createCollectionStore<Widget>('test:replace2', seeder);
  await expect(store.replace('inconnu', { name: 'X' })).rejects.toThrow();
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- createCollectionStore`
Expected: FAIL (`replace` n'existe pas).

- [ ] **Step 3 : Implémenter `replace`**

Dans `web/src/lib/store/createCollectionStore.ts`, ajouter `replace` à l'interface `CollectionStore<T>` (juste après `update`) :

```ts
  replace(id: string, data: Omit<T, 'id'>): Promise<T>;
```

Et ajouter l'implémentation dans l'objet retourné, juste après la méthode `update` :

```ts
    async replace(id, data) {
      const items = readRaw<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Élément introuvable : ${id}`);
      }
      const remplace = { ...data, id } as unknown as T;
      items[index] = remplace;
      writeRaw(key, items);
      return remplace;
    },
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- createCollectionStore`
Expected: PASS (8 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/lib/store/createCollectionStore.ts web/src/lib/store/createCollectionStore.test.ts
git commit -m "feat(store): methode replace (remplacement complet d'un enregistrement)"
```

---

### Task 2 : Édition pouvant vider un champ optionnel

**Files:**

- Modify: `web/src/features/crm/index.tsx`
- Modify: `web/src/features/crm/index.test.tsx`

- [ ] **Step 1 : Ajouter le test qui échoue**

Dans `web/src/features/crm/index.test.tsx`, ajouter ce test à la fin du `describe` (les imports `fireEvent`, `waitFor` sont déjà présents ; ajouter l'import du store en haut du fichier) :

En haut du fichier, après les imports existants, ajouter :

```tsx
import { contactsStore } from './store';
```

Puis le test :

```tsx
it('édition : vider un champ optionnel le supprime', async () => {
  render(<CrmPage />);
  fireEvent.click(screen.getByRole('button', { name: /Données de démo/ }));
  await waitFor(() =>
    expect(screen.getByText('Lucie Martin')).toBeInTheDocument(),
  );

  fireEvent.click(screen.getByText('Lucie Martin'));
  const champEmail = await screen.findByLabelText('Email');
  fireEvent.change(champEmail, { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

  await waitFor(async () => {
    const c = await contactsStore.get('c1');
    expect(c?.email).toBeUndefined();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "crm/index"`
Expected: FAIL (l'email reste renseigné car `update` fusionne).

- [ ] **Step 3 : Utiliser `replace` dans l'édition**

Dans `web/src/features/crm/index.tsx`, remplacer le bloc `if (contactEdite) { ... } else { ... }` de la fonction `enregistrer` par :

```tsx
if (contactEdite) {
  // Remplacement complet pour permettre de vider un champ optionnel.
  const complet: Omit<Contact, 'id'> = {
    ...requis,
    ...opts,
    source: contactEdite.source,
    dateCreation: contactEdite.dateCreation,
    dateDerniereInteraction: aujourdhui(),
  };
  if (contactEdite.prochaineRelance) {
    complet.prochaineRelance = contactEdite.prochaineRelance;
  }
  await contactsStore.replace(contactEdite.id, complet);
} else {
  await contactsStore.create({
    ...requis,
    ...opts,
    source: 'manuel',
    dateCreation: aujourdhui(),
    dateDerniereInteraction: aujourdhui(),
  });
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- "crm/index"`
Expected: PASS (4 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/crm/index.tsx web/src/features/crm/index.test.tsx
git commit -m "fix(crm): l'edition peut desormais vider un champ optionnel"
```

---

### Task 3 : Dépendance papaparse

**Files:**

- Modify: `web/package.json`

- [ ] **Step 1 : Installer**

Run:

```bash
npm install papaparse --workspace web
npm install -D @types/papaparse --workspace web
```

Expected: installation sans erreur. Noter les versions.

- [ ] **Step 2 : Vérifier**

Run: `npm run typecheck --workspace web`
Expected: PASS.

- [ ] **Step 3 : Commit**

```bash
git add web/package.json package-lock.json
git commit -m "chore(crm): ajout de papaparse pour l'import CSV"
```

---

### Task 4 : Fonction d'analyse du CSV

**Files:**

- Create: `web/src/features/crm/import.ts`
- Test: `web/src/features/crm/import.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/crm/import.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { parseContactsCsv } from './import';

describe('parseContactsCsv', () => {
  it('analyse les lignes valides', () => {
    const csv = [
      'prenom,nom,organisation,email',
      'Lucie,Martin,Mairie de Paris,lucie@paris.fr',
      'Karim,Benali,,karim@orange.fr',
    ].join('\n');
    const result = parseContactsCsv(csv);
    expect(result.valides).toHaveLength(2);
    expect(result.valides[0]).toMatchObject({
      prenom: 'Lucie',
      nom: 'Martin',
      organisation: 'Mairie de Paris',
      email: 'lucie@paris.fr',
    });
    // organisation vide -> champ absent
    expect(result.valides[1]!.organisation).toBeUndefined();
    expect(result.ignorees).toBe(0);
  });

  it('ignore les lignes sans prénom ou nom', () => {
    const csv = ['prenom,nom', 'Lucie,', ',Martin', 'Eva,Nguyen'].join('\n');
    const result = parseContactsCsv(csv);
    expect(result.valides).toHaveLength(1);
    expect(result.ignorees).toBe(2);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- "crm/import"`
Expected: FAIL.

- [ ] **Step 3 : Implémenter l'analyse**

Créer `web/src/features/crm/import.ts` :

```ts
import Papa from 'papaparse';

// Une ligne de contact issue d'un CSV (champs reconnus, en-tetes en minuscules).
export interface ImportRow {
  prenom: string;
  nom: string;
  organisation?: string;
  fonction?: string;
  email?: string;
  telephone?: string;
}

export interface ImportResult {
  valides: ImportRow[];
  ignorees: number;
}

function nettoyer(valeur: string | undefined): string {
  return (valeur ?? '').trim();
}

export function parseContactsCsv(texte: string): ImportResult {
  const { data } = Papa.parse<Record<string, string>>(texte, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const valides: ImportRow[] = [];
  let ignorees = 0;

  for (const ligne of data) {
    const prenom = nettoyer(ligne.prenom ?? ligne['prénom']);
    const nom = nettoyer(ligne.nom);
    if (!prenom || !nom) {
      ignorees += 1;
      continue;
    }
    const row: ImportRow = { prenom, nom };
    const organisation = nettoyer(ligne.organisation);
    if (organisation) row.organisation = organisation;
    const fonction = nettoyer(ligne.fonction);
    if (fonction) row.fonction = fonction;
    const email = nettoyer(ligne.email);
    if (email) row.email = email;
    const telephone = nettoyer(ligne.telephone ?? ligne['téléphone']);
    if (telephone) row.telephone = telephone;
    valides.push(row);
  }

  return { valides, ignorees };
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- "crm/import"`
Expected: PASS (2 tests).

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/crm/import.ts web/src/features/crm/import.test.ts
git commit -m "feat(crm): analyse d'un CSV de contacts (papaparse)"
```

---

### Task 5 : Panneau d'import et câblage

**Files:**

- Create: `web/src/features/crm/ContactImport.tsx`
- Test: `web/src/features/crm/ContactImport.test.tsx`
- Modify: `web/src/features/crm/index.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `web/src/features/crm/ContactImport.test.tsx` :

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactImport } from './ContactImport';

describe('ContactImport', () => {
  it('analyse un fichier CSV et importe les contacts', async () => {
    const onImport = vi.fn();
    render(<ContactImport open onClose={() => {}} onImport={onImport} />);

    const csv = 'prenom,nom,email\nLucie,Martin,lucie@paris.fr\n';
    const file = new File([csv], 'contacts.csv', { type: 'text/csv' });
    const input = screen.getByTestId('import-fichier');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByText(/1 contact/)).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /Importer/ }));
    expect(onImport).toHaveBeenCalledOnce();
    expect(onImport.mock.calls[0]![0]).toHaveLength(1);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier l'échec**

Run: `npm run test --workspace web -- ContactImport`
Expected: FAIL.

- [ ] **Step 3 : Implémenter le panneau**

Créer `web/src/features/crm/ContactImport.tsx` :

```tsx
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SidePanel } from '../../components/ui/SidePanel';
import { parseContactsCsv, type ImportRow } from './import';

export function ContactImport({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (rows: ImportRow[]) => void;
}) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [ignorees, setIgnorees] = useState(0);
  const [analyse, setAnalyse] = useState(false);

  function chargerFichier(fichier: File) {
    const lecteur = new FileReader();
    lecteur.onload = () => {
      const resultat = parseContactsCsv(String(lecteur.result));
      setRows(resultat.valides);
      setIgnorees(resultat.ignorees);
      setAnalyse(true);
    };
    lecteur.readAsText(fichier);
  }

  function reinitialiser() {
    setRows([]);
    setIgnorees(0);
    setAnalyse(false);
  }

  function fermer() {
    reinitialiser();
    onClose();
  }

  return (
    <SidePanel open={open} title="Importer des contacts" onClose={fermer}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-encre-2">
          Fichier CSV avec les colonnes : prenom, nom, organisation, fonction,
          email, telephone. Les colonnes prenom et nom sont obligatoires.
        </p>
        <input
          data-testid="import-fichier"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) chargerFichier(fichier);
          }}
          className="text-sm text-encre-2 file:mr-3 file:rounded-[10px] file:border file:border-trait-fort file:bg-papier file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-encre"
        />

        {analyse && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-encre">
              {rows.length} contact{rows.length > 1 ? 's' : ''} prêt
              {rows.length > 1 ? 's' : ''} à importer
              {ignorees > 0 && (
                <span className="text-encre-3">
                  {' '}
                  ({ignorees} ligne(s) ignorée(s))
                </span>
              )}
            </p>
            {rows.length > 0 && (
              <ul className="max-h-48 overflow-y-auto rounded-xl border border-trait bg-papier text-sm">
                {rows.slice(0, 8).map((row, i) => (
                  <li
                    key={i}
                    className="border-b border-trait px-3 py-2 last:border-0"
                  >
                    {row.prenom} {row.nom}
                    {row.organisation && (
                      <span className="text-encre-3">
                        {' '}
                        - {row.organisation}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Button
              variant="primary"
              disabled={rows.length === 0}
              onClick={() => {
                onImport(rows);
                reinitialiser();
              }}
            >
              Importer {rows.length} contact{rows.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
```

- [ ] **Step 4 : Lancer le test pour vérifier le succès**

Run: `npm run test --workspace web -- ContactImport`
Expected: PASS (1 test).

- [ ] **Step 5 : Câbler dans la page**

Dans `web/src/features/crm/index.tsx` :

1. Ajouter les imports en haut (après les imports de vues) :

```tsx
import { ContactImport } from './ContactImport';
import type { ImportRow } from './import';
```

2. Ajouter l'état, après `const [contactEdite, setContactEdite] = useState<Contact | null>(null);` :

```tsx
const [importOuvert, setImportOuvert] = useState(false);
```

3. Ajouter la fonction d'import, après la fonction `supprimer` :

```tsx
async function importer(rows: ImportRow[]) {
  for (const row of rows) {
    await contactsStore.create({
      ...row,
      badges: [],
      etape: 'a_contacter',
      source: 'import',
      dateCreation: aujourdhui(),
    });
  }
  setImportOuvert(false);
  rafraichir();
}
```

4. Dans les `actions` du `PageHeader`, ajouter un bouton "Importer" avant "Nouveau contact" :

```tsx
        actions={
          <>
            <DemoDataToggle store={contactsStore} onChange={rafraichir} />
            <Button variant="outline" onClick={() => setImportOuvert(true)}>
              Importer
            </Button>
            <Button variant="primary" onClick={ouvrirCreation}>
              Nouveau contact
            </Button>
          </>
        }
```

5. Ajouter le panneau d'import juste avant la balise fermante `</>` finale (après `<ContactFiche ... />`) :

```tsx
<ContactImport
  open={importOuvert}
  onClose={() => setImportOuvert(false)}
  onImport={importer}
/>
```

- [ ] **Step 6 : Vérifier**

Run: `npm run test --workspace web -- "crm/index"`
Expected: PASS (les tests existants restent verts).

- [ ] **Step 7 : Commit**

```bash
git add web/src/features/crm/ContactImport.tsx web/src/features/crm/ContactImport.test.tsx web/src/features/crm/index.tsx
git commit -m "feat(crm): import de contacts depuis un fichier CSV"
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

Run: `npm run dev --workspace web`, se connecter, aller sur CRM.
Vérifier :

- Éditer un contact, vider l'email, enregistrer : l'email est bien supprimé (rouvrir la fiche pour confirmer).
- Bouton "Importer" : choisir un CSV (prenom,nom,email...), voir l'aperçu et le nombre, importer, les contacts apparaissent.

- [ ] **Step 5 : Mettre à jour le statut du spec**

Dans `docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md`, ligne 4, remplacer le statut par :
`- Statut : coquille + module CRM complet (6 vues, import CSV) implémentés`

```bash
git add docs/superpowers/specs/2026-06-14-eloquetia-fondations-crm-design.md
git commit -m "docs: statut spec, module CRM complet"
```

---

## Self-review (couverture)

- Correctif « vider un champ optionnel » : Tasks 1 (store.replace) + 2 (édition via replace).
- Import CSV (7.7) : Tasks 3 (papaparse), 4 (analyse), 5 (panneau + câblage).
- Les leads créés à l'import ont la source `import`, l'étape `À contacter`, aucun badge par défaut.
