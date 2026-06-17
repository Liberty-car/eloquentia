import { useCallback, useEffect, useRef, useState } from 'react';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import {
  deleteAttachment,
  listAttachments,
  openAttachment,
  uploadAttachment,
} from './attachmentsApi';
import type { Attachment, EntityType } from './types';

function formatTaille(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function PiecesJointes({
  entityType,
  entityId,
}: {
  entityType: EntityType;
  entityId: string;
}) {
  const [items, setItems] = useState<Attachment[]>([]);
  const [chargement, setChargement] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rafraichir = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      setItems(await listAttachments({ entityType, entityId }));
    } catch {
      setErreur('Impossible de charger les pièces jointes.');
    } finally {
      setChargement(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    void rafraichir();
  }, [rafraichir]);

  async function onFichier(file: File | undefined) {
    if (!file) return;
    setEnvoi(true);
    setErreur(null);
    try {
      await uploadAttachment({ entityType, entityId }, file);
      await rafraichir();
    } catch {
      setErreur(`Échec de l'envoi de « ${file.name} ».`);
    } finally {
      setEnvoi(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function onSupprimer(id: string) {
    setErreur(null);
    try {
      await deleteAttachment(id);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setErreur('Échec de la suppression.');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-encre">
          <Paperclip size={14} /> Pièces jointes
        </span>
        <Button
          type="button"
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={envoi}
        >
          <Upload size={14} /> {envoi ? 'Envoi…' : 'Ajouter'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => void onFichier(e.target.files?.[0])}
        />
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      {chargement ? (
        <p className="text-sm text-encre-3">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-encre-3">Aucune pièce jointe.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-projecteur/40 px-3 py-2 text-sm"
            >
              <button
                type="button"
                className="truncate text-left text-encre hover:underline"
                onClick={() => void openAttachment(a.id)}
              >
                {a.fileName}
              </button>
              <span className="ml-2 flex items-center gap-2 text-encre-3">
                {formatTaille(a.sizeBytes)}
                <button
                  type="button"
                  aria-label={`Supprimer ${a.fileName}`}
                  onClick={() => void onSupprimer(a.id)}
                  className="text-encre-3 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
