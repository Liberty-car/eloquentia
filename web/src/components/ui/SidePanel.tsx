import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function SidePanel({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fermer"
        className="flex-1 bg-encre/20"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col bg-papier shadow-2xl">
        <header className="flex items-center justify-between border-b border-trait px-5 py-4">
          <h2 className="text-lg font-bold text-encre">{title}</h2>
          <button
            type="button"
            aria-label="Fermer le panneau"
            onClick={onClose}
            className="text-encre-3 hover:text-encre"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
