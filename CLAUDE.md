# CLAUDE.md

Guide pour travailler dans ce depot (lu par Claude Code et l'equipe).
A mettre a jour une fois la V1 de l'outil de pilotage construite.

## Contexte

Outil de pilotage interne de l'association Eloquentia (concours d'eloquence).
Back-office web, equipe restreinte. Domaines a venir : CRM partenariats,
annuaire jury, calendrier des evenements, gestion des taches, email marketing
(Brevo), dashboard.

Etat actuel : **fondations uniquement**. Aucune feature metier implementee. Les
modules backend et les features frontend existent en stubs vides, prets a etre
remplis.

## Stack

- Frontend (`web/`) : React 19, Vite, Tailwind v4, React Router v7 (mode
  librairie), TypeScript strict. Fetch natif, pas de state manager global.
- Backend (`server/`) : Node.js 20+, Express 5, Zod, Pino, Prisma 7,
  TypeScript strict.
- BDD : PostgreSQL (prod : Supabase). Acces via Prisma + driver adapter
  `@prisma/adapter-pg` (obligatoire en Prisma 7).
- Tests : Vitest (unitaire), Playwright (e2e).
- Qualite : ESLint 9 (flat config), Prettier, Husky + lint-staged.
- Monorepo : npm workspaces (`web`, `server`).

## Commandes (depuis la racine)

- `npm install` : installe tout le monorepo.
- `npm run dev` : front (5173) + API (4000) en parallele.
- `npm run build` : build server puis web.
- `npm run lint` / `npm run lint:fix` : ESLint.
- `npm run format` / `npm run format:check` : Prettier.
- `npm run typecheck` : verification TypeScript (server + web).
- `npm run test` : Vitest (server + web). `npm run test:e2e` : Playwright.
- `npm run db:generate` : genere le client Prisma (obligatoire avant typecheck/build).
- `npm run db:migrate` : migration de dev. `npm run db:studio` : Prisma Studio.
- `npm run mint-token -- --id=dev --role=ADMIN --hours=24` : JWT de test (dev).

Environnement : `cp server/.env.example server/.env` et
`cp web/.env.example web/.env`. Le `.env.example` racine documente tout.

## Architecture

### Backend : couches strictes par module

Organisation par **module-domaine** dans `server/src/modules/<nom>/`. Chaque
module respecte la chaine de couches, du plus externe au plus interne :

```
routes -> controller -> service -> repository -> prisma
```

- `*.routes.ts` : definition des routes Express, branche les middlewares
  (`validate`, `authenticate`, `requireRole`) et delegue au controller.
- `*.controller.ts` : orchestration requete/reponse. Utilise `sendSuccess` et
  peut lever `ApiError`. Ne contient pas de logique metier.
- `*.service.ts` : logique metier, independante d'Express.
- `*.repository.ts` : SEULE couche autorisee a importer `prisma`
  (`server/src/lib/prisma`). Aucun acces Prisma ailleurs.

Le routeur racine `server/src/api/v1/index.ts` monte les modules sous `/api/v1`.
Pour activer un module : definir ses routes, puis le monter dans ce routeur.
Module de reference (actif, sans BDD) : `modules/health`.

Briques transverses :

- `lib/sendSuccess.ts` : reponse `{ success: true, data }`.
- `lib/ApiError.ts` : erreurs applicatives (`ApiError.badRequest(...)`, etc.).
- `middleware/errorHandler.ts` : transforme erreurs et `ZodError` en
  `{ success: false, error: { message, code?, details? } }`. Reste en dernier.
- `middleware/validate.ts` : `validate({ body?, query?, params? })` avec Zod.
  Note Express 5 : `req.query`/`req.params` sont en lecture seule (non reassignes).
- `middleware/authenticate.ts` + `requireRole.ts` : JWT Bearer, roles ADMIN/MEMBRE.
- `config/env.ts` : variables d'env validees par Zod (l'app refuse de demarrer
  si invalide). `config/logger.ts` : Pino.
- `services/brevo/` : wrapper Brevo isole (cle en env), sans usage metier.

### Frontend : un dossier par feature

- `web/src/features/<nom>/index.tsx` : page placeholder neutre par feature.
- `web/src/router.tsx` : `createBrowserRouter` (React Router v7, mode librairie).
- `web/src/lib/api/client.ts` : `apiFetch` (fetch natif), ajoute le Bearer.
- `web/src/lib/auth/tokenStore.ts` : jeton EN MEMOIRE uniquement. JAMAIS de
  localStorage/sessionStorage.
- `web/src/index.css` : `@import "tailwindcss";` (Tailwind v4, sans config JS).

## Conventions

- TypeScript strict partout. Pas de `any` non justifie (commenter si necessaire).
- Francais correct avec accents partout (UI future, commentaires, messages).
- JAMAIS de tiret cadratin (em dash). Utiliser un trait d'union ou reformuler.
- Respecter les couches backend. La validation Zod est systematique sur les
  routes metier (via `validate`).
- Reponses API toujours via `sendSuccess` / `ApiError` (format coherent).
- Le jeton front vit uniquement en memoire (`tokenStore`).
- Commits conventionnels et atomiques (`feat:`, `fix:`, `chore:`, `docs:`...).
- Avant de commit : `npm run lint`, `npm run typecheck`, `npm run test` doivent
  passer (lint-staged s'execute aussi en pre-commit).

## Prisma 7 (points d'attention)

- Generator `prisma-client` (et non `prisma-client-js`), output explicite vers
  `server/src/generated/prisma` (gitignore, regenere via `npm run db:generate`).
- Driver adapter OBLIGATOIRE : `PrismaClient` est instancie avec
  `new PrismaPg({ connectionString })` dans `lib/prisma.ts`.
- `datasource` : `url` (runtime, pooler en prod) + `directUrl` (migrations).
- Lancer `npm run db:generate` apres tout changement de schema, et avant
  `typecheck`/`build` (le client genere doit exister).

## A faire ensuite (pistes)

Construire les features une par une (chaque feature = schema Zod + couches
backend + route montee + dossier frontend), en commencant par exemple par le
CRM partenariats. Cette section sera reecrite a la V1.
