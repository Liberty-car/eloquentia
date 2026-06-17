import { cn } from '../../lib/cn';
import { VUES_CAL, type VueCal } from './views';

export function CalViewSwitcher({
  value,
  onChange,
}: {
  value: VueCal;
  onChange: (vue: VueCal) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-trait bg-papier p-1">
      {VUES_CAL.map((vue) => (
        <button
          key={vue.id}
          type="button"
          onClick={() => onChange(vue.id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === vue.id
              ? 'bg-rose-brume text-velours'
              : 'text-encre-2 hover:bg-scene',
          )}
        >
          {vue.label}
        </button>
      ))}
    </div>
  );
}
