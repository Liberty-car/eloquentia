import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import { mouvementsStore } from './store';
import { evenementsStore } from '../calendar/store';
import { ComptaViewSwitcher } from './ComptaViewSwitcher';
import { ComptaFilters } from './ComptaFilters';
import { MouvementListView } from './MouvementListView';
import { ComptaDashboardView } from './ComptaDashboardView';
import { PrevisionnelView } from './PrevisionnelView';
import { MouvementFiche } from './MouvementFiche';
import { BudgetEvenementPanel } from './BudgetEvenementPanel';
import { uploadAttachment } from '../attachments/attachmentsApi';
import { filterMouvements, type ComptaFiltres } from './filter';
import { mouvementsVersCsv, telechargerCsv } from './export';
import {
  ajouterCategorie,
  categorieParDefaut,
  supprimerCategorie,
  toutesCategories,
} from './categories';
import type { Mouvement, MouvementFormValues, TypeMouvement } from './types';
import type { VueCompta } from './views';

// Option d'événement enrichie de la date (pour le panneau budget).
interface OptionEvenement {
  id: string;
  titre: string;
  date: string;
}

const FILTRES_INITIAUX: ComptaFiltres = {
  recherche: '',
  type: 'tous',
  categorie: 'toutes',
  nature: 'toutes',
  evenement: 'tous',
};

