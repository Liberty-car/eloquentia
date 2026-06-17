import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Campagne } from './types';
import { seedCampagnes } from './seed';

export const campagnesStore = createCollectionStore<Campagne>(
  'mail:campagnes',
  seedCampagnes,
);
