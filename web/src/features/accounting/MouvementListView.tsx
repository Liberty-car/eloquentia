import { CalendarDays } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import { formatEuros } from './format';
import { totaux } from './aggregate';
import { libelleCategorie, type Mouvement } from './types';

function formatDateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

export function MouvementListView({
  mouvements,
  evenements = [],
  titreVide = 'Aucun mouvement',
  descriptionVide = 'Active les données de démo ou ajoute un mouvement.',
  onSelect,
}: {
  mouvements: Mouvement[];
  evenements?: { id: string; titre: string }[];
  titreVide?: string;
  descriptionVide?: string;
  onSelect: (mouvement: Mouvement) => void;
}) {
  const titreParEvenement = new Map(evenements.map((e) => [e.id, e.titre]));
  if (mouvements.length === 0) {
    return <EmptyState title={titreVide} description={descriptionVide} />;
  }

  const t = totaux(mouvements);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border-2 border-projecteur bg-papier">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-trait text-xs uppercase tracking-wide text-encre-3">
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Libellé</th>
              <th className="px-4 py-2 font-medium">Catégorie</th>
              <th className="px-4 py-2 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((m) => (
              <tr
                key={m.id}
                onClick={() => onSelect(m)}
                className="cursor-pointer border-b border-trait last:border-0 transition-colors hover:bg-scene"
              >
                <td className="whitespace-nowrap px-4 py-3 text-encre-3">
                  {formatDateCourte(m.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-encre">
                        {m.libelle}
                      </span>
                      {m.previsionnel && <Badge tone="jaune">Prévision</Badge>}
                    </span>
                    {m.evenementId && titreParEvenement.has(m.evenementId) && (
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-scene px-2 py-0.5 text-[11px] font-medium text-encre-2">
                        <CalendarDays size={11} />
                        {titreParEvenement.get(m.evenementId)}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-encre-2">
                  {libelleCategorie(m.categorie)}
                </td>
                <td
                  className={cn(
                    'whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums',
                    m.type === 'revenu' ? 'text-succes' : 'text-erreur',
                  )}
                >
                  {m.type === 'revenu' ? '+' : '-'}
                  {formatEuros(m.montant)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
        <span className="text-encre-2">
          Revenus :{' '}
          <span className="font-semibold text-succes tabular-nums">
            {formatEuros(t.revenus)}
          </span>
        </span>
        <span className="text-encre-2">
          Dépenses :{' '}
          <span className="font-semibold text-erreur tabular-nums">
            {formatEuros(t.depenses)}
          </span>
        </span>
        <span className="text-encre-2">
          Résultat :{' '}
          <span
            className={cn(
              'font-bold tabular-nums',
              t.resultat >= 0 ? 'text-succes' : 'text-erreur',
            )}
          >
            {formatEuros(t.resultat)}
          </span>
        </span>
      </div>
    </div>
  );
}
