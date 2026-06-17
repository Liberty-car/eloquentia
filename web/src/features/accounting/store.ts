import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Mouvement } from './types';
import { seedMouvements } from './seed';

export const mouvementsStore = createCollectionStore<Mouvement>(
  'accounting:mouvements',
  seedMouvements,
);
