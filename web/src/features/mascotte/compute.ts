// Calculs PURS de la mascotte : XP, stade, humeur, diff d'événements, conseil.
// Aucune dépendance au DOM ni au temps réel : « today » est toujours passé en
// argument pour garantir l'idempotence et la testabilité.
import {
  BANDES,
  BASE_HUMEUR,
  COMPTEUR_VERS_TYPE,
  EVENEMENT_META,
  EVENEMENT_PROCHE_JOURS,
  FENETRE_JOURS,
  INACTIVITE_JOURS_MAX,
  INACTIVITE_PAR_JOUR,
  PRIORITE_REACTION,
  SEUILS_STADE,
  XP_BONUS_REVENU_MAX,
  XP_BONUS_REVENU_PALIER,
  XP_POIDS,
  HUMEUR_POIDS,
} from './config';
import type {
  Compteurs,
  DonneesMascotte,
  HumeurBande,
  JournalEntry,
  Reaction,
  StadeInfo,
} from './types';

// --- utilitaires de dates (ISO AAAA-MM-JJ, sans fuseau) ---

function enJours(iso: string): number {
  return Math.floor(Date.parse(`${iso}T12:00:00Z`) / 86_400_000);
}

// Différence en jours entre deux dates ISO (a - b).
export function diffJours(a: string, b: string): number {
  return enJours(a) - enJours(b);
}

