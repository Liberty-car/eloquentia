# Pièces jointes génériques — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre d'attacher des fichiers (sur Supabase Storage) à n'importe quelle entité de l'outil, branché d'abord sur les Tâches, Événements et Mouvements comptables.

**Architecture:** Un sous-système générique : table Prisma `Attachment` référençant l'entité par `(entityType, entityId)` (référence souple, sans clé étrangère) ; module backend `attachments` (routes → controller → service → repository → prisma) ; wrapper Supabase Storage isolé ; upload par URL signée (le navigateur envoie les octets directement à Supabase) ; composant frontend réutilisable `<PiecesJointes>` branché dans les fiches de détail.

**Tech Stack:** Express 5, Zod, Prisma 7 (+ `@prisma/adapter-pg`), `@supabase/supabase-js` (backend uniquement), React 19, Vitest.

**Spec de référence :** `docs/superpowers/specs/2026-06-17-pieces-jointes-design.md`

---

## Structure des fichiers

Backend (`server/`) :

- `src/config/env.ts` — MODIFIER : ajouter les 4 variables d'env Supabase/attachments.
- `src/services/supabase/storage.ts` — CRÉER : wrapper Supabase Storage isolé.
- `src/services/supabase/index.ts` — CRÉER : ré-export.
- `prisma/schema.prisma` — MODIFIER : modèle `Attachment` + relation inverse sur `User`.
- `src/modules/attachments/attachments.schemas.ts` — CRÉER : Zod + helpers purs (chemin, MIME).
- `src/modules/attachments/attachments.repository.ts` — CRÉER : accès Prisma.
- `src/modules/attachments/attachments.service.ts` — CRÉER : logique métier.
- `src/modules/attachments/attachments.controller.ts` — CRÉER : orchestration HTTP.
- `src/modules/attachments/attachments.routes.ts` — CRÉER : routes Express.
- `src/api/v1/index.ts` — MODIFIER : monter le routeur.
- `.env.example` (server) + `.env.example` racine — MODIFIER : documenter les variables.

Frontend (`web/`) :

- `src/features/attachments/types.ts` — CRÉER : types partagés.
- `src/features/attachments/attachmentsApi.ts` — CRÉER : appels API.
- `src/features/attachments/PiecesJointes.tsx` — CRÉER : composant réutilisable.
- `src/lib/auth/AuthContext.tsx` — MODIFIER : vrai JWT de dev via `VITE_DEV_TOKEN`.
- `src/features/calendar/TacheFiche.tsx` — MODIFIER : monter le composant.
- `src/features/calendar/EvenementFiche.tsx` — MODIFIER : monter le composant.
- `src/features/accounting/MouvementFiche.tsx` — MODIFIER : monter le composant.
- `web/.env.example` — MODIFIER : documenter `VITE_DEV_TOKEN`.

---

## Task 1 : Variables d'environnement (backend)

**Files:**

- Modify: `server/src/config/env.ts`
- Modify: `server/.env.example`
- Modify: `.env.example` (racine)

- [ ] **Step 1 : Ajouter les variables au schéma Zod**

Dans `server/src/config/env.ts`, ajouter dans l'objet `z.object({ ... })`, après `BREVO_API_KEY` :

```ts
  // Supabase Storage (pièces jointes). Requis pour le module attachments.
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('attachments'),
  // Taille max d'une pièce jointe en octets (défaut 25 Mo).
  ATTACHMENTS_MAX_BYTES: z.coerce.number().int().positive().default(26214400),
```

Note : `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont `optional()` pour ne pas
casser le démarrage en local sans Supabase. Le wrapper storage (Task 2) lèvera une
erreur claire à l'usage s'ils manquent (même pattern que Brevo).

- [ ] **Step 2 : Documenter dans les `.env.example`**

Dans `server/.env.example`, ajouter à la fin :

```
# Supabase Storage (pièces jointes)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=remplacez-moi
SUPABASE_STORAGE_BUCKET=attachments
ATTACHMENTS_MAX_BYTES=26214400
```

Ajouter les mêmes lignes (avec un commentaire) dans le `.env.example` racine, section serveur.

- [ ] **Step 3 : Vérifier que le serveur démarre toujours**

Run: `cd server && npx tsc --noEmit`
Expected: aucune erreur de type.

- [ ] **Step 4 : Commit**

```bash
git add server/src/config/env.ts server/.env.example .env.example
git commit -m "feat(attachments): variables d'env Supabase Storage"
```

---

## Task 2 : Wrapper Supabase Storage

**Files:**

- Create: `server/src/services/supabase/storage.ts`
- Create: `server/src/services/supabase/index.ts`
- Modify: `server/package.json` (dépendance)

- [ ] **Step 1 : Installer `@supabase/supabase-js`**

Run: `npm install @supabase/supabase-js --workspace server`
Expected: la dépendance apparaît dans `server/package.json`.

- [ ] **Step 2 : Écrire le wrapper**

Créer `server/src/services/supabase/storage.ts` :

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

// Service Supabase Storage ISOLÉ : seul endroit qui parle au SDK Supabase.
// La clé service-role reste côté serveur. Aucun usage métier ici.

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase non configuré : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.',
    );
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export interface SignedUpload {
  signedUrl: string; // URL absolue où le navigateur PUT le fichier
  token: string;
  path: string;
}

export async function createSignedUploadUrl(
  path: string,
): Promise<SignedUpload> {
  const { data, error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(`Échec createSignedUploadUrl : ${error?.message}`);
  }
  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}

export async function createSignedDownloadUrl(
  path: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { data, error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) {
    throw new Error(`Échec createSignedUrl : ${error?.message}`);
  }
  return data.signedUrl;
}

export async function removeObject(path: string): Promise<void> {
  const { error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .remove([path]);
  if (error) {
    throw new Error(`Échec remove : ${error.message}`);
  }
}
```

