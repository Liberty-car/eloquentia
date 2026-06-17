import { Badge } from '../../components/ui/Badge';
import { libelleBadge, toneBadge } from './badges';
import { ETAPE_LABELS, type Contact } from './types';

function formatDate(iso?: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('fr-FR');
}

export function ContactListView({
  contacts,
  onSelect,
}: {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-trait bg-papier">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-trait text-left text-xs font-medium text-encre-3">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Organisation</th>
            <th className="px-4 py-3">Badges</th>
            <th className="px-4 py-3">Étape</th>
            <th className="px-4 py-3">Dernière interaction</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              onClick={() => onSelect(contact)}
              className="cursor-pointer border-b border-trait last:border-0 hover:bg-scene"
            >
              <td className="px-4 py-3 font-medium text-encre">
                {contact.prenom} {contact.nom}
              </td>
              <td className="px-4 py-3 text-encre-2">
                {contact.organisation ?? '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {contact.badges.map((b) => (
                    <Badge key={b} tone={toneBadge(b)}>
                      {libelleBadge(b)}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-encre-2">
                {ETAPE_LABELS[contact.etape]}
              </td>
              <td className="px-4 py-3 text-encre-3">
                {formatDate(contact.dateDerniereInteraction)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
