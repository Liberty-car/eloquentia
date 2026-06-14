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
import { CrmViewSwitcher } from './CrmViewSwitcher';
import { KanbanView } from './KanbanView';
import { GroupedByBadgeView } from './GroupedByBadgeView';
import { RelancesView } from './RelancesView';
import { CrmDashboardView } from './CrmDashboardView';
import { filterContacts, type ContactFilters } from './filter';
import { ajouterBadge, supprimerBadge } from './badges';
import type { Vue } from './views';
import type { BadgeId, Contact, ContactFormValues, Etape } from './types';
import { ContactImport } from './ContactImport';
import type { ImportRow } from './import';

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
  const [importOuvert, setImportOuvert] = useState(false);

  const rafraichir = useCallback(() => {
    void contactsStore.list().then(setContacts);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const resultatsFiltres = useMemo(
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

  async function changerEtape(id: string, etape: Etape) {
    // Pas d'ecriture si l'etape ne change pas (carte reposee sur sa colonne).
    const contact = contacts.find((c) => c.id === id);
    if (!contact || contact.etape === etape) return;
    await contactsStore.update(id, { etape });
    rafraichir();
  }

  async function enregistrer(values: ContactFormValues) {
    const requis = {
      prenom: values.prenom.trim(),
      nom: values.nom.trim(),
      etape: values.etape,
      badges: values.badges,
    };
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
      // Remplacement complet pour permettre de vider un champ optionnel.
      const complet: Omit<Contact, 'id'> = {
        ...requis,
        ...opts,
        source: contactEdite.source,
        dateCreation: contactEdite.dateCreation,
        dateDerniereInteraction: aujourdhui(),
      };
      if (contactEdite.prochaineRelance) {
        complet.prochaineRelance = contactEdite.prochaineRelance;
      }
      await contactsStore.replace(contactEdite.id, complet);
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

  function gererAjoutBadge(label: string) {
    ajouterBadge(label);
    rafraichir();
  }

  async function gererSuppressionBadge(id: BadgeId) {
    if (!supprimerBadge(id)) return;
    // Retirer le badge des contacts qui le portaient.
    const concernes = contacts.filter((c) => c.badges.includes(id));
    for (const c of concernes) {
      await contactsStore.update(c.id, {
        badges: c.badges.filter((b) => b !== id),
      });
    }
    // Retirer aussi le badge du filtre actif s'il y figurait.
    setFiltres((f) => ({ ...f, badges: f.badges.filter((b) => b !== id) }));
    rafraichir();
  }

  async function importer(rows: ImportRow[]) {
    for (const row of rows) {
      await contactsStore.create({
        ...row,
        badges: [],
        etape: 'a_contacter',
        source: 'import',
        dateCreation: aujourdhui(),
      });
    }
    setImportOuvert(false);
    rafraichir();
  }

  const aucunContact = contacts.length === 0;
  const tableau = vue === 'tableau';

  function rendreVue() {
    if (vue === 'tableau') {
      return <CrmDashboardView contacts={contacts} />;
    }
    if (resultatsFiltres.length === 0) {
      return (
        <EmptyState
          title="Aucun résultat"
          description="Aucun contact ne correspond aux filtres."
        />
      );
    }
    if (vue === 'liste') {
      return (
        <ContactListView contacts={resultatsFiltres} onSelect={ouvrirEdition} />
      );
    }
    if (vue === 'kanban') {
      return (
        <KanbanView
          contacts={resultatsFiltres}
          onChangeEtape={changerEtape}
          onSelect={ouvrirEdition}
        />
      );
    }
    if (vue === 'badges') {
      return (
        <GroupedByBadgeView
          contacts={resultatsFiltres}
          onSelect={ouvrirEdition}
        />
      );
    }
    if (vue === 'relances') {
      return (
        <RelancesView contacts={resultatsFiltres} onSelect={ouvrirEdition} />
      );
    }
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resultatsFiltres.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onClick={() => ouvrirEdition(contact)}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="CRM"
        description="Contacts, prospection et badges."
        actions={
          <>
            <DemoDataToggle store={contactsStore} onChange={rafraichir} />
            <Button variant="outline" onClick={() => setImportOuvert(true)}>
              Importer
            </Button>
            <Button variant="primary" onClick={ouvrirCreation}>
              Nouveau contact
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <CrmViewSwitcher value={vue} onChange={setVue} />
      </div>

      {!tableau && (
        <CrmFilters
          value={filtres}
          onChange={setFiltres}
          onAjouterBadge={gererAjoutBadge}
          onSupprimerBadge={gererSuppressionBadge}
        />
      )}

      {aucunContact ? (
        <EmptyState
          title="Aucun contact"
          description="Active les données de démo ou crée ton premier contact."
          action={
            <Button variant="primary" onClick={ouvrirCreation}>
              Nouveau contact
            </Button>
          }
        />
      ) : (
        rendreVue()
      )}

      <ContactFiche
        open={ficheOuverte}
        contact={contactEdite}
        onClose={() => setFicheOuverte(false)}
        onSave={enregistrer}
        onDelete={supprimer}
      />
      <ContactImport
        open={importOuvert}
        onClose={() => setImportOuvert(false)}
        onImport={importer}
      />
    </>
  );
}
