import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'rose' | 'jaune' | 'neutre';

const tones: Record<Tone, { wrap: string; dot: string }> = {
  rose: { wrap: 'bg-rose-brume text-velours', dot: 'bg-gel-rose' },
  jaune: { wrap: 'bg-jaune-brume text-[#9a7b16]', dot: 'bg-projecteur' },
  neutre: { wrap: 'bg-scene text-encre-2', dot: 'bg-encre-3' },
};

export function Badge({
  tone = 'neutre',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold',
        t.wrap,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', t.dot)} />
      {children}
    </span>
  );
}
