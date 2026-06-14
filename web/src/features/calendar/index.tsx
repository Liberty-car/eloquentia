import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SidePanel } from '../../components/ui/SidePanel';
import { cn } from '../../lib/cn';
import { evenementsStore, tachesStore } from './store';
import { MonthCalendar } from './MonthCalendar';
import { EvenementFiche } from './EvenementFiche';
import { TacheFiche } from './TacheFiche';
import { aujourdhuiIso, NOMS_MOIS } from './grille';
import type {
  Evenement,
  EvenementFormValues,
  Tache,
  TacheFormValues,
} from './types';

function vide(v: string): string | undefined {
  const t = v.trim();
  return t === '' ? undefined : t;
}

export default function CalendarPage() {
  const maintenant = new Date();
  const [annee, setAnnee] = useState(maintenant.getFullYear());
  const [mois, setMois] = useState(maintenant.getMonth());
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [demo, setDemo] = useState(false);

  const [dateChoisie, setDateChoisie] = useState(aujourdhuiIso());
  const [chooserOuvert, setChooserOuvert] = useState(false);
  const [evFiche, setEvFiche] = useState<{
    open: boolean;
    evenement: Evenement | null;
  }>({
    open: false,
    evenement: null,
  });
  const [tFiche, setTFiche] = useState<{ open: boolean; tache: Tache | null }>({
    open: false,
    tache: null,
  });

  const rafraichir = useCallback(() => {
    void evenementsStore.list().then(setEvenements);
    void tachesStore.list().then(setTaches);
    void evenementsStore.isSeeded().then(setDemo);
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  async function basculerDemo() {
    if (demo) {
      await evenementsStore.clear();
      await tachesStore.clear();
    } else {
      await evenementsStore.seed();
      await tachesStore.seed();
    }
    rafraichir();
  }

  function moisPrecedent() {
    setMois((m) => {
      if (m === 0) {
        setAnnee((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function moisSuivant() {
    setMois((m) => {
      if (m === 11) {
        setAnnee((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function ouvrirJour(iso: string) {
    setDateChoisie(iso);
    setChooserOuvert(true);
  }

  function nouvelEvenement(iso?: string) {
    if (iso) setDateChoisie(iso);
    setChooserOuvert(false);
    setEvFiche({ open: true, evenement: null });
  }

  function nouvelleTache(iso?: string) {
    if (iso) setDateChoisie(iso);
    setChooserOuvert(false);
    setTFiche({ open: true, tache: null });
  }

  async function enregistrerEvenement(values: EvenementFormValues) {
    const opts: Partial<Pick<Evenement, 'heure' | 'lieu' | 'description'>> = {};
    const heure = vide(values.heure);
    if (heure !== undefined) opts.heure = heure;
    const lieu = vide(values.lieu);
    if (lieu !== undefined) opts.lieu = lieu;
    const description = vide(values.description);
    if (description !== undefined) opts.description = description;
    const base = { titre: values.titre.trim(), date: values.date, ...opts };
    if (evFiche.evenement) {
      await evenementsStore.replace(evFiche.evenement.id, base);
    } else {
      await evenementsStore.create(base);
    }
    setEvFiche({ open: false, evenement: null });
    rafraichir();
  }

  async function supprimerEvenement() {
    if (evFiche.evenement) await evenementsStore.remove(evFiche.evenement.id);
    setEvFiche({ open: false, evenement: null });
    rafraichir();
  }

  async function enregistrerTache(values: TacheFormValues) {
    const opts: Partial<Pick<Tache, 'echeance' | 'description'>> = {};
    const echeance = vide(values.echeance);
    if (echeance !== undefined) opts.echeance = echeance;
    const description = vide(values.description);
    if (description !== undefined) opts.description = description;
    const base = {
      titre: values.titre.trim(),
      membre: values.membre,
      statut: values.statut,
      priorite: values.priorite,
      ...opts,
    };
    if (tFiche.tache) {
      await tachesStore.replace(tFiche.tache.id, base);
    } else {
      await tachesStore.create(base);
    }
    setTFiche({ open: false, tache: null });
    rafraichir();
  }

  async function supprimerTache() {
    if (tFiche.tache) await tachesStore.remove(tFiche.tache.id);
    setTFiche({ open: false, tache: null });
    rafraichir();
  }

  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Événements, tâches et échéances."
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
            <Button variant="outline" onClick={() => nouvelleTache()}>
              Nouvelle tâche
            </Button>
            <Button variant="primary" onClick={() => nouvelEvenement()}>
              Nouvel événement
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={moisPrecedent}
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </Button>
        <span className="min-w-44 text-center text-lg font-bold text-encre">
          {NOMS_MOIS[mois]} {annee}
        </span>
        <Button variant="ghost" onClick={moisSuivant} aria-label="Mois suivant">
          <ChevronRight size={18} />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAnnee(maintenant.getFullYear());
            setMois(maintenant.getMonth());
          }}
        >
          Aujourd'hui
        </Button>
      </div>

      <MonthCalendar
        annee={annee}
        mois={mois}
        evenements={evenements}
        taches={taches}
        aujourdhui={aujourdhuiIso()}
        onJourClic={ouvrirJour}
        onSelectEvenement={(e) => setEvFiche({ open: true, evenement: e })}
        onSelectTache={(t) => setTFiche({ open: true, tache: t })}
      />

      <SidePanel
        open={chooserOuvert}
        title={`Ajouter le ${dateChoisie}`}
        onClose={() => setChooserOuvert(false)}
      >
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={() => nouvelEvenement()}>
            Nouvel événement
          </Button>
          <Button variant="outline" onClick={() => nouvelleTache()}>
            Nouvelle tâche
          </Button>
        </div>
      </SidePanel>

      <EvenementFiche
        open={evFiche.open}
        evenement={evFiche.evenement}
        dateInitiale={dateChoisie}
        onClose={() => setEvFiche({ open: false, evenement: null })}
        onSave={enregistrerEvenement}
        onDelete={supprimerEvenement}
      />

      <TacheFiche
        open={tFiche.open}
        tache={tFiche.tache}
        dateInitiale={dateChoisie}
        onClose={() => setTFiche({ open: false, tache: null })}
        onSave={enregistrerTache}
        onDelete={supprimerTache}
      />
    </>
  );
}
