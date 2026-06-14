import { createCollectionStore } from '../../lib/store/createCollectionStore';
import type { Contact } from './types';
import { seedContacts } from './seed';

// Store des contacts CRM (localStorage, prefixe eloquetia:crm:contacts).
export const contactsStore = createCollectionStore<Contact>(
  'crm:contacts',
  seedContacts,
);