// Vrai si `date` est dans les FENETRE_JOURS derniers jours (aujourd'hui inclus).
function dansFenetre(date: string, today: string): boolean {
  const d = diffJours(today, date);
  return d >= 0 && d <= FENETRE_JOURS;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// --- compteurs (réels seulement pour la compta) ---

function revenusReels(data: DonneesMascotte) {
  return data.mouvements.filter((m) => !m.previsionnel && m.type === 'revenu');
}
function depensesReelles(data: DonneesMascotte) {
  return data.mouvements.filter((m) => !m.previsionnel && m.type === 'depense');
}

export function computeCompteurs(
  data: DonneesMascotte,
  today: string,
): Compteurs {
  return {
    tachesFaites: data.taches.filter((t) => t.statut === 'fait').length,
    contactsConclus: data.contacts.filter((c) => c.etape === 'conclu').length,
    contactsPerdus: data.contacts.filter((c) => c.etape === 'perdu').length,
    revenus: revenusReels(data).length,
    depenses: depensesReelles(data).length,
    evenementsPasses: data.evenements.filter((e) => e.date < today).length,
    campagnesEnvoyees: data.campagnes.filter((c) => c.statut === 'envoye')
      .length,
  };
}

// --- Axe 1 : XP ---

export function computeXp(data: DonneesMascotte, today: string): number {
  const c = computeCompteurs(data, today);
  const bonusMontant = revenusReels(data).reduce(
    (acc, m) =>
      acc +
      Math.min(
        Math.floor(m.montant / XP_BONUS_REVENU_PALIER),
        XP_BONUS_REVENU_MAX,
      ),
    0,
  );
  return (
    c.tachesFaites * XP_POIDS.tacheFaite +
    c.contactsConclus * XP_POIDS.contactConclu +
    c.revenus * XP_POIDS.revenu +
    bonusMontant +
    c.evenementsPasses * XP_POIDS.evenementPasse +
    c.campagnesEnvoyees * XP_POIDS.campagne
  );
}

export function computeStade(xp: number): StadeInfo {
  let courant = SEUILS_STADE[0]!;
  for (const palier of SEUILS_STADE) {
    if (xp >= palier.xp) courant = palier;
    else break;
  }
  const idx = SEUILS_STADE.findIndex((p) => p.stade === courant.stade);
  const suivant = SEUILS_STADE[idx + 1] ?? null;
  const xpDansStade = xp - courant.xp;
  const xpStadeSuivant = suivant ? suivant.xp - courant.xp : null;
  const progressionStade = xpStadeSuivant
    ? clamp(xpDansStade / xpStadeSuivant, 0, 1)
    : 1;
  return {
    stade: courant.stade,
    nom: courant.nom,
    xpDansStade,
    xpStadeSuivant,
    progressionStade,
  };
}

// --- Axe 2 : humeur ---

// Dernière action positive datée (<= today), ou null si aucune.
function derniereActionPositive(
  data: DonneesMascotte,
  today: string,
): string | null {
  const dates: string[] = [];
  for (const m of revenusReels(data)) if (m.date <= today) dates.push(m.date);
  for (const c of data.contacts) {
    if (
      c.etape === 'conclu' &&
      c.dateDerniereInteraction &&
      c.dateDerniereInteraction <= today
    ) {
      dates.push(c.dateDerniereInteraction);
    }
  }
  for (const t of data.taches) {
    if (t.statut === 'fait' && t.echeance && t.echeance <= today) {
      dates.push(t.echeance);
    }
  }
  for (const e of data.evenements) if (e.date < today) dates.push(e.date);
  if (dates.length === 0) return null;
  return dates.reduce((max, d) => (d > max ? d : max));
}

export function tachesEnRetard(data: DonneesMascotte, today: string): number {
  return data.taches.filter(
    (t) =>
      t.statut !== 'fait' && t.echeance !== undefined && t.echeance < today,
  ).length;
}

export function computeHumeur(data: DonneesMascotte, today: string): number {
  let h = BASE_HUMEUR;

  for (const m of revenusReels(data)) {
    if (!dansFenetre(m.date, today)) continue;
    h +=
      HUMEUR_POIDS.revenu +
      Math.min(
        Math.floor(m.montant / 1000) * HUMEUR_POIDS.revenuBonusParMille,
        HUMEUR_POIDS.revenuBonusMax,
      );
  }
  for (const m of depensesReelles(data)) {
    if (!dansFenetre(m.date, today)) continue;
    h +=
      HUMEUR_POIDS.depense -
      Math.min(Math.floor(m.montant / 1000), HUMEUR_POIDS.depenseBonusMax);
  }
  for (const c of data.contacts) {
    if (!c.dateDerniereInteraction) continue;
    if (!dansFenetre(c.dateDerniereInteraction, today)) continue;
    if (c.etape === 'conclu') h += HUMEUR_POIDS.contactConclu;
    if (c.etape === 'perdu') h += HUMEUR_POIDS.contactPerdu;
  }
  for (const t of data.taches) {
    if (
      t.statut === 'fait' &&
      t.echeance !== undefined &&
      dansFenetre(t.echeance, today)
    ) {
      h += HUMEUR_POIDS.tacheFaite;
    }
    if (t.statut !== 'fait' && t.echeance !== undefined) {
      const d = diffJours(today, t.echeance);
      if (d > 0 && d <= FENETRE_JOURS) {
        h += HUMEUR_POIDS.tacheRetard;
        if (t.priorite === 'haute') h += HUMEUR_POIDS.tacheRetardHaute;
      }
    }
  }
  for (const e of data.evenements) {
    const df = diffJours(e.date, today);
    if (df >= 0 && df <= EVENEMENT_PROCHE_JOURS)
      h += HUMEUR_POIDS.evenementProche;
  }

  const derniere = derniereActionPositive(data, today);
  if (derniere) {
    const jours = Math.max(0, diffJours(today, derniere));
    h -= INACTIVITE_PAR_JOUR * Math.min(jours, INACTIVITE_JOURS_MAX);
  }

  return clamp(Math.round(h), 0, 100);
}

export function bandeHumeur(humeur: number): HumeurBande {
  for (const b of BANDES) {
    if (humeur >= b.min && humeur <= b.max) return b.bande;
  }
  return 'serein';
}

// --- Diff d'événements : journal + réaction ---

export interface DiffResultat {
  entries: JournalEntry[];
  reaction: Reaction | null;
}

export function diffEvents(
  prev: Compteurs,
  next: Compteurs,
  maintenant: string,
): DiffResultat {
  const entries: JournalEntry[] = [];
  const apparus = new Set<keyof Compteurs>();

  (Object.keys(COMPTEUR_VERS_TYPE) as (keyof Compteurs)[]).forEach((cle) => {
    const nb = next[cle] - prev[cle];
    if (nb <= 0) return;
    apparus.add(cle);
    const type = COMPTEUR_VERS_TYPE[cle];
    const meta = EVENEMENT_META[type];
    entries.push({
      id: `${type}-${maintenant}-${cle}`,
      type,
      label: nb > 1 ? `${meta.label} (${nb})` : meta.label,
      axe: meta.axe,
      delta: meta.unite * nb,
      date: maintenant,
    });
  });

  // Choix de la réaction la plus saillante.
  let reaction: Reaction | null = null;
  for (const type of PRIORITE_REACTION) {
    const cle = (Object.keys(COMPTEUR_VERS_TYPE) as (keyof Compteurs)[]).find(
      (k) => COMPTEUR_VERS_TYPE[k] === type,
    );
    if (!cle || !apparus.has(cle)) continue;
    const meta = EVENEMENT_META[type];
    reaction = {
      id: `${type}-${maintenant}`,
      type,
      texte: meta.axe === 'xp' ? `+${meta.unite} XP` : `${meta.unite}`,
      positif: meta.positif,
    };
    break;
  }

  return { entries, reaction };
}

// --- Conseil dynamique ---

export function conseil(params: {
  humeurBande: HumeurBande;
  stade: number;
  progressionStade: number;
  tachesEnRetard: number;
}): string {
  const {
    humeurBande,
    stade,
    progressionStade,
    tachesEnRetard: retard,
  } = params;
  if (humeurBande === 'epuise' || humeurBande === 'fatigue') {
    if (retard > 0) {
      return retard > 1
        ? `Termine ${retard} tâches en retard pour que Quetia se repose.`
        : 'Termine ta tâche en retard pour que Quetia se repose.';
    }
    return 'Enregistre un revenu ou conclus un contact pour lui redonner le sourire.';
  }
  if (stade < 4 && progressionStade >= 0.7) {
    return 'Encore un effort : conclus un contact pour faire évoluer Quetia.';
  }
  if (humeurBande === 'radieux') {
    return 'Quetia rayonne, continue comme ça !';
  }
  return 'Quetia va bien. Une tâche terminée et elle sera ravie.';
}
