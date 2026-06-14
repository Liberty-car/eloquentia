import type { Mouvement } from './types';

export interface Totaux {
  revenus: number;
  depenses: number;
  resultat: number;
}

// Convention : montant toujours positif, direction via `type`.
export function totaux(mouvements: Mouvement[]): Totaux {
  let revenus = 0;
  let depenses = 0;
  for (const m of mouvements) {
    if (m.type === 'revenu') revenus += m.montant;
    else depenses += m.montant;
  }
  return { revenus, depenses, resultat: revenus - depenses };
}

const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

const MOIS_LONGS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

// 'AAAA-MM-JJ' -> 'AAAA-MM'
export function moisDe(dateIso: string): string {
  return dateIso.slice(0, 7);
}

// 'AAAA-MM' -> 'juin 2026'
export function labelMois(mois: string): string {
  const parts = mois.split('-');
  const annee = parts[0] ?? '';
  const indice = Number(parts[1] ?? '1') - 1;
  return `${MOIS_LONGS[indice] ?? ''} ${annee}`.trim();
}

// 'AAAA-MM' -> 'juin' (court, pour les axes)
export function labelMoisCourt(mois: string): string {
  const parts = mois.split('-');
  const indice = Number(parts[1] ?? '1') - 1;
  const annee = (parts[0] ?? '').slice(2);
  return `${MOIS_COURTS[indice] ?? ''} ${annee}`.trim();
}

function enumererMois(debut: string, fin: string): string[] {
  const res: string[] = [];
  const pd = debut.split('-');
  const pf = fin.split('-');
  let annee = Number(pd[0] ?? '2026');
  let mois = Number(pd[1] ?? '1');
  const anneeFin = Number(pf[0] ?? '2028');
  const moisFin = Number(pf[1] ?? '7');
  while (annee < anneeFin || (annee === anneeFin && mois <= moisFin)) {
    res.push(`${annee}-${String(mois).padStart(2, '0')}`);
    mois += 1;
    if (mois > 12) {
      mois = 1;
      annee += 1;
    }
  }
  return res;
}

export interface PointProjection {
  mois: string; // 'AAAA-MM'
  label: string; // court, pour l'axe
  resultatMensuel: number;
  cumul: number;
}

// Projection cumulée du résultat, mois par mois, du premier mouvement
// jusqu'à `finMois` inclus. Inclut réel ET prévisionnel.
export function projectionMensuelle(
  mouvements: Mouvement[],
  finMois = '2028-07',
): PointProjection[] {
  if (mouvements.length === 0) return [];
  const moisDebut = mouvements
    .map((m) => moisDe(m.date))
    .reduce((min, cur) => (cur < min ? cur : min));
  const debut = moisDebut < finMois ? moisDebut : finMois;
  let cumul = 0;
  return enumererMois(debut, finMois).map((mois) => {
    let resultatMensuel = 0;
    for (const m of mouvements) {
      if (moisDe(m.date) === mois) {
        resultatMensuel += m.type === 'revenu' ? m.montant : -m.montant;
      }
    }
    cumul += resultatMensuel;
    return { mois, label: labelMoisCourt(mois), resultatMensuel, cumul };
  });
}
