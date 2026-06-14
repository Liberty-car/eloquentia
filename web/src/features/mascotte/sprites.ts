// Mapping (stade, bande) -> paramètres visuels du sprite, et réaction -> FX.
// L'art est rendu en SVG paramétrique (QuetiaSprite) plutôt que via des fichiers
// bitmap : original, net à toute taille, versionnable et sans génération
// externe. Voir assets/README.md pour la variante sprites IA (webp).
import type { HumeurBande, ReactionType, Stade } from './types';

export interface ParamsStade {
  echelle: number; // facteur de taille du corps
  crete: boolean; // mèche/crête jaune (stade >= 3)
  aura: boolean; // halo lumineux (stade 4)
  accessoire: boolean; // petit micro (stade 4, clin d'oeil à l'éloquence)
}

export function paramsStade(stade: Stade): ParamsStade {
  switch (stade) {
    case 1:
      return { echelle: 0.78, crete: false, aura: false, accessoire: false };
    case 2:
      return { echelle: 0.9, crete: false, aura: false, accessoire: false };
    case 3:
      return { echelle: 1.0, crete: true, aura: false, accessoire: false };
    case 4:
      return { echelle: 1.08, crete: true, aura: true, accessoire: true };
  }
}

export type Expression = 'radieux' | 'serein' | 'fatigue';

// La bande `epuise` réutilise le visage `fatigue` (les yeux fermés), complété
// par l'overlay `zzz` géré dans le widget.
export function expressionBande(bande: HumeurBande): Expression {
  if (bande === 'radieux') return 'radieux';
  if (bande === 'serein') return 'serein';
  return 'fatigue';
}

export type FxKind =
  | 'zzz'
  | 'etincelles'
  | 'coeur'
  | 'sueur'
  | 'levelup'
  | 'snack';

export function fxPourReaction(type: ReactionType): FxKind {
  switch (type) {
    case 'contact_conclu':
    case 'revenu':
    case 'evenement':
    case 'campagne':
      return 'etincelles';
    case 'tache_faite':
      return 'coeur';
    case 'depense':
    case 'contact_perdu':
      return 'sueur';
    case 'levelup':
      return 'levelup';
    case 'repas':
      return 'snack';
  }
}

// Cadence de l'animation idle selon l'humeur.
export function rythmeIdle(bande: HumeurBande): string {
  if (bande === 'radieux') return 'quetia-idle quetia-idle--vif';
  if (bande === 'epuise') return 'quetia-idle quetia-idle--lent';
  return 'quetia-idle';
}
