# Pièces jointes génériques (fichiers sur les tâches, événements, compta)

Date : 2026-06-17
Branche de travail : `feat/fondations-crm`
Statut : conçu, en attente de relecture utilisateur

## Objectif

Permettre d'ajouter des fichiers et pièces jointes aux entités de l'outil
(tâches, événements, mouvements comptables dans cette première itération, puis
n'importe quelle entité ensuite), via un **sous-système unique et générique**
plutôt qu'une implémentation par feature.

C'est le **premier module backend réellement connecté** du projet (jusqu'ici
l'app tourne entièrement en `localStorage`, les modules backend sont des stubs
vides et la base n'est pas utilisée à l'exécution).

## Contexte et contrainte d'architecture

État actuel constaté :

- Les données métier (tâches, événements, mouvements comptables) vivent dans le
  `localStorage` de chaque navigateur, via `web/src/lib/store/createCollectionStore.ts`
  (IDs générés côté client).
- Les modules backend (`tasks`, `events`, `partners`...) existent mais sont des
  stubs non montés. Seul `health` est actif.
- La base PostgreSQL/Prisma existe (schéma défini) mais n'est pas connectée à
  l'app en cours d'exécution.

Décision produit (validée) : les fichiers sont stockés sur **Supabase Storage**
(et non en localStorage), dans l'optique d'un déploiement Vercel et d'un usage
partagé entre les membres de l'équipe.

**Incohérence connue et acceptée** : tant que les entités hôtes restent en
localStorage, un fichier (partagé via Supabase) reste rattaché à une entité qui,
elle, n'est pas partagée entre navigateurs. Concrètement, le membre B ne voit pas
la tâche créée par A (locale à son navigateur), donc ne voit pas non plus sa
pièce jointe. C'est attendu : la migration des entités vers la base est un
chantier séparé, hors périmètre ici. Le sous-système est conçu pour rester
valable après cette migration (référence par `(type, id)`).

## Approche retenue

Un sous-système de pièces jointes **générique** :

- une table `Attachment` qui référence n'importe quelle entité par un couple
  `(entityType, entityId)` (référence souple, sans clé étrangère) ;
- un module backend `attachments` respectant la chaîne de couches du projet ;
- un wrapper Supabase Storage isolé (clé en env), sur le modèle du wrapper Brevo ;
- un upload par **URL signée** (le navigateur envoie les octets directement à
  Supabase ; le backend signe et enregistre les métadonnées) ;
- un composant frontend réutilisable, branché en quelques lignes sur chaque
  feature.

Périmètre de cette itération : Tâches, Événements, Compta (mouvements).

## Modèle de données

Ajout au schéma Prisma (`server/prisma/schema.prisma`) :

```prisma
model Attachment {
  id           String   @id @default(cuid())
  entityType   String   // "task" | "event" | "mouvement"
  entityId     String   // id de l'entité (id localStorage pour l'instant)
  fileName     String   // nom d'origine du fichier
  mimeType     String
  sizeBytes    Int
  storagePath  String   // chemin de l'objet dans le bucket Supabase
  uploadedById String?
  uploadedBy   User?    @relation(fields: [uploadedById], references: [id], onDelete: SetNull)
  createdAt    DateTime @default(now())

  @@index([entityType, entityId])
  @@map("attachments")
}
```

- Relation inverse à ajouter sur `model User` : `attachments Attachment[]`.
- Pas de clé étrangère vers Task/Event/Mouvement (ils ne sont pas en base).
- `@@index([entityType, entityId])` pour le listing rapide par entité.
- `entityType` validé côté backend contre une liste fermée (Zod enum) pour
  éviter les valeurs arbitraires.

Première migration Prisma réelle du projet (`npm run db:migrate`), nécessitant un
`DATABASE_URL` vers un vrai Postgres (Supabase ou local).

## Contrat d'API (`/api/v1/attachments`)

Toutes les routes : `authenticate` (JWT Bearer) + validation Zod systématique.
Réponses via `sendSuccess` / `ApiError`.

1. `POST /attachments/sign`
   - Body : `{ entityType, entityId, fileName, mimeType, sizeBytes }`
   - Valide le type MIME (liste blanche) et la taille (<= max configuré).
   - Choisit un chemin `"<entityType>/<entityId>/<cuid>-<nomAssaini>.<ext>"`.
   - Demande à Supabase une URL d'upload signée
     (`storage.from(bucket).createSignedUploadUrl(path)`).
   - Renvoie `{ uploadUrl, token, storagePath }`.

2. `POST /attachments`
   - Body : `{ entityType, entityId, fileName, mimeType, sizeBytes, storagePath }`
   - Vérifie que `storagePath` correspond bien au préfixe `(entityType, entityId)`
     attendu (anti-falsification).
   - Crée la ligne `Attachment` (avec `uploadedById` = utilisateur courant).
   - Renvoie l'attachment créé.

3. `GET /attachments?entityType=...&entityId=...`
   - Liste les pièces jointes d'une entité, triées par `createdAt` desc.

4. `GET /attachments/:id/url`
   - Renvoie une URL de téléchargement signée courte durée
     (`createSignedUrl(path, ttl)`). Le bucket reste **privé**.

