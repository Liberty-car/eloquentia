import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import { categoriesPour } from './categories';
import {
  TYPES_MOUVEMENT,
  TYPE_LABELS,
  type Mouvement,
  type MouvementFormValues,
  type TypeMouvement,
} from './types';

export interface OptionEvenement {
  id: string;
  titre: string;
}

function valeurs(
  mouvement: Mouvement | null,
  dateInitiale: string,
  evenementInitial: string,
  previsionnelInitial: boolean,
): MouvementFormValues {
  return {
    type: mouvement?.type ?? 'revenu',
    libelle: mouvement?.libelle ?? '',
    montant: mouvement ? String(mouvement.montant) : '',
    date: mouvement?.date ?? dateInitiale,
    categorie:
      mouvement?.categorie ?? categoriesPour('revenu')[0]?.id ?? 'autre-revenu',
    previsionnel: mouvement?.previsionnel ?? previsionnelInitial,
    evenementId: mouvement?.evenementId ?? evenementInitial,
    justificatif: mouvement?.justificatif ?? '',
  };
}

export function MouvementFiche({
  open,
  mouvement,
  dateInitiale,
  evenements,
  evenementInitial = '',
  previsionnelInitial = false,
  onClose,
  onSave,
  onDelete,
  onAjouterCategorie,
  onSupprimerCategorie,
}: {
  open: boolean;
  mouvement: Mouvement | null;
  dateInitiale: string;
  evenements: OptionEvenement[];
  evenementInitial?: string;
  previsionnelInitial?: boolean;
  onClose: () => void;
  onSave: (values: MouvementFormValues) => void;
  onDelete: () => void;
  onAjouterCategorie: (label: string, type: TypeMouvement) => void;
  onSupprimerCategorie: (id: string) => void;
}) {
  const [values, setValues] = useState<MouvementFormValues>(
    valeurs(mouvement, dateInitiale, evenementInitial, previsionnelInitial),
  );
  const [nouvelleCategorie, setNouvelleCategorie] = useState('');

  useEffect(() => {
    setValues(
      valeurs(mouvement, dateInitiale, evenementInitial, previsionnelInitial),
    );
  }, [mouvement, dateInitiale, evenementInitial, previsionnelInitial]);

  function set<K extends keyof MouvementFormValues>(
    key: K,
    value: MouvementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function changerType(type: TypeMouvement) {
    setValues((prev) => {
      const categories = categoriesPour(type);
      const categorie = categories.some((c) => c.id === prev.categorie)
        ? prev.categorie
        : (categories[0]?.id ?? '');
      return { ...prev, type, categorie };
    });
  }

  function ajouterCategorieLocale() {
    const label = nouvelleCategorie.trim();
    if (label === '') return;
    onAjouterCategorie(label, values.type);
    setNouvelleCategorie('');
  }

  function supprimerCategorieLocale(id: string) {
    onSupprimerCategorie(id);
    if (values.categorie === id) {
      const reste = categoriesPour(values.type).filter((c) => c.id !== id);
      set('categorie', reste[0]?.id ?? '');
    }
  }

  const categories = categoriesPour(values.type);

  return (
    <SidePanel
      open={open}
      title={mouvement ? 'Modifier le mouvement' : 'Nouveau mouvement'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Type</span>
          <div className="flex gap-1.5">
            {TYPES_MOUVEMENT.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => changerType(type)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.type === type
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Libellé"
          value={values.libelle}
          onChange={(e) => set('libelle', e.target.value)}
        />

        <Input
          label="Montant (EUR)"
          type="number"
          min="0"
          value={values.montant}
          onChange={(e) => set('montant', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Catégorie</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((categorie) => {
              const actif = values.categorie === categorie.id;
              return (
                <span
                  key={categorie.id}
                  className={cn(
                    'inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                    actif
                      ? 'border-gel-rose bg-rose-brume text-velours'
                      : 'border-trait-fort bg-papier text-encre-2',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => set('categorie', categorie.id)}
                    className="py-1 pl-3 pr-1.5"
                  >
                    {categorie.label}
                  </button>
                  {!categorie.protege && (
                    <button
                      type="button"
                      onClick={() => supprimerCategorieLocale(categorie.id)}
                      aria-label={`Supprimer la catégorie ${categorie.label}`}
                      className="pl-0.5 pr-2 text-encre-3 hover:text-erreur"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              );
            })}
            <span className="inline-flex items-center gap-1">
              <input
                type="text"
                value={nouvelleCategorie}
                onChange={(e) => setNouvelleCategorie(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    ajouterCategorieLocale();
                  }
                }}
                placeholder="Nouvelle catégorie"
                aria-label="Nom de la nouvelle catégorie"
                className="h-7 w-36 rounded-full border border-trait bg-scene px-3 text-xs text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
              />
              <button
                type="button"
                onClick={ajouterCategorieLocale}
                aria-label="Ajouter la catégorie"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-trait-fort bg-papier text-encre-2 hover:bg-scene"
              >
                <Plus size={14} />
              </button>
            </span>
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => set('date', e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-encre-2">
          <input
            type="checkbox"
            checked={values.previsionnel}
            onChange={(e) => set('previsionnel', e.target.checked)}
            className="h-4 w-4 rounded border-trait-fort text-gel-rose focus:ring-focus/30"
          />
          Mouvement prévisionnel
        </label>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="m-evenement"
            className="text-xs font-medium text-encre-3"
          >
            Événement lié (optionnel)
          </label>
          <select
            id="m-evenement"
            value={values.evenementId}
            onChange={(e) => set('evenementId', e.target.value)}
            className="h-9 rounded-[10px] border border-trait bg-scene px-3 text-sm text-encre focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          >
            <option value="">Aucun</option>
            {evenements.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.titre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="m-justif"
            className="text-xs font-medium text-encre-3"
          >
            Justificatif (optionnel)
          </label>
          <input
            id="m-justif"
            type="file"
            onChange={(e) => {
              const fichier = e.target.files?.[0];
              if (fichier) set('justificatif', fichier.name);
            }}
            className="text-sm text-encre-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-brume file:px-3 file:py-1 file:text-xs file:font-medium file:text-velours"
          />
          {values.justificatif && (
            <span className="flex items-center gap-2 text-xs text-encre-2">
              {values.justificatif}
              <button
                type="button"
                onClick={() => set('justificatif', '')}
                className="text-erreur hover:underline"
              >
                Retirer
              </button>
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          {mouvement ? (
            <Button variant="ghost" className="text-erreur" onClick={onDelete}>
              Supprimer
            </Button>
          ) : (
            <span />
          )}
          <Button variant="primary" onClick={() => onSave(values)}>
            Enregistrer
          </Button>
        </div>
      </div>
    </SidePanel>
  );
}
