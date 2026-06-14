import { beforeEach, describe, expect, it } from 'vitest';
import { createCollectionStore } from './createCollectionStore';

interface Widget {
  id: string;
  name: string;
}

const seeder = (): Widget[] => [
  { id: 'w1', name: 'Alpha' },
  { id: 'w2', name: 'Beta' },
];

describe('createCollectionStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('démarre vide et non seedé', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    expect(await store.list()).toEqual([]);
    expect(await store.isSeeded()).toBe(false);
  });

  it('crée et relit un élément avec un id généré', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    expect(created.id).toBeTruthy();
    expect(await store.list()).toHaveLength(1);
    expect(await store.get(created.id)).toEqual(created);
  });

  it('met à jour un élément', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    const updated = await store.update(created.id, { name: 'Delta' });
    expect(updated.name).toBe('Delta');
    expect((await store.get(created.id))?.name).toBe('Delta');
  });

  it('supprime un élément', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    const created = await store.create({ name: 'Gamma' });
    await store.remove(created.id);
    expect(await store.list()).toEqual([]);
  });

  it('seed injecte les données de démo et marque comme seedé', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    await store.seed();
    expect(await store.list()).toHaveLength(2);
    expect(await store.isSeeded()).toBe(true);
  });

  it('clear vide la collection et le marqueur', async () => {
    const store = createCollectionStore<Widget>('test:widgets', seeder);
    await store.seed();
    await store.clear();
    expect(await store.list()).toEqual([]);
    expect(await store.isSeeded()).toBe(false);
  });
});
