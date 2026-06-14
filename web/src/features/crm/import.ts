import Papa from 'papaparse';

// Une ligne de contact issue d'un CSV (champs reconnus, en-têtes en minuscules).
export interface ImportRow {
  prenom: string;
  nom: string;
  organisation?: string;
  fonction?: string;
  email?: string;
  telephone?: string;
}

export interface ImportResult {
  valides: ImportRow[];
  ignorees: number;
}

function nettoyer(valeur: string | undefined): string {
  return (valeur ?? '').trim();
}

export function parseContactsCsv(texte: string): ImportResult {
  const { data } = Papa.parse<Record<string, string>>(texte, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const valides: ImportRow[] = [];
  let ignorees = 0;

  for (const ligne of data) {
    const prenom = nettoyer(ligne.prenom ?? ligne['prénom']);
    const nom = nettoyer(ligne.nom);
    if (!prenom || !nom) {
      ignorees += 1;
      continue;
    }
    const row: ImportRow = { prenom, nom };
    const organisation = nettoyer(ligne.organisation);
    if (organisation) row.organisation = organisation;
    const fonction = nettoyer(ligne.fonction);
    if (fonction) row.fonction = fonction;
    const email = nettoyer(ligne.email);
    if (email) row.email = email;
    const telephone = nettoyer(ligne.telephone ?? ligne['téléphone']);
    if (telephone) row.telephone = telephone;
    valides.push(row);
  }

  return { valides, ignorees };
}
