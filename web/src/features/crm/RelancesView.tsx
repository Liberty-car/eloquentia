import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import type { Contact } from './types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR');
}

export function RelancesView({
  contacts,
  onSelect,
}: {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}) {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const avecRelance = contacts
    .filter((c) => c.prochaineRelance)
    .sort((a, b) => (a.prochaineRelance! < b.prochaineRelance! ? -1 : 1));

  if (avecRelance.length === 0) {
    return (
      <EmptyState
        title="Aucune relance planifiée"
        description="Renseigne une date de prochaine relance sur une fiche contact."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {avecRelance.map((contact) => {
        const enRetard = contact.prochaineRelance! < aujourdhui;
        return (
          <button
            key={contact.id}
            type="button"
            onClick={() => onSelect(contact)}
            className="flex items-center justify-between rounded-xl border border-trait bg-papier px-4 py-3 text-left transition-colors hover:bg-scene"
          >
            <span className="font-medium text-encre">
              {contact.prenom} {contact.nom}
              {contact.organisation && (
                <span className="ml-2 text-encre-3">
                  {contact.organisation}
                </span>
              )}
            </span>
            <span
              className={cn(
                'text-sm font-semibold tabular-nums',
                enRetard ? 'text-erreur' : 'text-encre-2',
              )}
            >
              {enRetard ? 'En retard - ' : ''}
              {formatDate(contact.prochaineRelance!)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
