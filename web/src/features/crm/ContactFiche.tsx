import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import {
  BADGES,
  BADGE_LABELS,
  ETAPES,
  ETAPE_LABELS,
  type Contact,
  type ContactFormValues,
} from './types';

function valeursInitiales(contact: Contact | null): ContactFormValues {
  return {
    prenom: contact?.prenom ?? '',
    nom: contact?.nom ?? '',
    organisation: contact?.organisation ?? '',
    fonction: contact?.fonction ?? '',
    email: contact?.email ?? '',
    telephone: contact?.telephone ?? '',
    etape: contact?.etape ?? 'a_contacter',
    badges: contact?.badges ?? [],
    notes: contact?.notes ?? '',
  };
}

export function ContactFiche({
  open,
  contact,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (values: ContactFormValues) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<ContactFormValues>(
    valeursInitiales(contact),
  );

  useEffect(() => {
    setValues(valeursInitiales(contact));
  }, [contact]);

  function set<K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleBadge(badge: (typeof BADGES)[number]) {
    setValues((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  }

  return (
    <SidePanel
      open={open}
      title={contact ? 'Modifier le contact' : 'Nouveau contact'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prénom"
            value={values.prenom}
            onChange={(e) => set('prenom', e.target.value)}
          />
          <Input
            label="Nom"
            value={values.nom}
            onChange={(e) => set('nom', e.target.value)}
          />
        </div>
        <Input
          label="Organisation"
          value={values.organisation}
          onChange={(e) => set('organisation', e.target.value)}
        />
        <Input
          label="Fonction"
          value={values.fonction}
          onChange={(e) => set('fonction', e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
        />
        <Input
          label="Téléphone"
          value={values.telephone}
          onChange={(e) => set('telephone', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Étape</span>
          <div className="flex flex-wrap gap-1.5">
            {ETAPES.map((etape) => (
              <button
                key={etape}
                type="button"
                onClick={() => set('etape', etape)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.etape === etape
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {ETAPE_LABELS[etape]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Badges</span>
          <div className="flex flex-wrap gap-1.5">
            {BADGES.map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => toggleBadge(badge)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  values.badges.includes(badge)
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {BADGE_LABELS[badge]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs font-medium text-encre-3">
            Notes
          </label>
          <textarea
            id="notes"
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={4}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          {contact ? (
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