- [ ] **Step 3 : Ré-export**

Créer `server/src/services/supabase/index.ts` :

```ts
export * from './storage';
```

- [ ] **Step 4 : Vérifier les types**

Run: `cd server && npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 5 : Commit**

```bash
git add server/src/services/supabase server/package.json package-lock.json
git commit -m "feat(attachments): wrapper Supabase Storage isole"
```

---

## Task 3 : Modèle Prisma `Attachment` + migration

**Files:**

- Modify: `server/prisma/schema.prisma`

- [ ] **Step 1 : Ajouter le modèle et la relation inverse**

Dans `server/prisma/schema.prisma`, ajouter sur `model User` (dans la liste des relations) :

```prisma
  attachments   Attachment[]
```

Puis ajouter à la fin du fichier :

```prisma
// ---------------------------------------------------------------------------
// Pièces jointes (générique : référence souple vers n'importe quelle entité)
// ---------------------------------------------------------------------------

model Attachment {
  id           String   @id @default(cuid())
  entityType   String // "task" | "event" | "mouvement"
  entityId     String // id de l'entité (id localStorage pour l'instant)
  fileName     String
  mimeType     String
  sizeBytes    Int
  storagePath  String
  createdAt    DateTime @default(now())

  uploadedById String?
  uploadedBy   User?   @relation(fields: [uploadedById], references: [id], onDelete: SetNull)

  @@index([entityType, entityId])
  @@index([uploadedById])
  @@map("attachments")
}
```

- [ ] **Step 2 : Générer le client Prisma**

Run: `npm run db:generate`
Expected: le client est régénéré sans erreur (le type `Attachment` existe désormais).

- [ ] **Step 3 : Créer la migration**

Run: `npm run db:migrate -- --name add_attachments`
Expected: une migration `*_add_attachments` est créée et appliquée. (Nécessite `DATABASE_URL`/`DIRECT_URL` vers un Postgres accessible. Si la base n'est pas dispo, voir la note d'exécution en fin de plan.)

- [ ] **Step 4 : Commit**

```bash
git add server/prisma/schema.prisma server/prisma/migrations
git commit -m "feat(attachments): modele Prisma Attachment + migration"
```

---

## Task 4 : Schémas Zod + helpers purs

**Files:**

- Create: `server/src/modules/attachments/attachments.schemas.ts`
- Test: `server/src/modules/attachments/attachments.schemas.test.ts`

- [ ] **Step 1 : Écrire les tests des helpers purs**

Créer `server/src/modules/attachments/attachments.schemas.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import {
  ALLOWED_MIME_TYPES,
  buildStoragePath,
  sanitizeFileName,
  storagePathMatches,
} from './attachments.schemas';

describe('sanitizeFileName', () => {
  it('remplace les caractères dangereux par des tirets', () => {
    expect(sanitizeFileName('mon rapport (final)!.pdf')).toBe(
      'mon-rapport-final-.pdf',
    );
  });
  it('neutralise les tentatives de traversée de chemin', () => {
    expect(sanitizeFileName('../../etc/passwd')).toBe('etc-passwd');
  });
});

describe('buildStoragePath', () => {
  it('compose <type>/<id>/<cuid>-<nom>', () => {
    const path = buildStoragePath('task', 'abc', 'cuid123', 'photo.png');
    expect(path).toBe('task/abc/cuid123-photo.png');
  });
});

describe('storagePathMatches', () => {
  it('accepte un chemin avec le bon préfixe', () => {
    expect(storagePathMatches('task/abc/x-1.png', 'task', 'abc')).toBe(true);
  });
  it('refuse un chemin avec un mauvais préfixe', () => {
    expect(storagePathMatches('event/zzz/x-1.png', 'task', 'abc')).toBe(false);
  });
});

