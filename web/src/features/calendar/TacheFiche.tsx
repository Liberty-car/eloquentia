import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import {
  MEMBRES,
  PRIORITES,
  PRIORITE_LABELS,
  STATUTS,
  STATUT_LABELS,
  type Tache,
  type TacheFormValues,
} from './types';

function valeurs(tache: Tache | null, dateInitiale: string): TacheFormValues {
  return {
    titre: tache?.titre ?? '',
    membre: tache?.membre ?? 'Luciano',
    statut: tache?.statut ?? 'a_faire',
    priorite: tache?.priorite ?? 'moyenne',
    echeance: tache?.echeance ?? dateInitiale,
    description: tache?.description ?? '',
  };
}

export function TacheFiche({
  open,
  tache,
  dateInitiale,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  tache: Tache | null;
  dateInitiale: string;
  onClose: () => void;
  onSave: (values: TacheFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<TacheFormValues>(
    valeurs(tache, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(tache, dateInitiale));
  }, [tache, dateInitiale]);

  function set<K extends keyof TacheFormValues>(
    key: K,
    value: TacheFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SidePanel
      open={open}
      title={tache ? 'Modifier la tâche' : 'Nouvelle tâche'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Titre"
          value={values.titre}
          onChange={(e) => set('titre', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Responsable</span>
          <div className="flex flex-wrap gap-1.5">
            {MEMBRES.map((membre) => (
              <button
                key={membre}
                type="button"
                onClick={() => set('membre', membre)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.membre === membre
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {membre}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Statut</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUTS.map((statut) => (
              <button
                key={statut}
                type="button"
                onClick={() => set('statut', statut)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.statut === statut
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {STATUT_LABELS[statut]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Priorité</span>
          <div className="flex flex-wrap gap-1.5">
            {PRIORITES.map((priorite) => (
              <button
                key={priorite}
                type="button"
                onClick={() => set('priorite', priorite)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.priorite === priorite
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {PRIORITE_LABELS[priorite]}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Échéance"
          type="date"
          value={values.echeance}
          onChange={(e) => set('echeance', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-desc" className="text-xs font-medium text-encre-3">
            Description
          </label>
          <textarea
            id="t-desc"
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          {tache ? (
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
