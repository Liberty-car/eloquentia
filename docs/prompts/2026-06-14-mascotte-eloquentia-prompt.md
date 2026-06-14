# Prompt : créature mascotte évolutive du tableau de bord Eloquentia

Ce document est un prompt d'implémentation précis. Colle-le tel quel à l'agent
qui développera la feature. Il est autoportant : il décrit le contexte, la
mécanique chiffrée, les assets, l'UI, l'arborescence, les tests et les critères
d'acceptation.

---

## 0. Rôle et règles non négociables

Tu es un ingénieur front senior. Tu implémentes une feature dans un monorepo
existant (`/Users/anthonywitz/Développement/Eloquetia`, workspaces `web/` +
`server/`). Respecte STRICTEMENT les conventions du dépôt (voir `CLAUDE.md`) :

- TypeScript strict, pas de `any` non justifié.
- Français correct avec accents partout (UI, commentaires, libellés).
- JAMAIS de tiret cadratin (em dash). Trait d'union ou reformulation.
- Tailwind v4 avec les tokens existants (`index.css`), helper `cn()`, composants
  UI existants (`components/ui/*`) quand pertinent.
- Commits conventionnels et atomiques.
- Avant de livrer : `npm run lint`, `npm run typecheck`, `npm run test` doivent
  passer.

Contraintes produit :

- L'app est aujourd'hui **100% localStorage** (stores `createCollectionStore`,
  clés `eloquetia:*`), aucun appel API. La mascotte reste donc **côté client**,
  sans toucher au backend.
- La créature doit être **originale** : inspirée du genre « petit monstre mignon
  rose et jaune » mais PAS une copie de Pikachu ni d'aucun personnage existant
  (aucune contrefaçon de marque ou de design protégé). Donne-lui un nom propre
  (proposition : « Quetia »).

---

## 1. Objectif

Ajouter une petite créature mascotte affichée **en bas à gauche** de l'outil
(persistante sur toutes les pages). Elle a deux dynamiques :

1. **Évolution permanente** : elle grandit par stades à mesure que l'équipe
   accomplit des actions positives (tâches terminées, contacts conclus, revenus,
   événements réalisés). L'évolution ne régresse jamais.
2. **Humeur / fatigue transitoire** : son expression du moment reflète le ratio
   récent bonnes/mauvaises actions. Les mauvaises actions (dépense, contact
   perdu, tâches en retard) la fatiguent ; les bonnes la regonflent.

Rendu visé : **art type anime / jeu vidéo, mignon, soigné**, palette rose et
jaune cohérente avec le design system. Rendu via **sprites pré-rendus**
(images) animés en CSS/JS, plus des micro-réactions.

---

## 2. Sources de données (déjà présentes, à lire seulement)

Toutes en localStorage via les stores existants. Ne PAS dupliquer la logique :
importe les stores et leurs types.

| Signal            | Source (fichier)                                    | Champ / valeur                                    |
| ----------------- | --------------------------------------------------- | ------------------------------------------------- |
| Tâche terminée    | `web/src/features/calendar/store.ts` + `types.ts`   | `Tache.statut === 'fait'`                         |
| Tâche en retard   | idem                                                | `echeance < aujourd'hui` ET `statut !== 'fait'`   |
| Priorité tâche    | idem                                                | `Tache.priorite` (`basse`/`moyenne`/`haute`)      |
| Contact conclu    | `web/src/features/crm/store.ts` + `types.ts`        | `Contact.etape === 'conclu'`                      |
| Contact perdu     | idem                                                | `Contact.etape === 'perdu'`                       |
| Date interaction  | idem                                                | `Contact.dateDerniereInteraction` (ISO)           |
| Dépense           | `web/src/features/accounting/store.ts` + `types.ts` | `Mouvement.type === 'depense'`, `montant`, `date` |
| Revenu            | idem                                                | `Mouvement.type === 'revenu'`, `montant`, `date`  |
| Événement réalisé | `web/src/features/calendar/store.ts`                | `Evenement.date < aujourd'hui`                    |
| Campagne envoyée  | `web/src/features/mail/store.ts`                    | statut `envoye`                                   |

Aujourd'hui se prend via une fonction utilitaire datée (réutilise
`features/calendar/dates.ts` si une helper existe, sinon crée un util pur).

---

## 3. Mécanique chiffrée

Toutes les constantes vivent dans `features/mascotte/config.ts` et sont
facilement ajustables. Toutes les fonctions de calcul sont **pures** et
**testées** (`compute.ts`).

### 3.1 Axe 1 : XP (permanent) et stades

