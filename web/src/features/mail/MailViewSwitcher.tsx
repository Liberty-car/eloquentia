import { cn } from '../../lib/cn';
import { VUES_MAIL, type VueMail } from './views';

export function MailViewSwitcher({
  value,
  onChange,
}: {
  value: VueMail;
  onChange: (vue: VueMail) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-trait bg-papier p-1">
      {VUES_MAIL.map((vue) => (
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