describe('ALLOWED_MIME_TYPES', () => {
  it('contient pdf et png mais pas exe', () => {
    expect(ALLOWED_MIME_TYPES).toContain('application/pdf');
    expect(ALLOWED_MIME_TYPES).toContain('image/png');
    expect(ALLOWED_MIME_TYPES).not.toContain('application/x-msdownload');
  });
});
```

- [ ] **Step 2 : Lancer le test (échec attendu)**

Run: `cd server && npx vitest run src/modules/attachments/attachments.schemas.test.ts`
Expected: FAIL (module introuvable).

- [ ] **Step 3 : Écrire les schémas et helpers**

Créer `server/src/modules/attachments/attachments.schemas.ts` :

```ts
import { z } from 'zod';
import { env } from '../../config/env';

// Liste fermée des types d'entités auxquelles on peut attacher un fichier.
export const ENTITY_TYPES = ['task', 'event', 'mouvement'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// Liste blanche des types MIME autorisés.
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'application/zip',
] as const;

const entityType = z.enum(ENTITY_TYPES);
const mimeType = z.enum(ALLOWED_MIME_TYPES);
const sizeBytes = z.number().int().positive().max(env.ATTACHMENTS_MAX_BYTES);
const fileName = z.string().min(1).max(255);

export const signBodySchema = z.object({
  entityType,
  entityId: z.string().min(1),
  fileName,
  mimeType,
  sizeBytes,
});

export const createBodySchema = signBodySchema.extend({
  storagePath: z.string().min(1),
});

export const listQuerySchema = z.object({
  entityType,
  entityId: z.string().min(1),
});

export const idParamsSchema = z.object({
  id: z.string().min(1),
});

// Helpers purs ------------------------------------------------------------

// Rend un nom de fichier sûr pour un chemin de stockage.
export function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  return base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+/, '');
}

// Compose le chemin de l'objet : <type>/<id>/<cuid>-<nom assaini>.
export function buildStoragePath(
  entityType: string,
  entityId: string,
  cuid: string,
  originalName: string,
): string {
  return `${entityType}/${entityId}/${cuid}-${sanitizeFileName(originalName)}`;
}

// Vérifie qu'un chemin appartient bien au préfixe attendu (anti-falsification).
export function storagePathMatches(
  storagePath: string,
  entityType: string,
  entityId: string,
): boolean {
  return storagePath.startsWith(`${entityType}/${entityId}/`);
}
```

- [ ] **Step 4 : Lancer le test (succès attendu)**

Run: `cd server && npx vitest run src/modules/attachments/attachments.schemas.test.ts`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add server/src/modules/attachments/attachments.schemas.ts server/src/modules/attachments/attachments.schemas.test.ts
git commit -m "feat(attachments): schemas Zod et helpers de chemin"
```

---

## Task 5 : Repository Prisma

**Files:**

- Create: `server/src/modules/attachments/attachments.repository.ts`

- [ ] **Step 1 : Écrire le repository**

Créer `server/src/modules/attachments/attachments.repository.ts` :

```ts
import { prisma } from '../../lib/prisma';
import type { EntityType } from './attachments.schemas';

export interface CreateAttachmentData {
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedById: string | null;
}

export const attachmentsRepository = {
  create(data: CreateAttachmentData) {
    return prisma.attachment.create({ data });
  },

  listByEntity(entityType: EntityType, entityId: string) {
    return prisma.attachment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
  },

  findById(id: string) {
    return prisma.attachment.findUnique({ where: { id } });
  },

  remove(id: string) {
    return prisma.attachment.delete({ where: { id } });
  },
};
```

- [ ] **Step 2 : Vérifier les types**

Run: `cd server && npx tsc --noEmit`
Expected: aucune erreur (le client Prisma de Task 3 expose `prisma.attachment`).

- [ ] **Step 3 : Commit**

```bash
git add server/src/modules/attachments/attachments.repository.ts
git commit -m "feat(attachments): repository Prisma"
```

---

## Task 6 : Service métier

**Files:**

- Create: `server/src/modules/attachments/attachments.service.ts`
- Test: `server/src/modules/attachments/attachments.service.test.ts`

- [ ] **Step 1 : Écrire les tests du service (storage + repo mockés)**

Créer `server/src/modules/attachments/attachments.service.test.ts` :

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./attachments.repository', () => ({
  attachmentsRepository: {
    create: vi.fn(),
    listByEntity: vi.fn(),
    findById: vi.fn(),
    remove: vi.fn(),
  },
}));
vi.mock('../../services/supabase', () => ({
  createSignedUploadUrl: vi.fn(),
  createSignedDownloadUrl: vi.fn(),
  removeObject: vi.fn(),
}));

