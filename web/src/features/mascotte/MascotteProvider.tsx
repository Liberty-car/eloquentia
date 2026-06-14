import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { STORE_CHANGE_EVENT } from '../../lib/store/createCollectionStore';
import { contactsStore } from '../crm/store';
import { evenementsStore, tachesStore } from '../calendar/store';
import { mouvementsStore } from '../accounting/store';
import { campagnesStore } from '../mail/store';
import { computeFaim, conseil, infoStade, tachesEnRetard } from './compute';
import { BANDES, FAIM_SEUIL_REPAS, NOM } from './config';
import {
  ecrireMascotte,
  lireMascotte,
  nourrir as nourrirState,
  recalculer,
  renommer as renommerState,
} from './store';
import { MascotteContext, type MascotteContexte } from './useMascotte';
import type { DonneesMascotte, MascotteState, Reaction } from './types';

const DEBOUNCE_MS = 150;
const RAFRAICHIR_MS = 60_000; // tic lent pour faire vivre faim et cycle jour/nuit

function aujourdHui(): string {
  return new Date().toISOString().slice(0, 10);
}
function maintenantIso(): string {
  return new Date().toISOString();
}

async function chargerDonnees(): Promise<DonneesMascotte> {
  const [contacts, taches, evenements, mouvements, campagnes] =
    await Promise.all([
      contactsStore.list(),
      tachesStore.list(),
      evenementsStore.list(),
      mouvementsStore.list(),
      campagnesStore.list(),
    ]);
  return { contacts, taches, evenements, mouvements, campagnes };
}

export function MascotteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MascotteState | null>(() =>
    lireMascotte(),
  );
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [conseilTexte, setConseilTexte] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recompute = useCallback(async () => {
    const data = await chargerDonnees();
    const today = aujourdHui();
    const precedent = lireMascotte();
    const { state: next, reaction: r } = recalculer(
      data,
      today,
      maintenantIso(),
      precedent,
    );
    ecrireMascotte(next);
    setState(next);
    if (r) setReaction(r);
    const info = infoStade(next.stade, next.xp);
    setConseilTexte(
      conseil({
        humeurBande: next.humeurBande,
        stade: next.stade,
        progressionStade: info.progressionStade,
        tachesEnRetard: tachesEnRetard(data, today),
      }),
    );
  }, []);

  useEffect(() => {
    void recompute();
    const planifier = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void recompute();
      }, DEBOUNCE_MS);
    };
    window.addEventListener(STORE_CHANGE_EVENT, planifier);
    window.addEventListener('storage', planifier);
    const tic = setInterval(() => void recompute(), RAFRAICHIR_MS);
    return () => {
      window.removeEventListener(STORE_CHANGE_EVENT, planifier);
      window.removeEventListener('storage', planifier);
      if (timer.current) clearTimeout(timer.current);
      clearInterval(tic);
    };
  }, [recompute]);

  const clearReaction = useCallback(() => setReaction(null), []);

  const nourrir = useCallback((): boolean => {
    const maintenant = maintenantIso();
    const precedent = lireMascotte();
    if (!precedent) return false;
    const rassasiee = nourrirState(precedent, maintenant);
    if (!rassasiee) return false;
    ecrireMascotte(rassasiee);
    setReaction({
      id: `repas-${maintenant}`,
      type: 'repas',
      texte: 'Miam !',
      positif: true,
    });
    void recompute();
    return true;
  }, [recompute]);

  const renommer = useCallback((nom: string) => {
    const precedent = lireMascotte();
    if (!precedent) return;
    const renomme = renommerState(precedent, nom);
    ecrireMascotte(renomme);
    setState(renomme);
  }, []);

  const value = useMemo<MascotteContexte | null>(() => {
    if (!state) return null;
    const info = infoStade(state.stade, state.xp);
    const bande = BANDES.find((b) => b.bande === state.humeurBande);
    const faim = computeFaim(state.dernierRepas, maintenantIso());
    const nom = state.nom ?? NOM;
    // « Quetia adulte » -> « <nom> adulte » si la mascotte a été renommée.
    const stadeNom = info.nom.replace(NOM, nom);
    return {
      nom,
      xp: state.xp,
      stade: state.stade,
      stadeNom,
      progressionStade: info.progressionStade,
      xpDansStade: info.xpDansStade,
      xpStadeSuivant: info.xpStadeSuivant,
      humeur: state.humeur,
      humeurBande: state.humeurBande,
      bandeLabel: bande?.label ?? '',
      journal: state.journal,
      conseil: conseilTexte,
      reaction,
      clearReaction,
      faim,
      peutNourrir: faim < FAIM_SEUIL_REPAS,
      nourrir,
      streak: state.streak,
      renommer,
    };
  }, [state, reaction, conseilTexte, clearReaction, nourrir, renommer]);

  return (
    <MascotteContext.Provider value={value}>
      {children}
    </MascotteContext.Provider>
  );
}
