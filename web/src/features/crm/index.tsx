import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { DemoDataToggle } from '../../components/DemoDataToggle';
import { contactsStore } from './store';
import { ContactCard } from './ContactCard';
import { ContactListView } from './ContactListView';
import { ContactFiche } from './ContactFiche';
import { CrmFilters } from './CrmFilters';
import { filterContacts, type ContactFilters } from './filter';
import type { Contact, ContactFormValues } from './types';

type Vue = 'cartes' | 'liste';

function aujourdhui(): string {
  return new Date().toISOString().slice(0, 10);
}

function vide(v: string): string | undefined {
  const t = v.trim();
  return t === '' ? undefined : t;
}

export default function CrmPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtres, setFiltres] = useState<ContactFilters>({
    recherche: '',
    badges: [],
    etape: 'toutes',
  });
  const [vue, setVue] = useState<Vue>('cartes');
  const [ficheOuverte, setFicheOuverte] = useState(false);
  const [contactEdite, setContactEdite] = useState<Contact | null>(null);

  const rafraichir = useCallback(() => {
    void contactsStore.list().then(setContacts);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const filtres_resultat = useMemo(
    () => filterContacts(contacts, filtres),
    [contacts, filtres],
  );

  function ouvrirCreation() {
    setContactEdite(null);
    setFicheOuverte(true);
  }

  function ouvrirEdition(contact: Contact) {
    setContactEdite(contact);
    setFicheOuverte(true);
  }

  async function enregistrer(values: ContactFormValues) {
    // Champs requis (toujours presents).
    const requis = {
      prenom: values.prenom.trim(),
      nom: values.nom.trim(),
      etape: values.etape,
      badges: values.badges,
    };
    // Champs optionnels : inclus uniquement quand non vides (exactOptionalPropertyTypes).
    const opts: Partial<
      Pick<
        Contact,
        'organisation' | 'fonction' | 'email' | 'telephone' | 'notes'
      >
    > = {};
    const org = vide(values.organisation);
    if (org !== undefined) opts.organisation = org;
    const fn = vide(values.fonction);
    if (fn !== undefined) opts.fonction = fn;
    const em = vide(values.email);
    if (em !== undefined) opts.email = em;
    const tel = vide(values.telephone);
    if (tel !== undefined) opts.telephone = tel;
    const nt = vide(values.notes);
    if (nt !== undefined) opts.notes = nt;

    if (contactEdite) {
      await contactsStore.update(contactEdite.id, {
        ...requis,
        ...opts,
        dateDerniereInteraction: aujourdhui(),
      });
    } else {
      await contactsStore.create({
        ...requis,
        ...opts,
        source: 'manuel',
        dateCreation: aujourdhui(),
        dateDerniereInteraction: aujourdhui(),
      });
    }
    setFicheOuverte(false);
    rafraichir();
  }

  async function supprimer() {
    if (contactEdite) {
      await contactsStore.remove(contactEdite.id);
    }
    setFicheOuverte(false);
    rafraichir();
  }

  const vide_total = contacts.length === 0;

  return (
    <>
      <PageHeader
        title="CRM"
        description="Contacts, prospection et badges."
        actions={
          <>
            <DemoDataToggle store={contactsStore} onChange={rafraichir} />
            <Button variant="primary" onClick={ouvrirCreation}>
              Nouveau contact
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-1.5">
        <Button
          variant={vue === 'cartes' ? 'primary' : 'ghost'}
          onClick={() => setVue('cartes')}
        >
          Cartes
        </Button>
        <Button
          variant={vue === 'liste' ? 'primary' : 'ghost'}
          onClick={() => setVue('liste')}
        >
          Liste
        </Button>
      </div>

      <CrmFilters value={filtres} onChange={setFiltres} />

      {vide_total ? (
        <EmptyState
          title="Aucun contact"
          description="Active les données de démo ou crée ton premier contact."
          action={
            <Button variant="primary" onClick={ouvrirCreation}>
              Nouveau contact
            </Button>
          }
        />
      ) : filtres_resultat.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description="Aucun contact ne correspond aux filtres."
        />
      ) : vue === 'liste' ? (
        <ContactListView contacts={filtres_resultat} onSelect={ouvrirEdition} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtres_resultat.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => ouvrirEdition(contact)}
            />
          ))}
        </div>
      )}

      <ContactFiche
        open={ficheOuverte}
        contact={contactEdite}
        onClose={() => setFicheOuverte(false)}
        onSave={enregistrer}
        onDelete={supprimer}
      />
    </>
  );
}
