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

// Nuée de petits coeurs autour de la tête (caresse / clic).
const COEURS = [
  { left: '2%', top: '24%', size: 12, dx: -10, dy: -14, delay: 0 },
  { left: '20%', top: '2%', size: 16, dx: -6, dy: -22, delay: 0.05 },
  { left: '42%', top: '-10%', size: 14, dx: 0, dy: -26, delay: 0.1 },
  { left: '64%', top: '2%', size: 16, dx: 6, dy: -22, delay: 0.15 },
  { left: '84%', top: '24%', size: 12, dx: 10, dy: -14, delay: 0.2 },
  { left: '34%', top: '14%', size: 10, dx: -3, dy: -18, delay: 0.24 },
  { left: '58%', top: '14%', size: 10, dx: 3, dy: -18, delay: 0.28 },
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
  // La nuit, elle dort (sauf si on interagit avec elle).
  const dort = m.nuit && !joyeuse;
  const expression = joyeuse
    ? 'radieux'
    : dort
      ? 'fatigue'
      : expressionBande(m.humeurBande);
  const rythme = reduced ? '' : rythmeIdle(m.humeurBande);
  const montrerZzz =
    !reduced && !content && (dort || m.humeurBande === 'epuise');
  // Nuée de coeurs : au clic (content) ou lors d'une caresse.
  const montrerCoeurs = content || fx?.kind === 'coeurs';

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
          {montrerZzz && <Zzz />}

          <AnimatePresence>
            {montrerCoeurs &&
              COEURS.map((c, i) => (
                <motion.div
                  key={`coeur-${i}`}
                  className="pointer-events-none absolute"
                  style={{
                    left: c.left,
                    top: c.top,
                    height: c.size,
                    width: c.size,
                  }}
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                  animate={
                    reduced
                      ? { opacity: 1, scale: 1 }
                      : { opacity: [0, 1, 1, 0], scale: 1, x: c.dx, y: c.dy }
                  }
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduced ? 0.2 : 1.3,
                    delay: reduced ? 0 : c.delay,
                    ease: 'easeOut',
                  }}
                >
                  <FxOverlay kind="coeur" />
                </motion.div>
              ))}
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
                {fx.kind !== 'levelup' && fx.kind !== 'coeurs' && (
                  <FxOverlay kind={fx.kind} />
                )}

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

                {fx.texte && (
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}
