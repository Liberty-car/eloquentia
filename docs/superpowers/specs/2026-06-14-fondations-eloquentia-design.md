# Fondations Eloquentia — Cadrage

Date : 2026-06-14. Statut : validé.

## Objectif

Poser une codebase propre, **vide** et bien architecturée pour l'outil de
pilotage interne de l'association Eloquentia (concours d'éloquence). Aucune
feature, page, écran ni choix esthétique à ce stade : uniquement des fondations
saines, outillées et conventionnées.

## Décisions validées

1. **Monorepo** : npm workspaces (`web`, `server`).
2. **Schéma Prisma 7** : riche et relationnel, couvrant les 6 domaines.
3. **BDD locale** : Postgres local (Homebrew) ; `docker-compose.yml` optionnel ;
   format Supabase documenté (`url` poolé + `directUrl`).
4. **Auth** : `User` en base + enum `Role` (ADMIN/MEMBRE), JWT Bearer, sans login.
5. **Couches (option A)** : modules métier créés mais **vides** (4 fichiers de
   couche + TODO, non montés en live). Un seul module vivant : `health`
   (`GET /api/v1/health`), sans BDD, référence du pattern de réponse.

## Stack

React 19 + Vite + Tailwind v4 + React Router v7 (TS strict) /
Node 20+ + Express 5 + Zod + Pino + Prisma 7 (TS strict) / PostgreSQL (Supabase).
Tests : Vitest + Playwright. Qualité : ESLint + Prettier + Husky/lint-staged.
Déploiement : Vercel (web) + Railway (server) + Supabase (db).

## Idiomes vérifiés (context7)

- Tailwind v4 : `@tailwindcss/vite` + `@import "tailwindcss";`, sans config JS.
- React Router v7 : mode librairie (`createBrowserRouter` + `RouterProvider`).
- Prisma 7 : generator `prisma-client` (output explicite) + driver adapter
  **obligatoire** (`@prisma/adapter-pg`) ; `datasource` `url` + `directUrl`.
- Express 5 : propagation native des erreurs async.

## Architecture

Backend par **module-domaine** (couches `routes -> controller -> service ->
repository -> prisma` internes), routeur racine `/api/v1`. Helpers
`sendSuccess` / `ApiError`, middleware `validate(zod)`, `authenticate`,
`requireRole`, `errorHandler`. Frontend : un dossier par feature (vide, route
placeholder neutre), fetch natif, `tokenStore` en mémoire (jamais localStorage),
Tailwind importé brut (zéro design).

## Schéma Prisma

`User` ──< `Task` (assignee), `Interaction` (auteur), `Event` (createdBy).
`Partner` ──< `Contact` ──< `Interaction`. `Juror` ──< `EventJuror` >── `Event`
──< `Task`. `EmailCampaign` autonome (`brevoId`). Enums : `Role`,
`PartnerStatus`, `InteractionType`, `TaskStatus`, `TaskPriority`, `EventStatus`,
`CampaignStatus`. `Cascade` sur enfants forts, `SetNull` sur liens souples.

## Hors périmètre

Aucune feature/UI/design. Pas de mobile, Socket.io, Redis, PostGIS, Stripe, R2.

## Conventions

TS strict (pas de `any` injustifié), français accentué partout, jamais de tiret
cadratin, couches respectées, validation Zod systématique, commits conventionnels
atomiques.
