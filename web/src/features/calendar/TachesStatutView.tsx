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
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/cn';
import {
  PRIORITE_LABELS,
  STATUTS,
  STATUT_LABELS,
  type Statut,
  type Tache,
} from './types';

function CarteTache({
  tache,
  onSelect,
}: {
  tache: Tache;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: tache.id,
    });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
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
        'cursor-pointer rounded-xl border border-trait bg-papier p-3',
        isDragging && 'opacity-50',
      )}
    >
      <p className="text-sm font-medium text-encre">{tache.titre}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone="rose">{PRIORITE_LABELS[tache.priorite]}</Badge>
        <span className="text-xs text-encre-3">{tache.membre}</span>
      </div>
    </div>
  );
}

function Colonne({
  statut,
  taches,
  onSelect,
}: {
  statut: Statut;
  taches: Tache[];
  onSelect: (tache: Tache) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: statut });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 flex-shrink-0 flex-col gap-2 rounded-xl bg-scene p-2',
        isOver && 'ring-2 ring-gel-rose',
      )}
    >
      <div className="flex items-center justify-between px-1 py-1 text-sm font-semibold text-encre">
        <span>{STATUT_LABELS[statut]}</span>
        <span className="rounded-full bg-papier px-2 text-xs text-encre-3">
          {taches.length}
        </span>
      </div>
      {taches.map((tache) => (
        <CarteTache
          key={tache.id}
          tache={tache}
          onSelect={() => onSelect(tache)}
        />
      ))}
    </div>
  );
}

export function TachesStatutView({
  taches,
  onChangeStatut,
  onSelectTache,
}: {
  taches: Tache[];
  onChangeStatut: (id: string, statut: Statut) => void;
  onSelectTache: (tache: Tache) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    onChangeStatut(String(active.id), over.id as Statut);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUTS.map((statut) => (
          <Colonne
            key={statut}
            statut={statut}
            taches={taches.filter((t) => t.statut === statut)}
            onSelect={onSelectTache}
          />
        ))}
      </div>
    </DndContext>
  );
}
