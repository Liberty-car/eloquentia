import { libelleCategorie } from './categories';
import { TYPE_LABELS, type Mouvement } from './types';

function echapper(valeur: string): string {
  if (/[";\n\r]/.test(valeur)) {
    return `"${valeur.replace(/"/g, '""')}"`;
  }
  return valeur;
}

const ENTETES = [
  'Date',
  'Type',
  'Libellé',
  'Catégorie',
  'Montant',
  'Prévisionnel',
  'Justificatif',
];

export function mouvementsVersCsv(mouvements: Mouvement[]): string {
  const lignes = mouvements.map((m) =>
    [
      m.date,
      TYPE_LABELS[m.type],
      m.libelle,
      libelleCategorie(m.categorie),
      String(m.montant),
      m.previsionnel ? 'Oui' : 'Non',
      m.justificatif ?? '',
    ]
      .map(echapper)
      .join(';'),
  );
  return [ENTETES.join(';'), ...lignes].join('\r\n');
}

// Déclenche le téléchargement d'un CSV (BOM UTF-8 pour Excel fr-FR).
export function telechargerCsv(nomFichier: string, contenu: string): void {
  const blob = new Blob(['﻿' + contenu], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}