5. `DELETE /attachments/:id`
   - Autorisé à l'auteur (`uploadedById`) ou à un `ADMIN`.
   - Supprime l'objet Supabase puis la ligne en base.

## Flux d'upload (navigateur)

1. L'utilisateur sélectionne / dépose un fichier dans `<PiecesJointes>`.
2. Le composant appelle `POST /attachments/sign` (via `apiFetch`).
3. Le composant **PUT** le fichier directement sur `uploadUrl` (fetch natif,
   pas via `apiFetch` car ce n'est pas du JSON et la cible est Supabase).
4. En cas de succès, le composant appelle `POST /attachments` pour persister les
   métadonnées, puis rafraîchit la liste.
5. Si l'étape 3 échoue, aucune ligne n'est créée (pas d'orphelin en base).

## Contraintes de fichiers (validées)

- **Taille max** : 25 Mo par fichier, via env `ATTACHMENTS_MAX_BYTES`
  (défaut 26214400).
- **Types MIME autorisés** (liste blanche) :
  - Images : `image/png`, `image/jpeg`, `image/webp`, `image/gif`
  - Documents : `application/pdf`
  - Office :
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - Données / texte : `text/csv`, `text/plain`
  - Archives : `application/zip`
- Tout autre type est refusé (400).

## Découpage backend

Module `server/src/modules/attachments/` :

- `attachments.routes.ts` : routes Express + `validate` (Zod) + `authenticate`
  - `requireRole` au besoin ; délègue au controller. Monté dans
    `server/src/api/v1/index.ts` sous `/api/v1/attachments`.
- `attachments.controller.ts` : orchestration requête/réponse (`sendSuccess`,
  `ApiError`). Pas de logique métier.
- `attachments.service.ts` : logique métier (génération de chemin, garde
  taille/type, vérif de préfixe, autorisation de suppression). Appelle le
  wrapper Supabase et le repository.
- `attachments.repository.ts` : SEULE couche important `prisma` (CRUD
  `Attachment`).
- `attachments.schemas.ts` : schémas Zod (body/query/params) + enum
  `entityType` + liste blanche MIME.

Brique transverse :

- `server/src/services/supabase/storage.ts` : wrapper isolé autour de
  `@supabase/supabase-js` (client service-role), exposant
  `createSignedUploadUrl`, `createSignedDownloadUrl`, `remove`. Clé en env.
- `server/src/config/env.ts` : ajouter `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `ATTACHMENTS_MAX_BYTES`
  (validation Zod, l'app refuse de démarrer si invalide).

## Découpage frontend

`web/src/features/attachments/` :

- `PiecesJointes.tsx` : composant réutilisable
  `<PiecesJointes entityType={...} entityId={...} />`. Affiche la liste
  (nom, taille, date, auteur), un bouton « Ajouter » + glisser-déposer simple,
  un lien « Ouvrir » (récupère l'URL signée à la demande) et un bouton
  supprimer. Gère les états vide / chargement / erreur.
- `attachmentsApi.ts` : `signUpload`, `confirmUpload`, `list`, `getDownloadUrl`,
  `remove`. Les appels JSON passent par `apiFetch` ; le PUT binaire utilise
  `fetch` natif vers Supabase.
- `types.ts` : types partagés (`Attachment`, `EntityType`).

Branchement dans le détail (vue dépliée) de :

- Tâches (`web/src/features/calendar` / tasks UI)
- Événements
- Mouvements comptables (`web/src/features/accounting`)

Le jeton reste en mémoire (`tokenStore`, comportement existant). En dev, obtenu
via `npm run mint-token -- --id=dev --role=ADMIN --hours=24`.

## Pré-requis infra (utilisateur)

- Un projet Supabase + un bucket **privé** nommé `attachments`.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET=attachments`
  dans `server/.env` (et documentés dans `.env.example`).
- `DATABASE_URL` vers un vrai Postgres pour lancer la première migration.

## Tests

- Vitest (service) : génération de chemin, garde taille, garde type MIME,
  vérif de préfixe `storagePath`, autorisation de suppression — avec wrapper
  Supabase et repository mockés.
- Vitest (composant) : `<PiecesJointes>` avec `attachmentsApi` mockée (liste,
  ajout, suppression, états d'erreur).

## Hors périmètre

- Migration des tâches / événements / mouvements vers la base (référence souple
  conservée).
- Vrai écran de login / flux d'authentification utilisateur (on s'appuie sur le
  JWT existant et `mint-token` en dev).
- Aperçus / miniatures d'images avancés, versionnage de fichiers,
  prévisualisation inline.
- Nettoyage automatique des objets orphelins (upload réussi mais confirmation
  jamais appelée) : à considérer plus tard si besoin.

## Critères de réussite

- Depuis le détail d'une tâche, d'un événement et d'un mouvement comptable, on
  peut ajouter un fichier (<= 25 Mo, type autorisé), le voir listé, l'ouvrir via
  une URL signée, et le supprimer.
- Les octets transitent du navigateur directement vers Supabase (pas par le
  serveur Node).
- `npm run lint`, `npm run typecheck`, `npm run test` passent.
- Le bucket reste privé (aucun accès public direct aux objets).
