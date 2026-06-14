// Persistance de l'état de la mascotte (objet unique, clé eloquetia:mascotte)
// et orchestration pure du recalcul (XP/stade/humeur + diff -> journal/réaction).
import {
  bandeHumeur,
  computeCompteurs,
  computeHumeur,
  computeStade,
  computeXp,
  diffEvents,
} from './compute';
import { JOURNAL_MAX } from './config';
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
  const stadeInfo = computeStade(xp);
  const humeur = computeHumeur(data, today);
  const compteurs = computeCompteurs(data, today);

  let journal: JournalEntry[] = precedent?.journal ?? [];
  let reaction: Reaction | null = null;

  if (precedent) {
    const diff = diffEvents(precedent.lastSeenCounts, compteurs, maintenant);
    if (diff.entries.length > 0) {
      journal = [...diff.entries, ...journal].slice(0, JOURNAL_MAX);
    }
    reaction = diff.reaction;

    // Le passage de stade prime sur toute autre réaction.
    if (stadeInfo.stade > precedent.stade) {
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
    stade: stadeInfo.stade,
    humeur,
    humeurBande: bandeHumeur(humeur),
    lastComputedAt: maintenant,
    lastSeenCounts: compteurs,
    journal,
  };
  return { state, reaction };
}
