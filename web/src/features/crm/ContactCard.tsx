import { Mail, Phone } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { libelleBadge, toneBadge } from './badges';
import { ETAPE_LABELS, type Contact } from './types';

function initiales(contact: Contact): string {
  return `${contact.prenom.charAt(0)}${contact.nom.charAt(0)}`.toUpperCase();
}

function formatDate(iso?: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('fr-FR');
}

export function ContactCard({
  contact,
  onClick,
}: {
  contact: Contact;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-transform hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar initials={initiales(contact)} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-encre">
            {contact.prenom} {contact.nom}
          </p>
          {(contact.fonction || contact.organisation) && (
            <p className="truncate text-xs text-encre-3">
              {[contact.fonction, contact.organisation]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
      </div>
      {contact.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {contact.badges.map((b) => (
            <Badge key={b} tone={toneBadge(b)}>
              {libelleBadge(b)}
            </Badge>
          ))}
        </div>
      )}
      {(contact.email || contact.telephone) && (
        <div className="mt-3 flex flex-col gap-0.5 text-xs text-encre-2">
          {contact.email && (
            <span className="inline-flex items-center gap-1.5 truncate">
              <Mail size={12} className="shrink-0" />
              {contact.email}
            </span>
          )}
          {contact.telephone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} className="shrink-0" />
              {contact.telephone}
            </span>
          )}
        </div>
      )}
      <div className="mt-3 flex flex-col gap-0.5 text-xs text-encre-3">
        <span>Étape : {ETAPE_LABELS[contact.etape]}</span>
        <span>
          Dernière interaction : {formatDate(contact.dateDerniereInteraction)}
        </span>
        {contact.prochaineRelance && (
          <span className="text-velours">
            Relance : {formatDate(contact.prochaineRelance)}
          </span>
        )}
      </div>
    </Card>
  );
}
