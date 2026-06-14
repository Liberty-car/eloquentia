export interface JourGrille {
  iso: string; // AAAA-MM-JJ
  jour: number; // numero du jour dans le mois
  dansLeMois: boolean;
}

export const NOMS_MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export const NOMS_JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Formate une date locale en AAAA-MM-JJ (sans decalage UTC).
export function isoLocal(d: Date): string {
  const annee = d.getFullYear();
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

export function aujourdhuiIso(): string {
  return isoLocal(new Date());
}

// Grille de 6 semaines (42 cases), lundi en premier, pour un mois (0-11).
export function moisGrille(annee: number, mois: number): JourGrille[] {
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7; // lundi = 0
  const debut = new Date(annee, mois, 1 - decalage);
  const jours: JourGrille[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(
      debut.getFullYear(),
      debut.getMonth(),
      debut.getDate() + i,
    );
    jours.push({
      iso: isoLocal(d),
      jour: d.getDate(),
      dansLeMois: d.getMonth() === mois,
    });
  }
  return jours;
}