import { attachmentsRepository } from './attachments.repository';
import {
  createSignedUploadUrl,
  createSignedDownloadUrl,
  removeObject,
} from '../../services/supabase';
import { attachmentsService } from './attachments.service';
import { ApiError } from '../../lib/ApiError';

const repo = vi.mocked(attachmentsRepository);
const signUp = vi.mocked(createSignedUploadUrl);
const signDown = vi.mocked(createSignedDownloadUrl);
const rm = vi.mocked(removeObject);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sign', () => {
  it('génère un chemin préfixé et renvoie l’URL signée', async () => {
    signUp.mockResolvedValue({
      signedUrl: 'https://x/upload',
      token: 'tok',
      path: 'task/abc/whatever',
    });
    const res = await attachmentsService.sign({
      entityType: 'task',
      entityId: 'abc',
      fileName: 'r.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 10,
    });
    expect(signUp).toHaveBeenCalledTimes(1);
    const pathArg = signUp.mock.calls[0][0];
    expect(pathArg.startsWith('task/abc/')).toBe(true);
    expect(res.storagePath).toBe(pathArg);
    expect(res.uploadUrl).toBe('https://x/upload');
  });
});

describe('create', () => {
  it('refuse un storagePath au mauvais préfixe', async () => {
    await expect(
      attachmentsService.create(
        {
          entityType: 'task',
          entityId: 'abc',
          fileName: 'r.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 10,
          storagePath: 'event/zzz/x-r.pdf',
        },
        'user1',
      ),
    ).rejects.toBeInstanceOf(ApiError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('persiste quand le préfixe est correct', async () => {
    repo.create.mockResolvedValue({ id: 'a1' } as never);
    await attachmentsService.create(
      {
        entityType: 'task',
        entityId: 'abc',
        fileName: 'r.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 10,
        storagePath: 'task/abc/x-r.pdf',
      },
      'user1',
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storagePath: 'task/abc/x-r.pdf',
        uploadedById: 'user1',
      }),
    );
  });
});

describe('getDownloadUrl', () => {
  it('404 si la pièce jointe est introuvable', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      attachmentsService.getDownloadUrl('nope'),
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe('remove', () => {
  it('interdit la suppression par un non-auteur non-admin', async () => {
    repo.findById.mockResolvedValue({
      id: 'a1',
      uploadedById: 'owner',
      storagePath: 'task/abc/x',
    } as never);
    await expect(
      attachmentsService.remove('a1', { id: 'someone', role: 'MEMBRE' }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(rm).not.toHaveBeenCalled();
  });

  it('autorise l’auteur et supprime objet + ligne', async () => {
    repo.findById.mockResolvedValue({
      id: 'a1',
      uploadedById: 'owner',
      storagePath: 'task/abc/x',
    } as never);
    await attachmentsService.remove('a1', { id: 'owner', role: 'MEMBRE' });
    expect(rm).toHaveBeenCalledWith('task/abc/x');
    expect(repo.remove).toHaveBeenCalledWith('a1');
  });
});
```

- [ ] **Step 2 : Lancer le test (échec attendu)**

Run: `cd server && npx vitest run src/modules/attachments/attachments.service.test.ts`
Expected: FAIL (service introuvable).

- [ ] **Step 3 : Écrire le service**

Créer `server/src/modules/attachments/attachments.service.ts` :

```ts
import { randomUUID } from 'node:crypto';
import { ApiError } from '../../lib/ApiError';
import {
  createSignedDownloadUrl,
  createSignedUploadUrl,
  removeObject,
} from '../../services/supabase';
import { attachmentsRepository } from './attachments.repository';
import {
  buildStoragePath,
  storagePathMatches,
  type EntityType,
} from './attachments.schemas';

interface SignInput {
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

interface CreateInput extends SignInput {
  storagePath: string;
}

interface CurrentUser {
  id: string;
  role: 'ADMIN' | 'MEMBRE';
}

export const attachmentsService = {
  async sign(input: SignInput) {
    const path = buildStoragePath(
      input.entityType,
      input.entityId,
      randomUUID(),
      input.fileName,
    );
    const signed = await createSignedUploadUrl(path);
    return {
      uploadUrl: signed.signedUrl,
      token: signed.token,
      storagePath: signed.path,
    };
  },

  async create(input: CreateInput, userId: string) {
    if (
      !storagePathMatches(input.storagePath, input.entityType, input.entityId)
    ) {
      throw ApiError.badRequest('Chemin de stockage incohérent');
    }
    return attachmentsRepository.create({
      entityType: input.entityType,
      entityId: input.entityId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      storagePath: input.storagePath,
      uploadedById: userId,
    });
  },

  list(entityType: EntityType, entityId: string) {
    return attachmentsRepository.listByEntity(entityType, entityId);
  },

  async getDownloadUrl(id: string) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Pièce jointe introuvable');
    const url = await createSignedDownloadUrl(found.storagePath);
    return { url };
  },

  async remove(id: string, user: CurrentUser) {
    const found = await attachmentsRepository.findById(id);
    if (!found) throw ApiError.notFound('Pièce jointe introuvable');
    const isOwner = found.uploadedById === user.id;
    if (!isOwner && user.role !== 'ADMIN') {
      throw ApiError.forbidden('Suppression réservée à l’auteur ou à un admin');
    }
    await removeObject(found.storagePath);
    await attachmentsRepository.remove(id);
  },
};
```

Note : `randomUUID()` (natif `node:crypto`) sert d'identifiant unique du fichier
dans le chemin de stockage. Aucune dépendance supplémentaire.

- [ ] **Step 4 : Lancer le test (succès attendu)**

Run: `cd server && npx vitest run src/modules/attachments/attachments.service.test.ts`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add server/src/modules/attachments/attachments.service.ts server/src/modules/attachments/attachments.service.test.ts
git commit -m "feat(attachments): service metier (sign, create, list, download, remove)"
```

---

## Task 7 : Controller + routes + montage

**Files:**

- Create: `server/src/modules/attachments/attachments.controller.ts`
- Create: `server/src/modules/attachments/attachments.routes.ts`
- Modify: `server/src/api/v1/index.ts`

- [ ] **Step 1 : Écrire le controller**

Créer `server/src/modules/attachments/attachments.controller.ts` :

```ts
import type { Request, Response } from 'express';
import { sendSuccess } from '../../lib/sendSuccess';
import { ApiError } from '../../lib/ApiError';
import { attachmentsService } from './attachments.service';
import type { EntityType } from './attachments.schemas';

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentification requise');
  return req.user;
}

export async function signUpload(req: Request, res: Response): Promise<void> {
  const result = await attachmentsService.sign(req.body);
  sendSuccess(res, result);
}

export async function createAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireUser(req);
  const created = await attachmentsService.create(req.body, user.id);
  sendSuccess(res, created, 201);
}

export async function listAttachments(
  req: Request,
  res: Response,
): Promise<void> {
  const { entityType, entityId } = req.query as {
    entityType: EntityType;
    entityId: string;
  };
  const items = await attachmentsService.list(entityType, entityId);
  sendSuccess(res, items);
}

export async function getDownloadUrl(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await attachmentsService.getDownloadUrl(req.params.id);
  sendSuccess(res, result);
}

export async function removeAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireUser(req);
  await attachmentsService.remove(req.params.id, user);
  sendSuccess(res, { deleted: true });
}
```

- [ ] **Step 2 : Écrire les routes**

Créer `server/src/modules/attachments/attachments.routes.ts` :

```ts
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import {
  createAttachment,
  getDownloadUrl,
  listAttachments,
  removeAttachment,
  signUpload,
} from './attachments.controller';
import {
  createBodySchema,
  idParamsSchema,
  listQuerySchema,
  signBodySchema,
} from './attachments.schemas';

// Module "attachments" : pièces jointes génériques. Toutes les routes exigent
// un jeton Bearer valide. Les octets ne transitent jamais par ce serveur :
// ils vont directement sur Supabase via une URL signée.
export const attachmentsRouter = Router();

attachmentsRouter.use(authenticate);

attachmentsRouter.post('/sign', validate({ body: signBodySchema }), signUpload);
attachmentsRouter.post(
  '/',
  validate({ body: createBodySchema }),
  createAttachment,
);
attachmentsRouter.get(
  '/',
  validate({ query: listQuerySchema }),
  listAttachments,
);
attachmentsRouter.get(
  '/:id/url',
  validate({ params: idParamsSchema }),
  getDownloadUrl,
);
attachmentsRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  removeAttachment,
);
```

- [ ] **Step 3 : Monter le routeur**

Dans `server/src/api/v1/index.ts`, ajouter l'import en haut :

```ts
import { attachmentsRouter } from '../../modules/attachments/attachments.routes';
```

et monter après la ligne `apiV1Router.use('/health', healthRouter);` :

```ts
apiV1Router.use('/attachments', attachmentsRouter);
```

- [ ] **Step 4 : Vérifier types + tests serveur**

Run: `cd server && npx tsc --noEmit && npx vitest run`
Expected: aucune erreur de type, tous les tests passent.

- [ ] **Step 5 : Commit**

```bash
git add server/src/modules/attachments/attachments.controller.ts server/src/modules/attachments/attachments.routes.ts server/src/api/v1/index.ts
git commit -m "feat(attachments): controller, routes et montage sous /api/v1/attachments"
```

---

## Task 8 : Client API frontend + types

**Files:**

- Create: `web/src/features/attachments/types.ts`
- Create: `web/src/features/attachments/attachmentsApi.ts`

- [ ] **Step 1 : Types partagés**

Créer `web/src/features/attachments/types.ts` :

```ts
export type EntityType = 'task' | 'event' | 'mouvement';

export interface Attachment {
  id: string;
  entityType: EntityType;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: string;
  uploadedBy: { id: string; name: string } | null;
}

export interface SignResponse {
  uploadUrl: string;
  token: string;
  storagePath: string;
}
```

- [ ] **Step 2 : Client API**

Créer `web/src/features/attachments/attachmentsApi.ts` :

```ts
import { apiFetch } from '../../lib/api/client';
import type { Attachment, EntityType, SignResponse } from './types';

interface Meta {
  entityType: EntityType;
  entityId: string;
}

// Upload complet : signe -> PUT direct vers Supabase -> persiste les métadonnées.
export async function uploadAttachment(
  meta: Meta,
  file: File,
): Promise<Attachment> {
  const signed = await apiFetch<SignResponse>('/attachments/sign', {
    method: 'POST',
    body: JSON.stringify({
      entityType: meta.entityType,
      entityId: meta.entityId,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    }),
  });

  // Le navigateur envoie les octets directement à Supabase (pas via apiFetch).
  const put = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'content-type': file.type },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`Échec de l'envoi du fichier (${put.status})`);
  }

  return apiFetch<Attachment>('/attachments', {
    method: 'POST',
    body: JSON.stringify({
      entityType: meta.entityType,
      entityId: meta.entityId,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      storagePath: signed.storagePath,
    }),
  });
}

export function listAttachments(meta: Meta): Promise<Attachment[]> {
  const qs = new URLSearchParams({
    entityType: meta.entityType,
    entityId: meta.entityId,
  });
  return apiFetch<Attachment[]>(`/attachments?${qs.toString()}`);
}

export async function openAttachment(id: string): Promise<void> {
  const { url } = await apiFetch<{ url: string }>(`/attachments/${id}/url`);
  window.open(url, '_blank', 'noopener');
}

export function deleteAttachment(id: string): Promise<{ deleted: boolean }> {
  return apiFetch<{ deleted: boolean }>(`/attachments/${id}`, {
    method: 'DELETE',
  });
}
```

- [ ] **Step 3 : Vérifier les types**

Run: `cd web && npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add web/src/features/attachments/types.ts web/src/features/attachments/attachmentsApi.ts
git commit -m "feat(attachments): client API et types frontend"
```

---

## Task 9 : Composant `<PiecesJointes>`

**Files:**

- Create: `web/src/features/attachments/PiecesJointes.tsx`
- Test: `web/src/features/attachments/PiecesJointes.test.tsx`

- [ ] **Step 1 : Écrire le test (api mockée)**

Créer `web/src/features/attachments/PiecesJointes.test.tsx` :

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('./attachmentsApi', () => ({
  listAttachments: vi.fn(),
  uploadAttachment: vi.fn(),
  openAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
}));

import { listAttachments } from './attachmentsApi';
import { PiecesJointes } from './PiecesJointes';

const list = vi.mocked(listAttachments);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PiecesJointes', () => {
  it('affiche les pièces jointes listées', async () => {
    list.mockResolvedValue([
      {
        id: 'a1',
        entityType: 'task',
        entityId: 'abc',
        fileName: 'rapport.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048,
        storagePath: 'task/abc/x-rapport.pdf',
        createdAt: '2026-06-17T10:00:00.000Z',
        uploadedBy: { id: 'u1', name: 'Luciano' },
      },
    ]);
    render(<PiecesJointes entityType="task" entityId="abc" />);
    await waitFor(() =>
      expect(screen.getByText('rapport.pdf')).toBeInTheDocument(),
    );
  });

  it('affiche un état vide quand il n’y a aucune pièce jointe', async () => {
    list.mockResolvedValue([]);
    render(<PiecesJointes entityType="task" entityId="abc" />);
    await waitFor(() =>
      expect(screen.getByText(/aucune pièce jointe/i)).toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 2 : Lancer le test (échec attendu)**

Run: `cd web && npx vitest run src/features/attachments/PiecesJointes.test.tsx`
Expected: FAIL (composant introuvable).

- [ ] **Step 3 : Écrire le composant**

Créer `web/src/features/attachments/PiecesJointes.tsx` :

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import {
  deleteAttachment,
  listAttachments,
  openAttachment,
  uploadAttachment,
} from './attachmentsApi';
import type { Attachment, EntityType } from './types';

function formatTaille(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function PiecesJointes({
  entityType,
  entityId,
}: {
  entityType: EntityType;
  entityId: string;
}) {
  const [items, setItems] = useState<Attachment[]>([]);
  const [chargement, setChargement] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rafraichir = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      setItems(await listAttachments({ entityType, entityId }));
    } catch {
      setErreur('Impossible de charger les pièces jointes.');
    } finally {
      setChargement(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    void rafraichir();
  }, [rafraichir]);

  async function onFichier(file: File | undefined) {
    if (!file) return;
    setEnvoi(true);
    setErreur(null);
    try {
      await uploadAttachment({ entityType, entityId }, file);
      await rafraichir();
    } catch {
      setErreur(`Échec de l'envoi de « ${file.name} ».`);
    } finally {
      setEnvoi(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function onSupprimer(id: string) {
    setErreur(null);
    try {
      await deleteAttachment(id);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setErreur('Échec de la suppression.');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-encre">
          <Paperclip size={14} /> Pièces jointes
        </span>
        <Button
          type="button"
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={envoi}
        >
          <Upload size={14} /> {envoi ? 'Envoi…' : 'Ajouter'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => void onFichier(e.target.files?.[0])}
        />
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      {chargement ? (
        <p className="text-sm text-encre-3">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-encre-3">Aucune pièce jointe.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-projecteur/40 px-3 py-2 text-sm"
            >
              <button
                type="button"
                className="truncate text-left text-encre hover:underline"
                onClick={() => void openAttachment(a.id)}
              >
                {a.fileName}
              </button>
              <span className="ml-2 flex items-center gap-2 text-encre-3">
                {formatTaille(a.sizeBytes)}
                <button
                  type="button"
                  aria-label={`Supprimer ${a.fileName}`}
                  onClick={() => void onSupprimer(a.id)}
                  className="text-encre-3 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Note : vérifier les imports `Button` (chemin `../../components/ui/Button`) et les
classes de couleur (`text-encre`, `text-encre-3`, `border-projecteur`) qui sont
celles déjà utilisées dans le projet (cf. `TacheFiche.tsx`). Adapter si un nom de
classe diffère.

- [ ] **Step 4 : Lancer le test (succès attendu)**

Run: `cd web && npx vitest run src/features/attachments/PiecesJointes.test.tsx`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/attachments/PiecesJointes.tsx web/src/features/attachments/PiecesJointes.test.tsx
git commit -m "feat(attachments): composant reutilisable PiecesJointes"
```

---

## Task 10 : Vrai JWT de dev (`VITE_DEV_TOKEN`)

**Files:**

- Modify: `web/src/lib/auth/AuthContext.tsx`
- Modify: `web/.env.example`

Contexte : aujourd'hui `login()` pose un jeton `'factice'` que le backend rejette.
Pour tester la chaîne sans construire de vrai écran de login, on permet d'injecter
un JWT réel (issu de `npm run mint-token`) via une variable d'env de build.

- [ ] **Step 1 : Lire le vrai jeton si présent**

Dans `web/src/lib/auth/AuthContext.tsx`, remplacer le corps de `login` :

```ts
      login: (email: string) => {
        // Jeton EN MEMOIRE seulement. En dev, on peut injecter un vrai JWT
        // (issu de `npm run mint-token`) via VITE_DEV_TOKEN pour que les appels
        // backend authentifiés (ex. pièces jointes) fonctionnent. Sinon, jeton
        // factice : l'app locale (localStorage) reste utilisable, mais les
        // routes backend renverront 401.
        const devToken = import.meta.env.VITE_DEV_TOKEN as string | undefined;
        tokenStore.set(devToken && devToken.length > 0 ? devToken : 'factice');
        setUser({ email });
      },
```

- [ ] **Step 2 : Documenter la variable**

Dans `web/.env.example`, ajouter :

```
# JWT de dev pour tester les routes backend authentifiées (pièces jointes).
# Générer : npm run mint-token -- --id=dev --role=ADMIN --hours=24
VITE_DEV_TOKEN=
```

- [ ] **Step 3 : Vérifier types + test existant d'auth**

Run: `cd web && npx tsc --noEmit && npx vitest run src/features/auth`
Expected: aucune erreur, les tests d'auth existants passent toujours.

- [ ] **Step 4 : Commit**

```bash
git add web/src/lib/auth/AuthContext.tsx web/.env.example
git commit -m "feat(attachments): injection d'un vrai JWT de dev via VITE_DEV_TOKEN"
```

---

## Task 11 : Brancher le composant dans les 3 fiches

**Files:**

- Modify: `web/src/features/calendar/TacheFiche.tsx`
- Modify: `web/src/features/calendar/EvenementFiche.tsx`
- Modify: `web/src/features/accounting/MouvementFiche.tsx`

Principe commun : afficher `<PiecesJointes>` seulement pour une entité **déjà
enregistrée** (qui a un `id`). Sur une fiche de création (entité `null`), on ne
l'affiche pas (rien à quoi rattacher le fichier).

- [ ] **Step 1 : TacheFiche**

Dans `web/src/features/calendar/TacheFiche.tsx`, ajouter l'import en haut :

```ts
import { PiecesJointes } from '../attachments/PiecesJointes';
```

Puis, dans le JSX du `SidePanel`, juste avant les boutons de pied de fiche
(après le champ description), insérer :

```tsx
{
  tache?.id && (
    <div className="border-t border-projecteur/40 pt-4">
      <PiecesJointes entityType="task" entityId={tache.id} />
    </div>
  );
}
```

- [ ] **Step 2 : EvenementFiche**

Dans `web/src/features/calendar/EvenementFiche.tsx`, ajouter l'import :

```ts
import { PiecesJointes } from '../attachments/PiecesJointes';
```

Puis insérer avant les boutons de pied de fiche :

```tsx
{
  evenement?.id && (
    <div className="border-t border-projecteur/40 pt-4">
      <PiecesJointes entityType="event" entityId={evenement.id} />
    </div>
  );
}
```

- [ ] **Step 3 : MouvementFiche**

Dans `web/src/features/accounting/MouvementFiche.tsx`, ajouter l'import :

```ts
import { PiecesJointes } from '../attachments/PiecesJointes';
```

Puis insérer avant les boutons de pied de fiche :

```tsx
{
  mouvement?.id && (
    <div className="border-t border-projecteur/40 pt-4">
      <PiecesJointes entityType="mouvement" entityId={mouvement.id} />
    </div>
  );
}
```

- [ ] **Step 4 : Vérifier types + tests des fiches**

Run: `cd web && npx tsc --noEmit && npx vitest run src/features/calendar src/features/accounting`
Expected: aucune erreur, les tests existants passent.

- [ ] **Step 5 : Commit**

```bash
git add web/src/features/calendar/TacheFiche.tsx web/src/features/calendar/EvenementFiche.tsx web/src/features/accounting/MouvementFiche.tsx
git commit -m "feat(attachments): brancher PiecesJointes sur taches, evenements et mouvements"
```

---

## Task 12 : Vérification globale + recette manuelle

**Files:** aucun (vérification).

- [ ] **Step 1 : Qualité globale**

Run (depuis la racine) : `npm run lint && npm run typecheck && npm run test`
Expected: tout passe.

- [ ] **Step 2 : Pré-requis Supabase (manuel, côté utilisateur)**

- Créer un bucket **privé** `attachments` dans le projet Supabase.
- Renseigner `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
  dans `server/.env`, et `DATABASE_URL`/`DIRECT_URL` vers le Postgres Supabase.
- Appliquer la migration : `npm run db:migrate` (ou `npm run db:deploy` en prod).
- Générer un jeton : `npm run mint-token -- --id=dev --role=ADMIN --hours=24` et le
  coller dans `web/.env` sous `VITE_DEV_TOKEN=`.

- [ ] **Step 3 : Recette manuelle (e2e)**

- `npm run dev`, se connecter (page de login), aller dans Calendrier.
- Ouvrir une tâche **existante** : la section « Pièces jointes » apparaît.
- Ajouter un PDF (< 25 Mo) : il apparaît dans la liste.
- Cliquer sur le nom : le fichier s'ouvre (URL signée).
- Supprimer : il disparaît de la liste (et de Supabase).
- Refaire le même test sur un événement existant et un mouvement comptable existant.
- Vérifier qu'un fichier non autorisé (ex. `.exe`) est refusé (message d'erreur).

- [ ] **Step 4 : Commit éventuel de derniers ajustements**

```bash
git add -A && git commit -m "chore(attachments): ajustements de recette"
```

---

## Notes d'exécution

- **Sans accès Supabase/DB :** Tasks 1, 2, 4–11 sont entièrement réalisables et
  testables (tests unitaires avec mocks). Seules la migration réelle (Task 3,
  step 3) et la recette e2e (Task 12) exigent un Postgres et un bucket Supabase
  accessibles. Si la base n'est pas dispo au moment du dev, faire `npm run db:generate`
  (qui ne nécessite pas de connexion) pour obtenir les types, et différer
  `db:migrate` jusqu'à ce que la connexion soit en place.
- **API Supabase signed upload :** le composant frontend fait un `PUT` direct sur
  `signedUrl`. Si la version de `@supabase/supabase-js` renvoie un `signedUrl`
  relatif, le préfixer côté wrapper avec `${env.SUPABASE_URL}/storage/v1`. Le test
  e2e (Task 12) lève immédiatement ce cas s'il se présente.
- **Limite multi-navigateur connue :** les entités hôtes (tâches/événements/
  mouvements) vivent encore en localStorage ; une pièce jointe n'est donc visible
  que là où l'entité existe. Voir le spec, section « Incohérence connue et acceptée ».