L'XP est recalculée de façon **idempotente** à partir des compteurs courants
(jamais d'incrément cumulatif qui doublerait au refresh) :

```
XP = (nbTachesFaites        * 10)
   + (nbContactsConclus     * 25)
   + (nbRevenus             * 12) + bonusMontantRevenus
   + (nbEvenementsPasses    * 18)
   + (nbCampagnesEnvoyees   * 8)

bonusMontantRevenus = somme sur chaque revenu de min(floor(montant / 500), 10)
```

Seuils de stade (l'XP ne fait que croître, donc le stade ne régresse jamais) :

| Stade | Nom proposé      | XP requis    |
| ----- | ---------------- | ------------ |
| 1     | Quetia bébé      | 0 à 149      |
| 2     | Quetia juvénile  | 150 à 499    |
| 3     | Quetia adulte    | 500 à 1199   |
| 4     | Quetia rayonnant | 1200 et plus |

`stade = dernier palier dont le seuil <= XP`. Affiche aussi la progression vers
le stade suivant (`xpDansStade / xpNecessairePourStadeSuivant`).

### 3.2 Axe 2 : humeur / fatigue (transitoire, 0 à 100)

Fenêtre glissante `FENETRE_JOURS = 14`. On part d'une base, on ajoute les
signaux récents, on applique une décroissance d'inactivité, puis on borne.

```
humeur = BASE_HUMEUR (= 60)
       + Σ signaux positifs récents
       - Σ signaux négatifs récents
       - decroissanceInactivite
humeur = clamp(humeur, 0, 100)
```

Signaux dans la fenêtre (14 derniers jours, d'après les dates des
enregistrements) :

| Signal récent                             | Effet sur l'humeur                   |
| ----------------------------------------- | ------------------------------------ |
| Revenu                                    | +6 (+ min(floor(montant/1000), 6))   |
| Contact conclu (date interaction récente) | +12                                  |
| Tâche faite avec échéance dans la fenêtre | +4                                   |
| Événement à venir dans 7 jours            | +2 (anticipation)                    |
| Dépense                                   | -6 (- min(floor(montant/1000), 6))   |
| Contact perdu (date interaction récente)  | -14                                  |
| Tâche en retard (échue, non faite)        | -5 (et -3 de plus si priorité haute) |

Décroissance d'inactivité (la fatigue s'installe quand rien d'enthousiasmant
n'arrive) :

```
decroissanceInactivite = 2 * min(joursSansActionPositive, 7)   // max -14
```

`joursSansActionPositive` = nombre de jours depuis la dernière action positive
datée (revenu, contact conclu, tâche faite récente, événement réalisé).

Bandes d'humeur (déterminent l'expression affichée) :

| Bande   | Plage    | Expression                             |
| ------- | -------- | -------------------------------------- |
| Épuisé  | 0 à 24   | sprite `fatigue` + overlay `zzz` animé |
| Fatigué | 25 à 49  | sprite `fatigue`                       |
| Serein  | 50 à 74  | sprite `serein`                        |
| Radieux | 75 à 100 | sprite `radieux`                       |

### 3.3 Journal et micro-réactions

Le store mémorise un snapshot des compteurs (`lastSeenCounts`). À chaque
recalcul, on **diffe** le snapshot courant contre le précédent pour détecter les
**nouveaux** événements et :

1. Pousser une entrée dans `journal` (max 30 entrées, FIFO) :
   `{ id, type, label, axis: 'xp' | 'humeur', delta, date }`.
2. Déclencher une **réaction transitoire** sur la créature (animation + delta
   flottant), par exemple :
   - dépense -> petite goutte de sueur + « -7 » rouge
   - contact perdu -> grimace + « -14 » rouge
   - contact conclu -> étincelles + « +25 XP » rose
   - tâche faite -> coeur + « +10 XP »
   - passage de stade -> explosion de confettis + bandeau « Quetia évolue ! »

Le diff sert UNIQUEMENT au journal et aux réactions visuelles. L'XP et l'humeur
restent calculées depuis les compteurs/dates (idempotent), donc un refresh ne
double jamais rien.

---

## 4. État persistant

Store dédié `features/mascotte/store.ts`, clé localStorage
`eloquetia:mascotte`, forme :

```ts
interface MascotteState {
  xp: number;
  stade: 1 | 2 | 3 | 4;
  humeur: number; // 0 a 100
  humeurBande: 'epuise' | 'fatigue' | 'serein' | 'radieux';
  lastComputedAt: string; // ISO
  lastSeenCounts: {
    tachesFaites: number;
    contactsConclus: number;
    contactsPerdus: number;
    revenus: number;
    depenses: number;
    evenementsPasses: number;
    campagnesEnvoyees: number;
  };
  journal: JournalEntry[]; // max 30
}
```

Si la clé n'existe pas, initialiser proprement (premier calcul depuis les stores
existants, journal vide, pas de réactions au tout premier rendu).

