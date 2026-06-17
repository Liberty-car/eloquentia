# Eloquentia

Outil de pilotage interne de l'association Eloquentia (concours d'éloquence).
Back-office web pour une équipe restreinte.

Ce dépôt contient les **fondations** du projet : une base saine, outillée et
conventionnée, prête à recevoir les features. Aucune fonctionnalité métier n'est
encore implémentée.

## Stack

- **Frontend** (`web/`) : React 19, Vite, Tailwind v4, React Router v7, TypeScript strict.
- **Backend** (`server/`) : Node.js 20+, Express 5, Zod, Pino, Prisma 7, TypeScript strict.
- **Base de données** : PostgreSQL (cible prod : Supabase).
- **Tests** : Vitest (unitaire) + Playwright (e2e).
- **Qualité** : ESLint, Prettier, Husky + lint-staged (pre-commit).
- **Déploiement cible** : Vercel (web) + Railway (server) + Supabase (db).

Monorepo géré via **npm workspaces** (`web`, `server`).

## Prérequis

- Node.js 20 ou plus (testé avec Node 24). Voir `.nvmrc`.
- npm 10+.
- Un PostgreSQL accessible en local (Homebrew, ou `docker compose up -d`).

## Installation

```bash
# 1. Dépendances (racine + workspaces)
npm install

# 2. Variables d'environnement
cp server/.env.example server/.env   # backend + Prisma
cp web/.env.example    web/.env      # frontend
# Éditez server/.env (DATABASE_URL, JWT_SECRET, ...). Voir .env.example racine.

# 3. Client Prisma + base de données
npm run db:generate                  # génère le client Prisma
npm run db:migrate                   # crée la base + applique la 1ere migration
```

## Lancement (développement)

```bash
npm run dev          # lance le front (5173) et l'API (4000) en parallèle
npm run dev:web      # front uniquement
npm run dev:server   # API uniquement
```

Vérifier l'API : `curl http://localhost:4000/api/v1/health`

## Scripts utiles (depuis la racine)

| Commande                             | Description                            |
| ------------------------------------ | -------------------------------------- |
| `npm run dev`                        | Front + API en parallèle               |
| `npm run build`                      | Build server puis web                  |
| `npm run lint`                       | ESLint sur tout le dépôt               |
| `npm run format`                     | Prettier (écriture)                    |
| `npm run typecheck`                  | Vérification TypeScript (server + web) |
| `npm run test`                       | Tests Vitest (server + web)            |
| `npm run test:e2e`                   | Tests Playwright (web)                 |
| `npm run db:generate`                | Génère le client Prisma                |
| `npm run db:migrate`                 | Migration de dev                       |
| `npm run db:studio`                  | Prisma Studio                          |
| `npm run mint-token -- --role=ADMIN` | Génère un JWT de test (dev)            |

Première exécution des tests e2e : `cd web && npx playwright install`.

## Architecture (résumé)

- **Backend par module-domaine** : chaque module (`server/src/modules/<nom>`)
  contient ses couches `routes -> controller -> service -> repository -> prisma`.
  Le routeur racine `/api/v1` (`server/src/api/v1`) monte les modules.
  Seul le module `health` est actif ; les modules métier sont des stubs vides.
- **Frontend par feature** : un dossier par feature (`web/src/features/<nom>`),
  route placeholder neutre. Fetch natif (`web/src/lib/api`), jeton en mémoire
  (`web/src/lib/auth/tokenStore`), aucun state manager global.
- **Auth** : JWT Bearer, middlewares `authenticate` + `requireRole`, sans écran
  de login. Générez un jeton de test avec `npm run mint-token`.

Détails et conventions : voir `CLAUDE.md` et
`docs/superpowers/specs/2026-06-14-fondations-eloquentia-design.md`.

## Déploiement

- **Vercel (web)** : racine du projet = `web/`. `vercel.json` réécrit les routes
  vers `index.html` (SPA).
- **Railway (server)** : racine = `server/`. Build `npm run build`, start
  `npm start`, healthcheck `/api/v1/health`. Renseigner les variables d'env.
- **Supabase (db)** : renseigner `DATABASE_URL` (pooler 6543) et `DIRECT_URL`
  (5432) côté server. Appliquer les migrations avec `npm run db:deploy`.
