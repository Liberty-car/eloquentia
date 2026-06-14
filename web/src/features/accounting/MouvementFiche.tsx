import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import {
  CATEGORIE_LABELS,
  categoriesPour,
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
): MouvementFormValues {
  return {
    type: mouvement?.type ?? 'revenu',
    libelle: mouvement?.libelle ?? '',
    montant: mouvement ? String(mouvement.montant) : '',
    date: mouvement?.date ?? dateInitiale,
    categorie: mouvement?.categorie ?? 'dons',
    previsionnel: mouvement?.previsionnel ?? false,
    evenementId: mouvement?.evenementId ?? '',
    justificatif: mouvement?.justificatif ?? '',
  };
}

export function MouvementFiche({
  open,
  mouvement,
  dateInitiale,
  evenements,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  mouvement: Mouvement | null;
  dateInitiale: string;
  evenements: OptionEvenement[];
  onClose: () => void;
  onSave: (values: MouvementFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<MouvementFormValues>(
    valeurs(mouvement, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(mouvement, dateInitiale));
  }, [mouvement, dateInitiale]);

  function set<K extends keyof MouvementFormValues>(
    key: K,
    value: MouvementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function changerType(type: TypeMouvement) {
    setValues((prev) => {
      const categories = categoriesPour(type);
      const categorie = categories.includes(prev.categorie)
        ? prev.categorie
        : (categories[0] as string);
      return { ...prev, type, categorie };
    });
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
          <div className="flex flex-wrap gap-1.5">
            {categories.map((categorie) => (
              <button
                key={categorie}
                type="button"
                onClick={() => set('categorie', categorie)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.categorie === categorie
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {CATEGORIE_LABELS[categorie]}
              </button>
            ))}
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
