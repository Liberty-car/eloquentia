import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-trait bg-papier py-12 text-center">
      <p className="text-base font-semibold text-encre">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-encre-3">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
