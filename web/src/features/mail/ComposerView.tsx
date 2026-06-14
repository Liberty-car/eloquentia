import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/cn';
import { BADGES, BADGE_LABELS, type Contact } from '../crm/types';
import { compterDestinataires } from './recipients';
import type { ComposerValues, SegmentBadge } from './types';

const SEGMENTS: SegmentBadge[] = ['tous', ...BADGES];

function labelSegment(segment: SegmentBadge): string {
  return segment === 'tous' ? 'Tous' : BADGE_LABELS[segment];
}

export function ComposerView({
  contacts,
  onSend,
}: {
  contacts: Contact[];
  onSend: (values: ComposerValues) => void;
}) {
  const [segment, setSegment] = useState<SegmentBadge>('tous');
  const [sujet, setSujet] = useState('');
  const [corps, setCorps] = useState('');

  const nbDestinataires = compterDestinataires(contacts, segment);
  const peutEnvoyer = sujet.trim() !== '' && nbDestinataires > 0;

  function envoyer() {
    if (!peutEnvoyer) return;
    onSend({ sujet: sujet.trim(), corps: corps.trim(), segment });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
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

      <div className="rounded-xl border-2 border-projecteur bg-papier p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-encre-3">
          Destinataires (contacts avec email)
        </p>
        <p
          data-testid="destinataires-count"
          className="mt-1 text-2xl font-extrabold tabular-nums text-encre"
        >
          {nbDestinataires}
        </p>
      </div>

      <Input
        label="Sujet"
        value={sujet}
        onChange={(e) => setSujet(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="mail-corps"
          className="text-xs font-medium text-encre-3"
        >
          Message
        </label>
        <textarea
          id="mail-corps"
          rows={8}
          value={corps}
          onChange={(e) => setCorps(e.target.value)}
          className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-encre-3">
          Phase de test : l'envoi est simulé (aucun email réel n'est envoyé).
        </p>
        <Button variant="primary" onClick={envoyer} disabled={!peutEnvoyer}>
          Envoyer la campagne
        </Button>
      </div>
    </div>
  );
}
