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
import { conseil, infoStade, tachesEnRetard } from './compute';
import { BANDES, NOM } from './config';
import { ecrireMascotte, lireMascotte, recalculer } from './store';
import { MascotteContext, type MascotteContexte } from './useMascotte';
import type { DonneesMascotte, MascotteState, Reaction } from './types';

const DEBOUNCE_MS = 150;

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
    return () => {
      window.removeEventListener(STORE_CHANGE_EVENT, planifier);
      window.removeEventListener('storage', planifier);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [recompute]);

  const clearReaction = useCallback(() => setReaction(null), []);

  const value = useMemo<MascotteContexte | null>(() => {
    if (!state) return null;
    const info = infoStade(state.stade, state.xp);
    const bande = BANDES.find((b) => b.bande === state.humeurBande);
    return {
      nom: NOM,
      xp: state.xp,
      stade: state.stade,
      stadeNom: info.nom,
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
    };
  }, [state, reaction, conseilTexte, clearReaction]);

  return (
    <MascotteContext.Provider value={value}>
      {children}
    </MascotteContext.Provider>
  );
}
