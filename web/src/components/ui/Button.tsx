import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[10px] text-sm font-semibold transition-colors duration-200 active:duration-50 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus';

const variants: Record<Variant, string> = {
  primary: 'bg-gel-rose text-white hover:bg-velours',
  outline: 'bg-papier text-encre border border-trait-fort hover:bg-scene',
  ghost: 'text-encre hover:bg-scene',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'outline',
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
