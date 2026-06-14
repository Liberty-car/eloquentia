import { useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/cn';
import { libelleBadge, toneBadge } from './badges';
import { ETAPES, ETAPE_LABELS, type Contact, type Etape } from './types';

function initiales(contact: Contact): string {
  return `${contact.prenom.charAt(0)}${contact.nom.charAt(0)}`.toUpperCase();
}

function formatDate(iso?: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('fr-FR');
}

function KanbanCard({
  contact,
  onSelect,
}: {
  contact: Contact;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: contact.id,
    });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  // Distinction clic / glisser : on memorise la position au pointerdown (en
  // phase de capture, sans gener dnd-kit) et on ignore le clic si le pointeur
  // a bouge (c'etait un drag, pas un clic d'ouverture de fiche).
  const depart = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onPointerDownCapture={(e) => {
        depart.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const d = depart.current;
        if (
          d &&
          (Math.abs(e.clientX - d.x) > 5 || Math.abs(e.clientY - d.y) > 5)
        ) {
          return;
        }
        onSelect();
      }}
      className={cn(
        'cursor-pointer rounded-xl border-2 border-projecteur bg-papier p-3',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar initials={initiales(contact)} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-encre">
            {contact.prenom} {contact.nom}
          </p>
          {contact.organisation && (
            <p className="truncate text-xs text-encre-3">
              {contact.organisation}
            </p>
          )}
        </div>
      </div>
      {contact.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {contact.badges.map((b) => (
            <Badge key={b} tone={toneBadge(b)}>
              {libelleBadge(b)}
            </Badge>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-encre-3">
        Dernière interaction : {formatDate(contact.dateDerniereInteraction)}
      </p>
    </div>
  );
}

function KanbanColumn({
  etape,
  contacts,
  onSelect,
}: {
  etape: Etape;
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: etape });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 flex-shrink-0 flex-col gap-2 rounded-xl bg-scene p-2',
        isOver && 'ring-2 ring-gel-rose',
      )}
    >
      <div className="flex items-center justify-between px-1 py-1 text-sm font-semibold text-encre">
        <span>{ETAPE_LABELS[etape]}</span>
        <span className="rounded-full bg-papier px-2 text-xs text-encre-3">
          {contacts.length}
        </span>
      </div>
      {contacts.map((contact) => (
        <KanbanCard
          key={contact.id}
          contact={contact}
          onSelect={() => onSelect(contact)}
        />
      ))}
    </div>
  );
}

export function KanbanView({
  contacts,
  onChangeEtape,
  onSelect,
}: {
  contacts: Contact[];
  onChangeEtape: (id: string, etape: Etape) => void;
  onSelect: (contact: Contact) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    onChangeEtape(String(active.id), over.id as Etape);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {ETAPES.map((etape) => (
          <KanbanColumn
            key={etape}
            etape={etape}
            contacts={contacts.filter((c) => c.etape === etape)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </DndContext>
  );
}
