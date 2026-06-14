import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import { BADGES, BADGE_LABELS, type Contact } from '../crm/types';
import { compterDestinataires } from './recipients';
import type { Campagne, ComposerValues, SegmentBadge } from './types';

const SEGMENTS: SegmentBadge[] = ['tous', ...BADGES];

function labelSegment(segment: SegmentBadge): string {
  return segment === 'tous' ? 'Tous' : BADGE_LABELS[segment];
}

export function CampagneFiche({
  open,
  campagne,
  contacts,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  campagne: Campagne | null;
  contacts: Contact[];
  onClose: () => void;
  onSave: (values: ComposerValues) => void;
  onDelete: () => void;
}) {
  const [segment, setSegment] = useState<SegmentBadge>('tous');
  const [sujet, setSujet] = useState('');
  const [corps, setCorps] = useState('');

  useEffect(() => {
    setSegment(campagne?.segment ?? 'tous');
    setSujet(campagne?.sujet ?? '');
    setCorps(campagne?.corps ?? '');
  }, [campagne]);

  const nbDestinataires = compterDestinataires(contacts, segment);
  const peutEnregistrer = sujet.trim() !== '';

  return (
    <SidePanel open={open} title="Modifier la campagne" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-encre-3">Segment</span>
          <div className="flex flex-wrap gap-1.5">
            {SEGMENTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  segment === s
                    ? 'border-gel-rose bg-rose-brume text-velours'
                    : 'border-trait-fort bg-papier text-encre-2 hover:bg-scene',
                )}
              >
                {labelSegment(s)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-encre-3">
          {nbDestinataires} destinataire{nbDestinataires > 1 ? 's' : ''}{' '}
          (contacts avec email)
        </p>

        <Input
          label="Sujet"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="campagne-corps"
            className="text-xs font-medium text-encre-3"
          >
            Message
          </label>
          <textarea
            id="campagne-corps"
            rows={8}
            value={corps}
            onChange={(e) => setCorps(e.target.value)}
            className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Button variant="ghost" className="text-erreur" onClick={onDelete}>
            Supprimer
          </Button>
          <Button
            variant="primary"
            disabled={!peutEnregistrer}
            onClick={() =>
              onSave({ sujet: sujet.trim(), corps: corps.trim(), segment })
            }
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </SidePanel>
  );
}
