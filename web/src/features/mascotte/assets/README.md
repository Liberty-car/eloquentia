# Assets de la mascotte Quetia

L'art est actuellement rendu en **SVG paramétrique** (`QuetiaSprite.tsx`), piloté
par `sprites.ts`. C'est original, net à toute taille, versionnable et sans
dépendance de génération externe. Aucun fichier bitmap n'est donc requis pour que
la feature fonctionne.

## Passer à des sprites IA (optionnel)

Pour remplacer le rendu SVG par des images pré-rendues (anime / jeu vidéo) :

1. Générer une **fiche de référence** (character sheet) du personnage sous 3
   angles pour figer l'identité.
2. Décliner **12 sprites héros** : 4 stades x 3 expressions
   (`radieux`, `serein`, `fatigue`), strictement cohérents.
3. Générer les **overlays FX** sur fond transparent : `zzz`, `etincelles`,
   `coeur`, `goutte-sueur`, `confettis-levelup`.

Format attendu : WebP (ou PNG), fond transparent, carré (source 1024, exports 256
et 512), perso centré, marge basse pour l'ombre portée.

Nommage attendu dans ce dossier :

```
stade1-radieux.webp  stade1-serein.webp  stade1-fatigue.webp
stade2-radieux.webp  stade2-serein.webp  stade2-fatigue.webp
stade3-radieux.webp  stade3-serein.webp  stade3-fatigue.webp
stade4-radieux.webp  stade4-serein.webp  stade4-fatigue.webp
fx-zzz.webp  fx-etincelles.webp  fx-coeur.webp  fx-sueur.webp  fx-levelup.webp
```

Une fois les fichiers présents, adapter `sprites.ts` pour exporter un mapping
`(stade, expression) -> import('./assets/stadeN-xxx.webp')` et faire rendre
`<img>` par `QuetiaSprite` (ou un nouveau composant) à la place du SVG.

## Prompt de génération (à injecter dans chaque image)

> Petite créature mascotte ORIGINALE (pas Pikachu, aucun personnage existant),
> style anime/jeu vidéo moderne, très mignonne (kawaii), ombrage doux et volumes
> (cell shading + dégradés). Corps rose pâle (#e8aabe) à rose vif (#db6a8f),
> joues et accents jaunes (#f5df4d / #ffd777), grands yeux brillants expressifs,
> petites pattes, queue arrondie. Silhouette ronde et attachante. Fond
> transparent, lumière douce de studio, ombre portée subtile. Cohérence stricte
> entre toutes les images.

Variations par stade : bébé (très petit, tête large), juvénile (équilibré),
adulte (posture confiante, crête jaune), rayonnant (aura rose/jaune, petit micro
ou ruban discret évoquant l'éloquence).
