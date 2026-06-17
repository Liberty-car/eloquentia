# CLAUDE.md

Guide pour travailler dans ce dépôt (lu par Claude Code et l'équipe).
À mettre à jour une fois la V1 de l'outil de pilotage construite.

## Contexte

Outil de pilotage interne de l'association Eloquentia (concours d'éloquence).
Back-office web, équipe restreinte. Domaines à venir : CRM partenariats,
annuaire jury, calendrier des événements, gestion des tâches, email marketing
(Brevo), dashboard.

État actuel : **fondations uniquement**. Aucune feature métier implémentée. Les
modules backend et les features frontend existent en stubs vides, prêts à être
remplis.

## Stack

- Frontend (`web/`) : React 19, Vite, Tailwind v4, React Router v7 (mode
  librairie), TypeScript strict. Fetch natif, pas de state manager global.
- Backend (`server/`) : Node.js 20+, Express 5, Zod, Pino, Prisma 7,
  TypeScript strict.
- BDD : PostgreSQL (prod : Supabase). Accès via Prisma + driver adapter
  `@prisma/adapter-pg` (obligatoire en Prisma 7).
- Tests : Vitest (unitaire), Playwright (e2e).
- Qualité : ESLint 9 (flat config), Prettier, Husky + lint-staged.
- Monorepo : npm workspaces (`web`, `server`).

## Commandes (depuis la racine)

- `npm install` : installe tout le monorepo.
- `npm run dev` : front (5173) + API (4000) en parallèle.
- `npm run build` : build server puis web.
- `npm run lint` / `npm run lint:fix` : ESLint.
- `npm run format` / `npm run format:check` : Prettier.
- `npm run typecheck` : vérification TypeScript (server + web).
- `npm run test` : Vitest (server + web). `npm run test:e2e` : Playwright.
- `npm run db:generate` : génère le client Prisma (obligatoire avant typecheck/build).
- `npm run db:migrate` : migration de dev. `npm run db:studio` : Prisma Studio.
- `npm run mint-token -- --id=dev --role=ADMIN --hours=24` : JWT de test (dev).

Environnement : `cp server/.env.example server/.env` et
`cp web/.env.example web/.env`. Le `.env.example` racine documente tout.

## Architecture

### Backend : couches strictes par module

Organisation par **module-domaine** dans `server/src/modules/<nom>/`. Chaque
module respecte la chaîne de couches, du plus externe au plus interne :

```
routes -> controller -> service -> repository -> prisma
```

- `*.routes.ts` : définition des routes Express, branche les middlewares
  (`validate`, `authenticate`, `requireRole`) et délègue au controller.
- `*.controller.ts` : orchestration requête/réponse. Utilise `sendSuccess` et
  peut lever `ApiError`. Ne contient pas de logique métier.
- `*.service.ts` : logique métier, indépendante d'Express.
- `*.repository.ts` : SEULE couche autorisée à importer `prisma`
  (`server/src/lib/prisma`). Aucun accès Prisma ailleurs.

Le routeur racine `server/src/api/v1/index.ts` monte les modules sous `/api/v1`.
Pour activer un module : définir ses routes, puis le monter dans ce routeur.
Module de référence (actif, sans BDD) : `modules/health`.

Briques transverses :

- `lib/sendSuccess.ts` : réponse `{ success: true, data }`.
- `lib/ApiError.ts` : erreurs applicatives (`ApiError.badRequest(...)`, etc.).
- `middleware/errorHandler.ts` : transforme erreurs et `ZodError` en
  `{ success: false, error: { message, code?, details? } }`. Reste en dernier.
- `middleware/validate.ts` : `validate({ body?, query?, params? })` avec Zod.
  Note Express 5 : `req.query`/`req.params` sont en lecture seule (non réassignés).
- `middleware/authenticate.ts` + `requireRole.ts` : JWT Bearer, rôles ADMIN/MEMBRE.
- `config/env.ts` : variables d'env validées par Zod (l'app refuse de démarrer
  si invalide). `config/logger.ts` : Pino.
- `services/brevo/` : wrapper Brevo isolé (clé en env), sans usage métier.

### Frontend : un dossier par feature

- `web/src/features/<nom>/index.tsx` : page placeholder neutre par feature.
- `web/src/router.tsx` : `createBrowserRouter` (React Router v7, mode librairie).
- `web/src/lib/api/client.ts` : `apiFetch` (fetch natif), ajoute le Bearer.
- `web/src/lib/auth/tokenStore.ts` : jeton EN MÉMOIRE uniquement. JAMAIS de
  localStorage/sessionStorage.
- `web/src/index.css` : `@import "tailwindcss";` (Tailwind v4, sans config JS).

## Conventions

- TypeScript strict partout. Pas de `any` non justifié (commenter si nécessaire).
- Français correct avec accents partout (UI future, commentaires, messages).
- JAMAIS de tiret cadratin (em dash). Utiliser un trait d'union ou reformuler.
- Respecter les couches backend. La validation Zod est systématique sur les
  routes métier (via `validate`).
- Réponses API toujours via `sendSuccess` / `ApiError` (format cohérent).
- Le jeton front vit uniquement en mémoire (`tokenStore`).
- Commits conventionnels et atomiques (`feat:`, `fix:`, `chore:`, `docs:`...).
- Avant de commit : `npm run lint`, `npm run typecheck`, `npm run test` doivent
  passer (lint-staged s'exécute aussi en pre-commit).

## Prisma 7 (points d'attention)

- Generator `prisma-client` (et non `prisma-client-js`), output explicite vers
  `server/src/generated/prisma` (gitignoré, régénéré via `npm run db:generate`).
- Driver adapter OBLIGATOIRE : `PrismaClient` est instancié avec
  `new PrismaPg({ connectionString })` dans `lib/prisma.ts`.
- URLs de connexion dans `prisma.config.ts` (et non dans le schéma) :
  `datasource.url` = DIRECT_URL pour les migrations ; le runtime se connecte
  via le driver adapter avec DATABASE_URL (pooler en prod Supabase).
- Lancer `npm run db:generate` après tout changement de schéma, et avant
  `typecheck`/`build` (le client généré doit exister).

## À faire ensuite (pistes)

Construire les features une par une (chaque feature = schéma Zod + couches
backend + route montée + dossier frontend), en commençant par exemple par le
CRM partenariats. Cette section sera réécrite à la V1.
