import { ContactCard } from './ContactCard';
import { BADGES, BADGE_LABELS, type Contact } from './types';

export function GroupedByBadgeView({
  contacts,
  onSelect,
}: {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}) {
  const groupes = BADGES.map((badge) => ({
    badge,
    liste: contacts.filter((c) => c.badges.includes(badge)),
  })).filter((g) => g.liste.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {groupes.map(({ badge, liste }) => (
        <section key={badge}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-encre">
            {BADGE_LABELS[badge]}
            <span className="rounded-full bg-scene px-2 text-xs font-medium text-encre-3">
              {liste.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liste.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={() => onSelect(contact)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
