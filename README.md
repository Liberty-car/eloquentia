# Eloquentia

Outil de pilotage interne de l'association Eloquentia (concours d'eloquence).
Back-office web pour une equipe restreinte.

Ce depot contient les **fondations** du projet : une base saine, outillee et
conventionnee, prete a recevoir les features. Aucune fonctionnalite metier n'est
encore implementee.

## Stack

- **Frontend** (`web/`) : React 19, Vite, Tailwind v4, React Router v7, TypeScript strict.
- **Backend** (`server/`) : Node.js 20+, Express 5, Zod, Pino, Prisma 7, TypeScript strict.
- **Base de donnees** : PostgreSQL (cible prod : Supabase).
- **Tests** : Vitest (unitaire) + Playwright (e2e).
- **Qualite** : ESLint, Prettier, Husky + lint-staged (pre-commit).
- **Deploiement cible** : Vercel (web) + Railway (server) + Supabase (db).

Monorepo gere via **npm workspaces** (`web`, `server`).

## Prerequis

- Node.js 20 ou plus (teste avec Node 24). Voir `.nvmrc`.
- npm 10+.
- Un PostgreSQL accessible en local (Homebrew, ou `docker compose up -d`).

## Installation

```bash
# 1. Dependances (racine + workspaces)
npm install

# 2. Variables d'environnement
cp server/.env.example server/.env   # backend + Prisma
cp web/.env.example    web/.env      # frontend
# Editez server/.env (DATABASE_URL, JWT_SECRET, ...). Voir .env.example racine.

# 3. Client Prisma + base de donnees
npm run db:generate                  # genere le client Prisma
npm run db:migrate                   # cree la base + applique la 1ere migration
```

## Lancement (developpement)

```bash
npm run dev          # lance le front (5173) et l'API (4000) en parallele
npm run dev:web      # front uniquement
npm run dev:server   # API uniquement
```

Verifier l'API : `curl http://localhost:4000/api/v1/health`

## Scripts utiles (depuis la racine)

| Commande                             | Description                            |
| ------------------------------------ | -------------------------------------- |
| `npm run dev`                        | Front + API en parallele               |
| `npm run build`                      | Build server puis web                  |
| `npm run lint`                       | ESLint sur tout le depot               |
| `npm run format`                     | Prettier (ecriture)                    |
| `npm run typecheck`                  | Verification TypeScript (server + web) |
| `npm run test`                       | Tests Vitest (server + web)            |
| `npm run test:e2e`                   | Tests Playwright (web)                 |
| `npm run db:generate`                | Genere le client Prisma                |
| `npm run db:migrate`                 | Migration de dev                       |
| `npm run db:studio`                  | Prisma Studio                          |
| `npm run mint-token -- --role=ADMIN` | Genere un JWT de test (dev)            |

Premiere execution des tests e2e : `cd web && npx playwright install`.

## Architecture (resume)

- **Backend par module-domaine** : chaque module (`server/src/modules/<nom>`)
  contient ses couches `routes -> controller -> service -> repository -> prisma`.
  Le routeur racine `/api/v1` (`server/src/api/v1`) monte les modules.
  Seul le module `health` est actif ; les modules metier sont des stubs vides.
- **Frontend par feature** : un dossier par feature (`web/src/features/<nom>`),
  route placeholder neutre. Fetch natif (`web/src/lib/api`), jeton en memoire
  (`web/src/lib/auth/tokenStore`), aucun state manager global.
- **Auth** : JWT Bearer, middlewares `authenticate` + `requireRole`, sans ecran
  de login. Generez un jeton de test avec `npm run mint-token`.

Details et conventions : voir `CLAUDE.md` et
`docs/superpowers/specs/2026-06-14-fondations-eloquentia-design.md`.

## Deploiement

- **Vercel (web)** : racine du projet = `web/`. `vercel.json` reecrit les routes
  vers `index.html` (SPA).
- **Railway (server)** : racine = `server/`. Build `npm run build`, start
  `npm start`, healthcheck `/api/v1/health`. Renseigner les variables d'env.
- **Supabase (db)** : renseigner `DATABASE_URL` (pooler 6543) et `DIRECT_URL`
  (5432) cote server. Appliquer les migrations avec `npm run db:deploy`.
