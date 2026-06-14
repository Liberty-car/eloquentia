# Eloquetia : spec fondations + design system + CRM (premier cycle)

- Date : 2026-06-14
- Statut : coquille + CRM complet + Calendrier complet + Comptabilité complète (liste/fiche, tableau de bord réel, prévisionnel cumulé jusqu'à juil. 2028, export CSV compatible Excel) implémentés. Suivi compta non bloquant : extraire KpiCard partagé, tests d'invariant montant positif, sous-totaux réel/prévisionnel dans la liste. Mail et Accueil restants.
- Auteur : Anthony + Claude

## 1. Contexte et objectif

Eloquetia est l'outil de pilotage interne de l'association Eloquentia (concours
d'éloquence). Équipe restreinte (Luciano, Eva, Armelle, Anthony). L'outil
regroupera, à terme, cinq domaines : Accueil, CRM, Calendrier/Todo/Événements,
Mail marketing, Comptabilité.

Ce spec couvre le **premier cycle** : les fondations partagées (design system +
architecture front + couche de données factices), la **coquille commune** (login,
navigation, layout) et le **module CRM** en détail. Les quatre autres modules
sont décrits en une section chacun comme cycles à venir, chacun fera l'objet de
son propre spec.

### Phase de test (cadrage produit)

Aucun outil externe n'est branché pour l'instant : pas de backend, pas de base de
données, pas de Brevo. L'outil fonctionne **entièrement côté front** avec des
données factices stockées localement. Tout est conçu pour être rebranché plus
tard sur l'API (`server/`) sans réécrire les écrans.

## 2. Périmètre

### Dans ce spec

- Design system complet (tokens, typographie, composants signature).
- Architecture front du prototype (couche de données swappable, login factice).
- Réorganisation des stubs existants vers 5 onglets.
- Coquille commune (login + layout + navigation).
- Module CRM détaillé.

### Hors de ce spec (cycles à venir, voir section 8)

- Accueil (dashboard de synthèse).
- Calendrier + Todo + Événements.
- Mail marketing.
- Comptabilité.
- Tout branchement backend / Prisma / Brevo / auth réelle.

## 3. Intentions (interface-design : Intent First)

**Pour qui ?** Les membres de l'association, entre deux réunions ou le soir. Ce
ne sont pas des power-users ni des designers. Ils ouvrent l'outil pour faire un
geste précis (relancer un partenaire, cocher une tâche, vérifier un budget) puis
le referment. Ils ont besoin de clarté immédiate et de saisie rapide.

**Que doivent-ils accomplir ?** Faire avancer la prospection des partenaires
(déplacer un contact dans le pipeline), assigner et suivre des tâches, voir ce
qui arrive dans le calendrier, envoyer des emails, tenir les comptes et projeter
le budget jusqu'à la fin de saison (juillet 2028).

**Quel ressenti ?** L'univers de l'éloquence : la scène, la prise de parole, la
lumière des projecteurs. Chaleureux, lumineux, encourageant, mais sobre et
efficace (c'est un back-office). L'outil doit mettre en valeur sans crier.

## 4. Direction design

### 4.1 Ancrage domaine

La palette imposée (blanc dominant + rose pastel + jaune) est lue à travers
l'univers du concours, ce qui justifie chaque couleur :

- **Blanc** : la page, la fiche, le discours écrit, le pupitre. Surface
  dominante.
- **Jaune** (`#F5DF4D`, `#FFD777`) : la lumière des projecteurs, l'or des
  trophées. Sert d'accent et de contour, jamais de fond massif ni de texte.
- **Rose** (`#DB6A8F`, `#CA3C66`, `#E8AABE`) : les gels d'éclairage de scène, le
  velours du rideau. Couleur d'action et d'emphase.

L'ancrage sert de rationnel et à nommer les tokens. Il **n'introduit aucune
couleur ou décoration supplémentaire**. Sobriété maximale validée : pas de halo
ni de gradient décoratif.

### 4.2 Palette et tokens

Tokens CSS (définis dans `web/src/index.css` via `@theme` Tailwind v4). Noms
ancrés dans le domaine.

Surfaces et texte :

- `--papier` : `#FFFFFF` (cartes, surfaces principales)
- `--scene` : `#FBFAF8` (fond de page, blanc très légèrement chaud)
- `--encre` : `#1F2937` (texte principal)
- `--encre-2` : `#6B7280` (texte secondaire)
- `--encre-3` : `#9CA3AF` (méta, captions)
- `--encre-4` : `#C4C8CF` (placeholder, désactivé)

Accents :

- `--gel-rose` : `#DB6A8F` (CTA primaire, liens, action)
- `--velours` : `#CA3C66` (emphase, hover du CTA, texte sur fond rose pâle)
- `--rose-voile` : `#E8AABE` (dégradés d'avatar, surfaces rose douces)
- `--projecteur` : `#F5DF4D` (contour des cartes, accents jaunes)
- `--projecteur-doux` : `#FFD777` (jaune secondaire)

Brumes (fonds de badges/tuiles, très pâles) :

- `--rose-brume` : `#FBE6EC`
- `--jaune-brume` : `#FFF6D9`

Bordures :

- `--trait` : `rgba(31,41,55,0.08)` (hairline standard)
- `--trait-fort` : `rgba(31,41,55,0.14)` (emphase)
- `--contour-carte` : `#F5DF4D` (signature des cartes)
- `--focus` : `#DB6A8F` (anneau de focus)

Sémantiques (ajout nécessaire pour les états, tons chauds et désaturés pour
rester cohérents avec la palette) :

- `--succes` : `#2F9E6E`
- `--alerte` : `#E0A23B` (ambre, distinct du jaune projecteur)
- `--erreur` : `#DB5566`

Règle de couleur (interface-design) : le gris/blanc structure, la couleur
communique. Un seul accent d'action (rose). Le jaune ne porte jamais de texte
(contraste insuffisant) : uniquement contours, fonds de badge dilués, pastilles.

### 4.3 Typographie

Famille unique : **Plus Jakarta Sans** (auto-hébergée via `@fontsource`).
Chaleureuse, lisible, non générique, présente dans nos refs (folk).

Échelle (combinaison taille + graisse + tracking, pas la taille seule) :

- Titre de page : 28-32px / 800 / tracking -0.01em
- Titre de section : 18-20px / 700
- Titre de carte, nom de contact : 14px / 600
- Corps : 14px / 400, line-height 1.5
- Label, méta : 12-13px / 500
- Micro (badges) : 11-12px / 600, parfois majuscules + tracking 0.04em
- Valeur KPI : 28-32px / 800, `font-variant-numeric: tabular-nums`
- Chiffres compta : toujours `tabular-nums` pour l'alignement des colonnes

### 4.4 Profondeur, rayons, espacement

**Stratégie de profondeur (une seule, on s'y tient) : bordures.** La séparation
vient du trait (hairline + contour jaune signature), pas de l'ombre. Les ombres
sont réservées aux éléments réellement flottants (dropdowns, panneau latéral,
modales) sous forme d'ombre douce multi-couches. Les surfaces se distinguent par
de légers décalages de teinte chaude, jamais par des sauts d'élévation marqués.
La sidebar partage le fond du canvas, séparée par un simple trait (pas de couleur
de fond différente).

**Rayons** : inputs et boutons 10px, cartes 12px, modales et panneau latéral
16px, pills (badges) plein.

**Espacement** : base 4px stricte. Échelle {4, 8, 12, 16, 24, 32, 48}.

- Padding de carte : 16px
- Bouton : 8px vertical x 14px horizontal, hauteur 36px
- Gap icône-label : 6px
- Entre champs de formulaire : 16px
- Entre sections : 24-32px
- Largeur sidebar : 248px
- Gouttières de contenu : 24-32px

### 4.5 Composants signature

- **Carte** : fond `--papier`, bordure 2px `--contour-carte` (jaune), rayon 12px,
  ombre quasi nulle. C'est la signature visuelle de l'outil.
- **Badge / pill** : pastille ronde 8px colorée + label 11-12px / 600, fond brume
  (rose ou jaune), rayon plein, hauteur environ 20px. Encode une catégorie ou un
  statut.
- **Bouton** : 3 variantes. `primary` (fond `--gel-rose`, texte blanc, hover
  `--velours`), `outline` (fond blanc, bordure `--trait-fort`, variante par
  défaut), `ghost` (transparent, fond au survol). Hauteur 36px, rayon 10px,
  transition couleur 200ms, `active` 50ms (réactivité au clic).
- **Input / champ** : fond blanc légèrement inset, bordure `--trait`, rayon 10px,
  focus = bordure `--focus` + anneau. Label `--encre-3` 12px au-dessus.
- **Liste / table** : pas de zebra. Séparateurs hairline 1px. Lignes denses
  (32-40px). En-tête sticky possible.
- **Avatar** : cercle, dégradé `--rose-voile` vers `--gel-rose`, initiales
  blanches 600.
- **Colonne Kanban** : conteneur léger, en-tête (titre 600 + badge compteur),
  pile de cartes avec gap 8-12px.
- **Panneau latéral (fiche détail)** : glisse depuis la droite, en-tête
  titre+actions, corps scrollable, séparateurs hairline, ombre overlay. Z-index
  dédié élevé. Privilégié à la modale centrée pour l'édition d'un enregistrement.
- **États obligatoires** partout : default, hover, active, focus, disabled, et
  pour les données : loading, empty (avec message + action), error.

Iconographie : un seul jeu d'icônes (Lucide, léger et React-friendly). Une icône
qui n'ajoute pas de sens est retirée.

## 5. Architecture front (phase test)

### 5.1 Principe

Prototype 100% front dans `web/`. `server/` reste intact. Toute la logique de
données passe par une couche d'abstraction dont les signatures imitent un futur
appel API, pour un remplacement ultérieur sans toucher aux écrans.

### 5.2 Couche de données

`web/src/lib/store/` : une fabrique de store de collection, générique, adossée à
localStorage, avec des méthodes **asynchrones** (Promises) pour être
signature-compatible avec un futur `apiFetch`.

```
createCollectionStore<T>(namespace, seeder) => {
  list(): Promise<T[]>
  get(id): Promise<T | null>
  create(data): Promise<T>
  update(id, patch): Promise<T>
  remove(id): Promise<void>
  seed(): Promise<void>     // injecte les 20 donnees de demo
  clear(): Promise<void>    // vide la collection
  isSeeded(): Promise<boolean>
}
```

- Clés localStorage namespacées : `eloquetia:crm:contacts`,
  `eloquetia:calendar:events`, etc.
- Quand le backend arrivera, on remplacera l'implémentation interne par des
  appels `apiFetch` sans changer les signatures ni les composants.

### 5.3 Bouton "Données de démo"

- Un composant `DemoDataToggle` présent **par onglet** (CRM, Calendrier, Mail,
  Compta). ON appelle `seed()` (20 entrées cohérentes), OFF appelle `clear()`.
- Flag persistant par module : `eloquetia:crm:demo = true|false`.
- L'utilisateur peut ensuite éditer/ajouter/supprimer à la main : ces
  modifications persistent dans localStorage.
- **Contraintes des données de démo** :
  - Données concrètes (contacts, todos, événements, achats/revenus réels) :
    dates **<= 30 septembre 2026**.
  - Seul le **prévisionnel** comptable projette jusqu'au **31 juillet 2028** (fin
    de saison), et uniquement dans l'onglet Comptabilité.
  - Membres pour l'assignation : Luciano, Eva, Armelle, Anthony.

### 5.4 Login factice

- Route `/login`, formulaire (email + mot de passe) sans vérification réelle.
- À la soumission : création d'une session **en mémoire** (contexte React).
- **Le jeton/session ne va JAMAIS dans localStorage ni sessionStorage** (règle
  CLAUDE.md : jeton en mémoire uniquement via `tokenStore`). Au rechargement de
  la page, on repasse par `/login` : comportement accepté en phase factice.
- Distinction importante : localStorage stocke **uniquement les données métier de
  démo**, jamais l'authentification.

### 5.5 Remap des stubs existants vers 5 onglets

Les dossiers `features/` et le `router.tsx` actuels sont réorganisés :

| Onglet         | Route           | Origine des stubs                                                    |
| -------------- | --------------- | -------------------------------------------------------------------- |
| Accueil        | `/`             | `features/dashboard`                                                 |
| CRM            | `/crm`          | fusion `features/partners` + `features/jury` (deviennent des badges) |
| Calendrier     | `/calendrier`   | fusion `features/events` + `features/tasks`                          |
| Mail marketing | `/mail`         | `features/emailing`                                                  |
| Comptabilité   | `/comptabilite` | nouveau `features/accounting`                                        |

Le routeur (`createBrowserRouter`) est mis à jour : `/login` hors layout, les 5
onglets dans `RootLayout`. Les dossiers obsolètes sont supprimés ou renommés.

### 5.6 Dépendances à ajouter

- `@fontsource/plus-jakarta-sans` (typographie auto-hébergée)
- `lucide-react` (icônes)
- `recharts` (KPIs, utilisé dans Accueil et Comptabilité)
- `@dnd-kit/core` (drag and drop du Kanban CRM)
- À introduire au cycle Comptabilité : `papaparse` (import CSV) et une lib
  d'export `.xlsx` (SheetJS / `xlsx`). L'import CSV du CRM peut commencer avec
  `papaparse` dès ce cycle.

## 6. Coquille commune (premier livrable)

1. **Design system** : tokens dans `index.css` (`@theme`), police chargée,
   primitives partagées dans `web/src/components/ui/` (Button, Badge, Card,
   Input, Avatar, SidePanel, EmptyState, etc.).
2. **Login factice** : écran `/login` minimal et soigné.
3. **Layout** : `RootLayout` avec sidebar 248px (5 onglets, item actif marqué par
   fond crème + texte foncé, sans halo), en-tête de page (titre + actions), zone
   de contenu.
4. **Couche de données** : `createCollectionStore` + `DemoDataToggle`.
5. **Navigation** : routeur à jour avec les 5 routes.

Objectif de fin de coquille : naviguer entre 5 pages cohérentes visuellement, se
"connecter", activer/désactiver des données de démo (mécanique prête, branchée
réellement au CRM dès le module suivant).

## 7. Module CRM (détaillé)

### 7.1 Modèle Contact

```
Contact {
  id: string
  prenom: string
  nom: string
  organisation?: string        // structure (mairie, entreprise, ecole...)
  fonction?: string            // role dans l'organisation
  email?: string
  telephone?: string
  badges: BadgeId[]            // plusieurs possibles
  etape: Etape                 // position dans le pipeline (vue Kanban)
  notes?: string
  source: 'manuel' | 'import' | 'formulaire'
  dateCreation: string         // ISO, <= 2026-09-30
  dateDerniereInteraction?: string  // ISO, <= 2026-09-30
  prochaineRelance?: string    // ISO, optionnel
}
```

### 7.2 Badges (catégories)

Plusieurs badges par contact. Liste de départ (éditable) :
`Partenaire`, `Jury`, `Participant`, `Bénévole`, `Intervenant`, `Lead`.
Chaque badge a une couleur de pastille. Servent au filtrage et à la coloration
des cartes. (Les leads issus du formulaire Mail marketing arriveront avec le
badge `Lead` et l'étape `À contacter`, au cycle Mail marketing.)

### 7.3 Étapes du pipeline (colonnes Kanban)

`À contacter` -> `Contacté` -> `En discussion` -> `Conclu` -> `Perdu`.
Le Kanban groupe par étape ; déplacer une carte change son étape (drag and drop).

### 7.4 Vues

- **Kanban** (par défaut) : colonnes = étapes, cartes contact déplaçables.
- **Liste** : table dense, colonnes (nom, organisation, badges, étape, dernière
  interaction), tri et recherche.
- Bascule Kanban/Liste dans l'en-tête. Barre de recherche + filtres par badge
  (multi-sélection) et par étape, communs aux deux vues.

### 7.5 Carte contact

Avatar (initiales, dégradé rose) + nom (14px/600) + organisation (`--encre-3`),
ligne de badges, et 1-2 métas (dernière interaction, prochaine relance). Clic =
ouverture de la **fiche** en panneau latéral.

### 7.6 Fiche contact (panneau latéral)

Glisse depuis la droite. Affiche et édite tous les champs. Actions : enregistrer,
supprimer, changer d'étape, ajouter/retirer des badges. Sauvegarde via le store.

### 7.7 Création et import

- **Création manuelle** : bouton "Nouveau contact" -> formulaire (même panneau
  latéral, mode création).
- **Import de liste** : bouton "Importer", upload CSV, parsing `papaparse`,
  mapping des colonnes (prénom, nom, email, organisation...), aperçu avant
  validation, création en masse via le store (source `import`).

### 7.8 Données de démo CRM

20 contacts fictifs réalistes (associations, mairies, entreprises, écoles,
médias...), badges variés (plusieurs par contact), répartis sur les 5 étapes,
dates <= 30 septembre 2026, en français avec accents.

### 7.9 États

Empty (aucun contact : message + bouton "Activer les données de démo" / "Nouveau
contact"), loading (lecture du store), error (échec localStorage).

## 8. Modules à venir (cycles suivants, un spec chacun)

- **Accueil** : tableau de synthèse de tout **sauf la comptabilité** (prochains
  événements, todos du jour par membre, derniers contacts/leads, raccourcis).
  Réutilise les stores des autres modules. KPIs non financiers via Recharts.
- **Calendrier + Todo + Événements** : vue Mois par défaut, todos reliés aux 4
  membres (statut, échéance), événements affichés sur les jours. Chaque événement
  peut porter un budget prévisionnel **dont les montants ne sont JAMAIS visibles
  ici** (uniquement dans l'onglet Comptabilité). 20 todos + 20 événements de
  démo, dates <= 30 septembre 2026.
- **Mail marketing** : formulaire de capture de leads qui crée des contacts dans
  le CRM (badge `Lead`, étape `À contacter`), plus création manuelle de contact
  et import de liste ; envoi groupé ou solo (mocké, sans Brevo) ; segmentation
  basée sur les badges CRM. 20 entrées de démo.
- **Comptabilité** : achats et revenus catégorisés (dons, subventions,
  sponsoring, billetterie côté revenus ; logistique, communication, matériel côté
  dépenses), tableau de KPIs (Recharts), **prévisionnel par événement** (rattaché
  aux événements du calendrier, montants visibles uniquement ici) calculé
  automatiquement jusqu'au 31 juillet 2028, justificatifs en aperçu local (upload
  sans stockage serveur), **export Excel/CSV réel** côté navigateur. 20 achats/
  revenus de démo, dates réelles <= 30 septembre 2026.

## 9. Contraintes et conventions (rappel CLAUDE.md)

- TypeScript strict, pas de `any` non justifié.
- Français correct avec accents partout (UI, commentaires, messages).
- **Jamais de tiret cadratin** (em dash) : trait d'union ou reformulation.
- Jeton/auth en mémoire uniquement, jamais localStorage/sessionStorage.
- Tailwind v4 sans config JS (`@import "tailwindcss"` + `@theme`).
- Commits conventionnels et atomiques.
- Avant commit : `npm run lint`, `npm run typecheck`, `npm run test` doivent
  passer.

## 10. Plan de tests

- **Vitest (unitaire)** : `createCollectionStore` (CRUD, seed, clear, isSeeded),
  seeders (respect des contraintes de dates, 20 entrées, accents), logique de
  filtrage CRM.
- **Composants** : smoke tests des primitives UI et des vues CRM (Kanban, Liste,
  fiche).
- **Playwright (e2e)** : parcours login factice -> CRM -> activer démo -> créer un
  contact -> déplacer dans le Kanban. À ajouter en fin de cycle CRM.

## 11. Hypothèses et décisions ouvertes

- Login factice : reconnexion requise après rechargement (jeton en mémoire).
  Accepté en phase test.
- Liste des badges et des catégories compta : valeurs de départ proposées,
  ajustables.
- Drag and drop via `@dnd-kit/core` (compatible React 19) : à confirmer à
  l'implémentation.
- Format d'export compta : `.xlsx` (SheetJS) ; CSV en repli. À trancher au cycle
  Comptabilité.
