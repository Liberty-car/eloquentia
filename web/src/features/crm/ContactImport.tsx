import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SidePanel } from '../../components/ui/SidePanel';
import { parseContactsCsv, type ImportRow } from './import';

export function ContactImport({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (rows: ImportRow[]) => void;
}) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [ignorees, setIgnorees] = useState(0);
  const [analyse, setAnalyse] = useState(false);

  function chargerFichier(fichier: File) {
    const lecteur = new FileReader();
    lecteur.onload = () => {
      const resultat = parseContactsCsv(String(lecteur.result));
      setRows(resultat.valides);
      setIgnorees(resultat.ignorees);
      setAnalyse(true);
    };
    lecteur.readAsText(fichier);
  }

  function reinitialiser() {
    setRows([]);
    setIgnorees(0);
    setAnalyse(false);
  }

  function fermer() {
    reinitialiser();
    onClose();
  }

  return (
    <SidePanel open={open} title="Importer des contacts" onClose={fermer}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-encre-2">
          Fichier CSV avec les colonnes : prenom, nom, organisation, fonction,
          email, telephone. Les colonnes prenom et nom sont obligatoires.
        </p>
        <input
          data-testid="import-fichier"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) chargerFichier(fichier);
          }}
          className="text-sm text-encre-2 file:mr-3 file:rounded-[10px] file:border file:border-trait-fort file:bg-papier file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-encre"
        />

        {analyse && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-encre">
              {rows.length} contact{rows.length > 1 ? 's' : ''} prêt
              {rows.length > 1 ? 's' : ''} à importer
              {ignorees > 0 && (
                <span className="text-encre-3">
                  {' '}
                  ({ignorees} ligne(s) ignorée(s))
                </span>
              )}
            </p>
            {rows.length > 0 && (
              <ul className="max-h-48 overflow-y-auto rounded-xl border border-trait bg-papier text-sm">
                {rows.slice(0, 8).map((row, i) => (
                  <li
                    key={i}
                    className="border-b border-trait px-3 py-2 last:border-0"
                  >
                    {row.prenom} {row.nom}
                    {row.organisation && (
                      <span className="text-encre-3">
                        {' '}
                        - {row.organisation}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Button
              variant="primary"
              disabled={rows.length === 0}
              onClick={() => {
                onImport(rows);
                reinitialiser();
              }}
            >
              Importer {rows.length} contact{rows.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
