// Fabrique de store de collection adossee a localStorage.
// Les methodes sont asynchrones pour rester compatibles avec un futur apiFetch.

export interface Identifiable {
  id: string;
}

export interface CollectionStore<T extends Identifiable> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, 'id'>>): Promise<T>;
  replace(id: string, data: Omit<T, 'id'>): Promise<T>;
  remove(id: string): Promise<void>;
  seed(): Promise<void>;
  clear(): Promise<void>;
  isSeeded(): Promise<boolean>;
}

function readRaw<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeRaw<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export function createCollectionStore<T extends Identifiable>(
  namespace: string,
  seeder: () => T[],
): CollectionStore<T> {
  const key = `eloquetia:${namespace}`;
  const seededKey = `${key}:seeded`;

  return {
    async list() {
      return readRaw<T>(key);
    },
    async get(id) {
      return readRaw<T>(key).find((item) => item.id === id) ?? null;
    },
    async create(data) {
      const items = readRaw<T>(key);
      const created = { ...data, id: generateId() } as unknown as T;
      writeRaw(key, [...items, created]);
      return created;
    },
    async update(id, patch) {
      const items = readRaw<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Élément introuvable : ${id}`);
      }
      const updated = { ...items[index], ...patch } as unknown as T;
      items[index] = updated;
      writeRaw(key, items);
      return updated;
    },
    async replace(id, data) {
      const items = readRaw<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Élément introuvable : ${id}`);
      }
      const remplace = { ...data, id } as unknown as T;
      items[index] = remplace;
      writeRaw(key, items);
      return remplace;
    },
    async remove(id) {
      const items = readRaw<T>(key).filter((item) => item.id !== id);
      writeRaw(key, items);
    },
    async seed() {
      writeRaw(key, seeder());
      localStorage.setItem(seededKey, 'true');
    },
    async clear() {
      localStorage.removeItem(key);
      localStorage.removeItem(seededKey);
    },
    async isSeeded() {
      return localStorage.getItem(seededKey) === 'true';
    },
  };
}