export default function AccountingPage() {
  const [vue, setVue] = useState<VueCompta>('liste');
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [evenements, setEvenements] = useState<OptionEvenement[]>([]);
  const [demo, setDemo] = useState(false);
  const [filtres, setFiltres] = useState<ComptaFiltres>(FILTRES_INITIAUX);
  const [fiche, setFiche] = useState<{
    open: boolean;
    mouvement: Mouvement | null;
    evenementInitial: string;
    previsionnelInitial: boolean;
  }>({
    open: false,
    mouvement: null,
    evenementInitial: '',
    previsionnelInitial: false,
  });

  const rafraichir = useCallback(() => {
    void mouvementsStore.list().then(setMouvements);
    void mouvementsStore.isSeeded().then(setDemo);
    void evenementsStore
      .list()
      .then((evs) =>
        setEvenements(
          evs.map((e) => ({ id: e.id, titre: e.titre, date: e.date })),
        ),
      );
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) await mouvementsStore.clear();
    else await mouvementsStore.seed();
    rafraichir();
  }

  function fermerFiche() {
    setFiche({
      open: false,
      mouvement: null,
      evenementInitial: '',
      previsionnelInitial: false,
    });
  }

  function nouveau() {
    setFiche({
      open: true,
      mouvement: null,
      evenementInitial: '',
      previsionnelInitial: false,
    });
  }

  // Nouvelle ligne de budget pré-rattachée à un événement (prévisionnelle).
  function nouveauPourEvenement(evenementId: string) {
    setFiche({
      open: true,
      mouvement: null,
      evenementInitial: evenementId,
      previsionnelInitial: true,
    });
  }

  function selectionner(mouvement: Mouvement) {
    setFiche({
      open: true,
      mouvement,
      evenementInitial: '',
      previsionnelInitial: false,
    });
  }

  async function enregistrer(
    values: MouvementFormValues,
    fichierEnAttente?: File,
  ) {
    const montant = Math.max(0, Number(values.montant) || 0);
    const opts: Partial<Pick<Mouvement, 'evenementId' | 'justificatif'>> = {};
    if (values.evenementId) opts.evenementId = values.evenementId;
    const justificatif = values.justificatif.trim();
    if (justificatif) opts.justificatif = justificatif;
    const base = {
      type: values.type,
      libelle: values.libelle.trim(),
      montant,
      date: values.date,
      categorie: values.categorie,
      previsionnel: values.previsionnel,
      ...opts,
    };
    const cible = fiche.mouvement
      ? await mouvementsStore.replace(fiche.mouvement.id, base)
      : await mouvementsStore.create(base);

    // Justificatif obligatoire : on televerse le fichier en attente sur le
    // mouvement (nouvellement) cree. En cas d'echec, on annule la creation pour
    // ne jamais laisser un nouveau mouvement sans justificatif.
    if (fichierEnAttente) {
      try {
        await uploadAttachment(
          { entityType: 'mouvement', entityId: cible.id },
          fichierEnAttente,
        );
      } catch (e) {
        if (!fiche.mouvement) await mouvementsStore.remove(cible.id);
        rafraichir();
        throw e;
      }
    }

    fermerFiche();
    rafraichir();
  }

  async function supprimer() {
    if (fiche.mouvement) await mouvementsStore.remove(fiche.mouvement.id);
    fermerFiche();
    rafraichir();
  }

  function exporter() {
    telechargerCsv('comptabilite-eloquetia.csv', mouvementsVersCsv(mouvements));
  }

  function gererAjoutCategorie(label: string, type: TypeMouvement) {
    ajouterCategorie(label, type);
    rafraichir();
  }

  async function gererSuppressionCategorie(id: string) {
    const cible = toutesCategories().find((c) => c.id === id);
    if (!supprimerCategorie(id)) return;
    // Réaffecter les mouvements de cette catégorie vers « Autre » du même type.
    if (cible) {
      const defaut = categorieParDefaut(cible.type);
      const concernes = mouvements.filter((m) => m.categorie === id);
      for (const m of concernes) {
        await mouvementsStore.update(m.id, { categorie: defaut });
      }
    }
    setFiltres((f) => (f.categorie === id ? { ...f, categorie: 'toutes' } : f));
    rafraichir();
  }

  const filtres_appliques = useMemo(
    () => filterMouvements(mouvements, filtres),
    [mouvements, filtres],
  );

  // Événement sélectionné dans le filtre (hors 'tous'/'aucun').
  const evenementSelectionne =
    filtres.evenement !== 'tous' && filtres.evenement !== 'aucun'
      ? (evenements.find((e) => e.id === filtres.evenement) ?? null)
      : null;

  return (
    <>
      <PageHeader
        title="Comptabilité"
        description="Achats, revenus et prévisionnel."
        actions={
          <>
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
            <Button variant="outline" onClick={exporter}>
              Exporter (Excel/CSV)
            </Button>
            <Button variant="primary" onClick={nouveau}>
              Nouveau mouvement
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ComptaViewSwitcher value={vue} onChange={setVue} />
        {vue === 'liste' && (
          <ComptaFilters
            filtres={filtres}
            evenements={evenements}
            onChange={setFiltres}
          />
        )}
      </div>

      {vue === 'liste' && (
        <>
          {evenementSelectionne && (
            <BudgetEvenementPanel
              evenement={evenementSelectionne}
              mouvements={filtres_appliques}
              onAjouter={() => nouveauPourEvenement(evenementSelectionne.id)}
            />
          )}
          <MouvementListView
            mouvements={filtres_appliques}
            evenements={evenements}
            resetKey={JSON.stringify(filtres)}
            titreVide={
              evenementSelectionne
                ? 'Aucune ligne de budget'
                : 'Aucun mouvement'
            }
            descriptionVide={
              evenementSelectionne
                ? 'Ajoute une ligne au budget de cet événement avec le bouton ci-dessus.'
                : 'Active les données de démo ou ajoute un mouvement.'
            }
            onSelect={selectionner}
          />
        </>
      )}
      {vue === 'dashboard' && <ComptaDashboardView mouvements={mouvements} />}
      {vue === 'previsionnel' && (
        <PrevisionnelView mouvements={mouvements} onSelect={selectionner} />
      )}

      <MouvementFiche
        open={fiche.open}
        mouvement={fiche.mouvement}
        dateInitiale="2026-06-15"
        evenements={evenements}
        evenementInitial={fiche.evenementInitial}
        previsionnelInitial={fiche.previsionnelInitial}
        onClose={() => fermerFiche()}
        onSave={enregistrer}
        onDelete={supprimer}
        onAjouterCategorie={gererAjoutCategorie}
        onSupprimerCategorie={gererSuppressionCategorie}
      />
    </>
  );
}
