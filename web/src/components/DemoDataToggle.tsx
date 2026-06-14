import { useEffect, useState } from 'react';
import type {
  CollectionStore,
  Identifiable,
} from '../lib/store/createCollectionStore';
import { cn } from '../lib/cn';

export function DemoDataToggle<T extends Identifiable>({
  store,
  onChange,
}: {
  store: CollectionStore<T>;
  onChange?: () => void;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    void store.isSeeded().then(setOn);
  }, [store]);

  async function toggle() {
    if (on) {
      await store.clear();
      setOn(false);
    } else {
      await store.seed();
      setOn(true);
    }
    onChange?.();
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors',
        on
          ? 'border-gel-rose bg-rose-brume text-velours'
          : 'border-trait-fort bg-papier text-encre-2',
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          on ? 'bg-gel-rose' : 'bg-encre-4',
        )}
      />
      Données de démo {on ? 'activées' : 'désactivées'}
    </button>
  );
}
