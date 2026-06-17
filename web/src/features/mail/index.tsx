import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { cn } from '../../lib/cn';
import { campagnesStore } from './store';
import { contactsStore } from '../crm/store';
import { compterDestinataires } from './recipients';
import { MailViewSwitcher } from './MailViewSwitcher';
import { ComposerView } from './ComposerView';
import { LeadCaptureView } from './LeadCaptureView';
import { HistoriqueView } from './HistoriqueView';
import { CampagneFiche } from './CampagneFiche';
import type { Campagne, ComposerValues, LeadFormValues } from './types';
import type { VueMail } from './views';
import type { Contact } from '../crm/types';

const AUJOURDHUI = '2026-06-14';

export default function MailPage() {
  const [vue, setVue] = useState<VueMail>('composer');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [demo, setDemo] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fiche, setFiche] = useState<{
    open: boolean;
    campagne: Campagne | null;
  }>({ open: false, campagne: null });

  const rafraichir = useCallback(() => {
    void contactsStore.list().then(setContacts);
    void campagnesStore.list().then(setCampagnes);
    void campagnesStore.isSeeded().then(setDemo);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) await campagnesStore.clear();
    else await campagnesStore.seed();
    rafraichir();
  }

  async function creerLead(values: LeadFormValues) {
    const opts: Partial<Pick<Contact, 'organisation' | 'email' | 'notes'>> = {};
    if (values.organisation) opts.organisation = values.organisation;
    if (values.email) opts.email = values.email;
    if (values.message) opts.notes = values.message;
    await contactsStore.create({
      prenom: values.prenom,
      nom: values.nom,
      badges: ['lead'],
      etape: 'a_contacter',
      source: 'formulaire',
      dateCreation: AUJOURDHUI,
      ...opts,
    });
    setMessage(`Lead « ${values.prenom} ${values.nom} » ajouté au CRM.`);
    rafraichir();
  }

  async function envoyerCampagne(values: ComposerValues) {
    const destinataires = compterDestinataires(contacts, values.segment);
    await campagnesStore.create({
      sujet: values.sujet,
      corps: values.corps,
      segment: values.segment,
      destinataires,
      date: AUJOURDHUI,
      statut: 'envoye',
    });
    setMessage(
      `Campagne « ${values.sujet} » envoyée à ${destinataires} destinataire${destinataires > 1 ? 's' : ''} (simulation).`,
    );
    rafraichir();
    setVue('historique');
  }

  async function modifierCampagne(values: ComposerValues) {
    if (!fiche.campagne) return;
    const destinataires = compterDestinataires(contacts, values.segment);
    await campagnesStore.replace(fiche.campagne.id, {
      sujet: values.sujet,
      corps: values.corps,
      segment: values.segment,
      destinataires,
      date: fiche.campagne.date,
      statut: 'envoye',
    });
    setFiche({ open: false, campagne: null });
    setMessage(`Campagne « ${values.sujet} » mise à jour.`);
    rafraichir();
  }

  async function supprimerCampagne() {
    if (fiche.campagne) await campagnesStore.remove(fiche.campagne.id);
    setFiche({ open: false, campagne: null });
    rafraichir();
  }

  function changerVue(v: VueMail) {
    setMessage(null);
    setVue(v);
  }

  return (
    <>
      <PageHeader
        title="Mail marketing"
        description="Capture de leads, campagnes segmentées et historique (envoi simulé)."
        actions={
          <button
            type="button"
            onClick={() => void basculerDemo()}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors',
              demo
                ? 'border-gel-rose bg-rose-brume text-velours'
                : 'border-trait-fort bg-papier text-encre-2',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                demo ? 'bg-gel-rose' : 'bg-encre-4',
              )}
            />
            Données de démo {demo ? 'activées' : 'désactivées'}
          </button>
        }
      />

      <div className="mb-4">
        <MailViewSwitcher value={vue} onChange={changerVue} />
      </div>

      {message && (
        <div className="mb-4 rounded-[10px] border border-gel-rose bg-rose-brume px-4 py-2 text-sm font-medium text-velours">
          {message}
        </div>
      )}

      {vue === 'composer' && (
        <ComposerView contacts={contacts} onSend={envoyerCampagne} />
      )}
      {vue === 'leads' && <LeadCaptureView onSubmit={creerLead} />}
      {vue === 'historique' && (
        <HistoriqueView
          campagnes={campagnes}
          onSelect={(c) => setFiche({ open: true, campagne: c })}
        />
      )}

      <CampagneFiche
        open={fiche.open}
        campagne={fiche.campagne}
        contacts={contacts}
        onClose={() => setFiche({ open: false, campagne: null })}
        onSave={modifierCampagne}
        onDelete={supprimerCampagne}
      />
    </>
  );
}
