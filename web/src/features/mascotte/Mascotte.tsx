import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { FxOverlay, Zzz } from './Fx';
import { MascottePanel } from './MascottePanel';
import { QuetiaSprite } from './QuetiaSprite';
import {
  expressionBande,
  fxPourReaction,
  rythmeIdle,
  type FxKind,
} from './sprites';
import { useMascotte } from './useMascotte';

interface FxActif {
  id: string;
  kind: FxKind;
  texte: string;
  positif: boolean;
  levelup: boolean;
}

const CONFETTIS = [
  { dx: -28, dy: -34, color: '#db6a8f' },
  { dx: -12, dy: -44, color: '#f5df4d' },
  { dx: 8, dy: -40, color: '#ffd777' },
  { dx: 26, dy: -32, color: '#ca3c66' },
  { dx: -22, dy: -18, color: '#f08aa6' },
  { dx: 22, dy: -16, color: '#f5df4d' },
];

export function Mascotte() {
  const m = useMascotte();
  const reduced = useReducedMotion() ?? false;
  const [panelOuvert, setPanelOuvert] = useState(false);
  const [fx, setFx] = useState<FxActif | null>(null);
  // Petit moment de joie quand on clique sur la créature (sourire + coeur).
  const [content, setContent] = useState(false);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function gererClic() {
    setPanelOuvert((o) => !o);
    setContent(true);
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => setContent(false), 1400);
  }

  useEffect(() => {
    return () => {
      if (contentTimer.current) clearTimeout(contentTimer.current);
    };
  }, []);

  const reactionId = m?.reaction?.id;
  useEffect(() => {
    if (!m?.reaction) return;
    const r = m.reaction;
    setFx({
      id: r.id,
      kind: fxPourReaction(r.type),
      texte: r.texte,
      positif: r.positif,
      levelup: r.type === 'levelup',
    });
    const duree = r.type === 'levelup' ? 2400 : 1700;
    const t = setTimeout(() => {
      setFx(null);
      m.clearReaction();
    }, duree);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionId]);

  if (!m) return null;

  // Contente au clic et pendant toute réaction positive (repas, contact conclu...).
  const joyeuse = content || (fx?.positif ?? false);
  const expression = joyeuse ? 'radieux' : expressionBande(m.humeurBande);
  const rythme = reduced ? '' : rythmeIdle(m.humeurBande);

  return (
    <div className="relative mt-3 flex flex-col items-start">
      {/* Panneau et bandeau en overlay, ouverts vers le haut */}
      <div className="absolute bottom-full left-0 z-40 mb-3 flex flex-col gap-2">
        <AnimatePresence>
          {panelOuvert && (
            <motion.div
              key="panel"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
              }
              animate={
                reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
              }
              transition={{ duration: 0.2 }}
            >
              <MascottePanel data={m} onClose={() => setPanelOuvert(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {fx?.levelup && (
            <motion.div
              key="banner"
              className="w-fit rounded-full border-2 border-projecteur bg-jaune-brume px-3 py-1 text-xs font-bold text-encre shadow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {m.nom} évolue !
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={gererClic}
        aria-label={`${m.stadeNom}, humeur ${m.bandeLabel}. Ouvrir le détail de ${m.nom}.`}
        aria-expanded={panelOuvert}
        className="pointer-events-auto relative grid h-20 w-20 place-items-center rounded-full border-2 border-projecteur bg-papier shadow-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <div className="relative h-16 w-16">
          <motion.div
            className="h-full w-full"
            animate={
              content && !reduced ? { scale: [1, 1.18, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <QuetiaSprite
              stade={m.stade}
              expression={expression}
              idleClassName={rythme}
              className="h-full w-full"
            />
          </motion.div>
          {m.humeurBande === 'epuise' && !content && !reduced && <Zzz />}

          <AnimatePresence>
            {content && (
              <>
                <motion.div
                  key="coeur-1"
                  className="pointer-events-none absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.4, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: -10 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <FxOverlay kind="coeur" />
                </motion.div>
                <motion.div
                  key="coeur-2"
                  className="pointer-events-none absolute left-1/2 top-1 h-3 w-3"
                  initial={{ opacity: 0, scale: 0.3, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: -8 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
                >
                  <FxOverlay kind="coeur" />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {fx && (
              <motion.div
                key={fx.id}
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {fx.kind !== 'levelup' && <FxOverlay kind={fx.kind} />}

                {fx.levelup &&
                  !reduced &&
                  CONFETTIS.map((c, i) => (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-[1px]"
                      style={{ backgroundColor: c.color }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ x: c.dx, y: c.dy, opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                    />
                  ))}

                <motion.span
                  className={cn(
                    'absolute left-1/2 top-0 -translate-x-1/2 text-xs font-extrabold tabular-nums',
                    fx.positif ? 'text-velours' : 'text-erreur',
                  )}
                  initial={{ opacity: 0, y: 6 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: -22 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.2 : 1.3 }}
                >
                  {fx.texte}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}
