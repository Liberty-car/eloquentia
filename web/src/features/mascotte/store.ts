// Persistance de l'état de la mascotte (objet unique, clé eloquetia:mascotte)
// et orchestration pure du recalcul (XP/stade/humeur + diff -> journal/réaction).
import {
  bandeHumeur,
  computeCompteurs,
  computeFaim,
  computeHumeur,
  computeStade,
  computeXp,
  diffEvents,
  diffJours,
  infoStade,
  penaliteFaim,
} from './compute';
import { FAIM_SEUIL_REPAS, JOURNAL_MAX } from './config';
import type {
  DonneesMascotte,
  JournalEntry,
  MascotteState,
  Reaction,
} from './types';

export const MASCOTTE_KEY = 'eloquetia:mascotte';

export function lireMascotte(): MascotteState | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(MASCOTTE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MascotteState;
    if (typeof parsed.xp !== 'number' || !parsed.lastSeenCounts) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ecrireMascotte(state: MascotteState): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MASCOTTE_KEY, JSON.stringify(state));
}

// Recalcul idempotent. `precedent` (état persistant) sert uniquement à dériver
// le journal et la réaction transitoire ; l'XP et l'humeur sont toujours
// recalculées depuis les données, donc un rafraîchissement ne double rien.
export function recalculer(
  data: DonneesMascotte,
  today: string,
  maintenant: string,
  precedent: MascotteState | null,
): { state: MascotteState; reaction: Reaction | null } {
  const xp = computeXp(data, today);
  const naturel = computeStade(xp);
  // Non-régression : le stade ne redescend jamais sous celui déjà atteint
  // (même si des données sont supprimées et que l'XP baisse).
  const stade =
    precedent && precedent.stade > naturel.stade
      ? precedent.stade
      : naturel.stade;
  const stadeInfo = infoStade(stade, xp);
  const compteurs = computeCompteurs(data, today);

  // Faim : premier calcul (ou migration d'un ancien état) -> on considère la
  // créature rassasiée au moment présent.
  const dernierRepas = precedent?.dernierRepas ?? maintenant;
  const faim = computeFaim(dernierRepas, maintenant);
  // L'humeur intègre le malus de faim, puis est bornée.
  const humeurBrute = computeHumeur(data, today) - penaliteFaim(faim);
  const humeur = Math.max(0, Math.min(100, humeurBrute));

  let journal: JournalEntry[] = precedent?.journal ?? [];
  let reaction: Reaction | null = null;
  let streak = precedent?.streak ?? 0;
  let dernierJourActif = precedent?.dernierJourActif;

  if (precedent) {
    const diff = diffEvents(precedent.lastSeenCounts, compteurs, maintenant);
    if (diff.entries.length > 0) {
      journal = [...diff.entries, ...journal].slice(0, JOURNAL_MAX);
    }
    reaction = diff.reaction;

    // Série d'activité : un jour compte dès qu'une action positive survient.
    const actionPositive = diff.entries.some((e) => e.delta > 0);
    if (actionPositive && dernierJourActif !== today) {
      streak =
        dernierJourActif && diffJours(today, dernierJourActif) === 1
          ? streak + 1
          : 1;
      dernierJourActif = today;
    }

    // Le passage de stade prime sur toute autre réaction.
    if (stade > precedent.stade) {
      reaction = {
        id: `levelup-${maintenant}`,
        type: 'levelup',
        texte: `${stadeInfo.nom} !`,
        positif: true,
      };
      const entree: JournalEntry = {
        id: `levelup-${maintenant}-j`,
        type: 'levelup',
        label: `Évolution : ${stadeInfo.nom}`,
        axe: 'xp',
        delta: 0,
        date: maintenant,
      };
      journal = [entree, ...journal].slice(0, JOURNAL_MAX);
    }
  }

  const state: MascotteState = {
    xp,
    stade,
    humeur,
    humeurBande: bandeHumeur(humeur),
    lastComputedAt: maintenant,
    lastSeenCounts: compteurs,
    journal,
    streak,
    dernierRepas,
    ...(precedent?.nom !== undefined ? { nom: precedent.nom } : {}),
    ...(dernierJourActif !== undefined ? { dernierJourActif } : {}),
  };
  return { state, reaction };
}

// Action « nourrir » : repas pris maintenant (la faim repart au maximum).
// Renvoie null si la créature est déjà presque rassasiée.
export function nourrir(
  precedent: MascotteState,
  maintenant: string,
): MascotteState | null {
  const faim = computeFaim(precedent.dernierRepas, maintenant);
  if (faim >= FAIM_SEUIL_REPAS) return null;
  return { ...precedent, dernierRepas: maintenant };
}

// Action « renommer » : nom personnalisé (vide -> retour au nom par défaut).
export function renommer(precedent: MascotteState, nom: string): MascotteState {
  const propre = nom.trim();
  if (propre === '') {
    const { nom: _retire, ...reste } = precedent;
    void _retire;
    return reste;
  }
  return { ...precedent, nom: propre };
}
