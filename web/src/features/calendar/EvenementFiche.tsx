import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import type { Evenement, EvenementFormValues } from './types';

function valeurs(
  evenement: Evenement | null,
  dateInitiale: string,
): EvenementFormValues {
  return {
    titre: evenement?.titre ?? '',
    date: evenement?.date ?? dateInitiale,
    heure: evenement?.heure ?? '',
    lieu: evenement?.lieu ?? '',
    description: evenement?.description ?? '',
  };
}

export function EvenementFiche({
  open,
  evenement,
  dateInitiale,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  evenement: Evenement | null;
  dateInitiale: string;
  onClose: () => void;
  onSave: (values: EvenementFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<EvenementFormValues>(
    valeurs(evenement, dateInitiale),
  );

  useEffect(() => {
    setValues(valeurs(evenement, dateInitiale));
  }, [evenement, dateInitiale]);

  function set<K extends keyof EvenementFormValues>(
    key: K,
    value: EvenementFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SidePanel
      open={open}
      title={evenement ? "Modifier l'événement" : 'Nouvel événement'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Titre"
          value={values.titre}
          onChange={(e) => set('titre', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <Input
            label="Heure"
            type="time"
            value={values.heure}
            onChange={(e) => set('heure', e.target.value)}
          />
        </div>
        <Input
          label="Lieu"
          value={values.lieu}
          onChange={(e) => set('lieu', e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-desc" className="text-xs font-medium text-encre-3">
            Description
          </label>
          <textarea
            id="ev-desc"
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          {evenement ? (
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
