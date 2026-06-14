// Taxonomie synchrone adossée à localStorage, auto-initialisée aux valeurs par
// défaut à la première lecture. Indépendante du cycle « données de démo » :
// ces listes sont de la configuration applicative, jamais vidées par la démo.

export interface ItemTaxonomie {
  id: string;
  label: string;
  protege?: boolean; // entrée structurante : non supprimable
}

function slug(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function createTaxonomy<T extends ItemTaxonomie>(
  cle: string,
  defauts: T[],
) {
  const storageKey = `eloquetia:${cle}`;

  function lire(): T[] {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      localStorage.setItem(storageKey, JSON.stringify(defauts));
      return defauts;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0
        ? (parsed as T[])
        : defauts;
    } catch {
      return defauts;
    }
  }

  function ecrire(items: T[]): void {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function idUnique(label: string, items: T[]): string {
    const base = slug(label) || 'item';
    let id = base;
    let n = 2;
    while (items.some((i) => i.id === id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    return id;
  }

  return {
    liste: lire,
    item: (id: string): T | null => lire().find((i) => i.id === id) ?? null,
    label: (id: string): string => lire().find((i) => i.id === id)?.label ?? id,
    ajouter: (donnees: Omit<T, 'id'>): T => {
      const items = lire();
      const item = {
        ...donnees,
        id: idUnique(donnees.label, items),
      } as unknown as T;
      ecrire([...items, item]);
      return item;
    },
    supprimer: (id: string): boolean => {
      const items = lire();
      const cible = items.find((i) => i.id === id);
      if (!cible || cible.protege) return false;
      ecrire(items.filter((i) => i.id !== id));
      return true;
    },
  };
}
