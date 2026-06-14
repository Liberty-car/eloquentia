import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Evenement, Tache } from './types';
import { seedEvenements, seedTaches } from './seed';

export const evenementsStore = createCollectionStore<Evenement>(
  'calendar:evenements',
  seedEvenements,
);
export const tachesStore = createCollectionStore<Tache>(
  'calendar:taches',
  seedTaches,
);