---

## 5. Réactivité (recalcul automatique)

Les pages mutent les stores via `create/update/remove`. Pour que la mascotte
réagisse sans polling :

1. **Étendre `lib/store/createCollectionStore.ts`** pour émettre un événement à
   chaque mutation : `window.dispatchEvent(new CustomEvent('eloquetia:store-change', { detail: { namespace } }))`.
   (Amélioration ciblée et rétrocompatible, ne change pas l'API publique.)
2. Écouter aussi l'événement natif `storage` (synchro multi-onglets).
3. `MascotteProvider` (contexte React) écoute ces événements, recalcule l'état
   (debounce 150 ms), met à jour `eloquetia:mascotte` et expose via `useMascotte()`.

`useMascotte()` retourne : `{ xp, stade, stadeNom, progressionStade, humeur,
humeurBande, journal, reaction }` où `reaction` est la dernière micro-réaction à
jouer (consommée puis remise à null).

---

## 6. Assets (sprites à générer par IA)

### 6.1 Démarche

1. Générer d'abord **une fiche de référence** du personnage (character sheet) :
   même créature sous 3 angles, pour figer l'identité visuelle.
2. Puis décliner **12 sprites héros** : 4 stades x 3 expressions
   (`radieux`, `serein`, `fatigue`), strictement cohérents (même perso, même
   style, même éclairage).
3. Générer les **overlays FX** séparés (fond transparent) : `zzz`, `etincelles`,
   `coeur`, `goutte-sueur`, `confettis-levelup`.

Format : PNG ou WebP, fond transparent, cadrage carré (1024x1024 source,
exporté en 256 et 512), perso centré, marge basse pour l'ombre portée.

Nommage : `web/src/features/mascotte/assets/stade{1-4}-{radieux|serein|fatigue}.webp`
et `assets/fx-{zzz|etincelles|coeur|sueur|levelup}.webp`.

### 6.2 Description du personnage (à injecter dans chaque génération)

> Petite créature mascotte ORIGINALE (pas Pikachu, pas de personnage existant),
> style anime/jeu vidéo moderne, très mignonne (kawaii) mais rendu soigné avec
> ombrage doux et volumes (cell shading + dégradés). Corps rose pâle
> (#e8aabe) à rose vif (#db6a8f), joues et accents jaunes (#f5df4d / #ffd777),
> grands yeux brillants expressifs, petites pattes, queue arrondie. Silhouette
> ronde et attachante. Fond transparent, lumière douce de studio, ombre portée
> subtile. Cohérence stricte entre toutes les images (même design).

### 6.3 Variations par stade (silhouette qui grandit)

- Stade 1 (bébé) : très petit, tête large, corps minuscule, mignon fragile.
- Stade 2 (juvénile) : un peu plus grand, proportions équilibrées, plus vif.
- Stade 3 (adulte) : posture confiante, détails accrus (mèche/crête jaune).
- Stade 4 (rayonnant) : version la plus aboutie, légère aura lumineuse
  rose/jaune, accessoire discret évoquant l'éloquence (petit micro ou ruban),
  sans surcharge.

### 6.4 Variations d'expression

- `radieux` : grand sourire, yeux pétillants, énergie haute.
- `serein` : sourire calme, yeux mi-ouverts détendus.
- `fatigue` : paupières lourdes, petite goutte, posture affaissée.

Si tu disposes d'un outil de génération d'images (MCP image), génère réellement
les assets. Sinon, place des placeholders aux bons noms/dimensions et documente
la commande de génération attendue, sans bloquer le reste.

---

## 7. UI / UX du widget

### 7.1 Forme

- **Pastille flottante** ancrée en bas à gauche, dans `RootLayout.tsx` (sous la
  navigation de l'`<aside>`, via `mt-auto`, ou en `position: fixed` bottom-left
  avec un z-index au-dessus du contenu mais sous les `SidePanel` existants
  z-50). La créature (sprite du stade + humeur du moment) joue une animation
  d'idle permanente.
- **Au clic** : ouvre un petit panneau (popover/`Card`) avec :
  - nom + stade (« Quetia adulte ») et barre de progression XP vers le stade
    suivant ;
  - jauge d'humeur colorée (rouge -> jaune -> rose selon la bande) ;
  - les 3 à 5 dernières entrées du journal (icône + libellé + delta + date) ;
  - un conseil dynamique : ex. « Termine 2 tâches en retard pour qu'elle se
    repose » quand l'humeur est basse, « Conclus un contact pour la faire
    évoluer » quand proche d'un palier.

### 7.2 Animations

- Ajouter la dépendance d'animation **`framer-motion`** (alias `motion/react`)
  pour les réactions orchestrées (pop d'entrée, deltas flottants, confettis de
  passage de stade). L'idle (respiration/léger rebond, clignement) peut rester
  en **keyframes CSS** pour rester léger.
- Idle : respiration douce (scale 1.0 -> 1.03), léger bob vertical, clignement
  périodique. Plus l'humeur est haute, plus l'idle est dynamique ; en `epuise`,
  idle très lent + `zzz`.
- Réaction (déclenchée par `useMascotte().reaction`) : petite secousse + sprite
  FX + texte de delta flottant qui monte et s'estompe.
- Passage de stade : séquence de confettis + bandeau, jouée une seule fois.

### 7.3 Accessibilité et perfs

- Respecter `prefers-reduced-motion` : couper les animations non essentielles,
  garder l'image fixe du bon état.
- `aria-label` décrivant l'état : « Quetia, stade adulte, humeur sereine ».
- Précharger uniquement les sprites du stade courant et adjacents.
- Le widget ne doit jamais bloquer l'UI ni provoquer de reflow coûteux.

---

## 8. Arborescence à créer

```
web/src/features/mascotte/
├── types.ts              # MascotteState, JournalEntry, Stade, HumeurBande
├── config.ts             # toutes les constantes (poids XP, seuils, poids humeur, fenetre)
├── compute.ts            # fonctions PURES : computeXp, computeStade, computeHumeur, diffEvents, conseil
├── store.ts              # persistance localStorage 'eloquetia:mascotte'
├── MascotteProvider.tsx  # contexte + abonnement aux stores + recalcul debounce
├── useMascotte.ts        # hook de consommation
├── sprites.ts            # mapping (stade, bande) -> asset, + FX
├── Mascotte.tsx          # pastille + idle + réactions
├── MascottePanel.tsx     # panneau de détail (stade, XP, humeur, journal, conseil)
├── compute.test.ts       # tests unitaires de la mécanique
└── assets/               # sprites + FX

Modifs ciblées :
- web/src/RootLayout.tsx                  # monter <Mascotte/> en bas a gauche
- web/src/main.tsx                        # envelopper avec <MascotteProvider/>
- web/src/lib/store/createCollectionStore.ts  # emettre 'eloquetia:store-change'
- web/package.json                        # ajouter framer-motion
```

---

## 9. Tests (Vitest)

`compute.test.ts` couvre la logique pure (pas l'UI) :

- XP : jeux de compteurs -> XP attendue, y compris bonus montant.
- Stades : XP aux bornes (149/150, 499/500, 1199/1200) -> bon stade, et
  non-régression (XP qui baisserait n'est pas un cas, mais vérifier que le calcul
  est monotone par rapport aux compteurs).
- Humeur : scénarios (que des dépenses -> humeur basse et bande `fatigue`/
  `epuise` ; que des revenus + contacts conclus -> bande `radieux` ; mix
  équilibré -> `serein`) ; bornage 0 et 100 ; décroissance d'inactivité.
- diffEvents : ajout d'un contact perdu -> une entrée journal négative + une
  réaction ; aucun changement -> aucune réaction (anti double-comptage).

Garder le smoke test existant vert. Ajouter au besoin un test de rendu minimal
de `Mascotte` (présence de l'`aria-label`).

---

## 10. Critères d'acceptation

1. La créature est visible en bas à gauche sur toutes les pages et persiste
   après rechargement.
2. Créer une dépense (page Comptabilité) déclenche, sans rechargement, une
   réaction négative (goutte + delta) et fait baisser l'humeur ; conclure un
   contact (CRM) déclenche une réaction positive et de l'XP.
3. Atteindre un seuil d'XP fait évoluer la créature de stade (animation de
   passage de stade), et le stade ne régresse jamais.
4. Le panneau au clic montre stade, progression XP, humeur, journal et un
   conseil cohérent avec l'état.
5. `prefers-reduced-motion` désactive les animations non essentielles.
6. `npm run lint`, `npm run typecheck`, `npm run test` passent. Aucune
   régression. Aucun tiret cadratin, accents corrects partout.

---

## 11. Étapes d'implémentation suggérées (commits atomiques)

1. `feat(mascotte): types, config et calculs purs + tests`
2. `feat(mascotte): store localStorage + provider + abonnement stores`
3. `chore(store): émettre eloquetia:store-change sur mutation`
4. `feat(mascotte): widget, panneau, animations (framer-motion)`
5. `feat(mascotte): assets sprites + FX` (ou placeholders documentés)
6. `feat(mascotte): montage dans RootLayout + provider dans main`

Implémente d'abord la mécanique (1 à 3) en TDD, vérifie les tests, puis l'UI.
