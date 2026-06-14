import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cookie, Hand } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';
import { FxOverlay, Zzz } from './Fx';
import { QuetiaSprite } from './QuetiaSprite';
import { expressionBande, rythmeIdle } from './sprites';
import { useMascotte } from './useMascotte';
import type { HumeurBande } from './types';

const COULEUR_BANDE: Record<HumeurBande, string> = {
  epuise: 'bg-erreur',
  fatigue: 'bg-alerte',
  serein: 'bg-projecteur-doux',
  radieux: 'bg-gel-rose',
};

function couleurFaim(faim: number): string {
  if (faim >= 50) return 'bg-succes';
  if (faim >= 25) return 'bg-alerte';
  return 'bg-erreur';
}

// Étoiles fixes (pas d'aléatoire) pour le ciel nocturne.
const ETOILES = [
  { left: '12%', top: '18%' },
  { left: '28%', top: '34%' },
  { left: '46%', top: '14%' },
  { left: '62%', top: '40%' },
  { left: '82%', top: '24%' },
];

function Jauge({
  label,
  valeur,
  couleur,
}: {
  label: string;
  valeur: number;
  couleur: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-medium text-encre-3">
        <span>{label}</span>
        <span className="tabular-nums">{valeur}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-scene">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            couleur,
          )}
          style={{ width: `${valeur}%` }}
        />
      </div>
    </div>
  );
}

export function MascotteHabitat() {
  const m = useMascotte();
  const reduced = useReducedMotion() ?? false;
  const [content, setContent] = useState(false);
  const [snack, setSnack] = useState(false);
  const tContent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tSnack = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tContent.current) clearTimeout(tContent.current);
      if (tSnack.current) clearTimeout(tSnack.current);
    };
  }, []);

  if (!m) return null;

  const jouerContent = (d = 1400) => {
    setContent(true);
    if (tContent.current) clearTimeout(tContent.current);
    tContent.current = setTimeout(() => setContent(false), d);
  };
  const caresser = () => jouerContent();
  const nourrir = () => {
    if (!m.nourrir()) return;
    setSnack(true);
    if (tSnack.current) clearTimeout(tSnack.current);
    tSnack.current = setTimeout(() => setSnack(false), 1500);
    jouerContent(1500);
  };

  const joyeuse = content;
  const dort = m.nuit && !joyeuse;
  const expression = joyeuse
    ? 'radieux'
    : dort
      ? 'fatigue'
      : expressionBande(m.humeurBande);
  const rythme = reduced ? '' : rythmeIdle(m.humeurBande);
  const promene = !reduced && !dort && !joyeuse;
  const montrerZzz =
    !reduced && !content && (dort || m.humeurBande === 'epuise');
  const progression = Math.round(m.progressionStade * 100);

  return (
    <section className="mb-6 overflow-hidden rounded-xl border-2 border-projecteur bg-papier">
      {/* Scène */}
      <div
        className={cn(
          'relative h-44',
          m.nuit
            ? 'bg-gradient-to-b from-[#2b2550] to-[#4a3f73]'
            : 'bg-gradient-to-b from-[#dff0ff] to-[#fbe6ec]',
        )}
      >
        {/* Ciel */}
        {m.nuit ? (
          <>
            <div className="absolute right-6 top-4 h-8 w-8 rounded-full bg-[#fdf3c4] shadow-[0_0_18px_#fdf3c4aa]" />
            {ETOILES.map((e, i) => (
              <span
                key={i}
                className="quetia-etoile absolute h-1 w-1 rounded-full bg-white"
                style={{ left: e.left, top: e.top }}
              />
            ))}
          </>
        ) : (
          <div className="absolute right-6 top-4 h-9 w-9 rounded-full bg-projecteur shadow-[0_0_20px_#f5df4daa]" />
        )}

        {/* Sol */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 h-9',
            m.nuit ? 'bg-[#241f42]' : 'bg-[#f1e4cb]',
          )}
        />

        {/* Bulle de dialogue */}
        <div className="absolute left-4 top-3 max-w-[58%] rounded-2xl border border-trait bg-papier px-3 py-1.5 text-xs font-medium text-encre-2 shadow">
          {m.bulle}
        </div>

        {/* Quetia */}
        <div
          className={cn(
            'h-24 w-24',
            promene
              ? 'quetia-promenade'
              : 'absolute bottom-2 left-1/2 -translate-x-1/2',
          )}
        >
          <div className="relative h-full w-full">
            <motion.div
              className="h-full w-full"
              animate={
                content && !reduced ? { scale: [1, 1.15, 1] } : { scale: 1 }
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
              {snack && (
                <motion.div
                  key="snack"
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FxOverlay kind="snack" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {content &&
                [
                  { k: 'h1', cls: 'left-1/2 top-0 h-5 w-5', d: 0 },
                  { k: 'h2', cls: 'left-[58%] top-1 h-3 w-3', d: 0.08 },
                ].map((c) => (
                  <motion.div
                    key={c.k}
                    className={cn('pointer-events-none absolute', c.cls)}
                    initial={{ opacity: 0, scale: 0.4, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: -12 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.5, delay: c.d, ease: 'easeOut' }}
                  >
                    <FxOverlay kind="coeur" />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Infos + actions */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-extrabold text-encre">{m.stadeNom}</p>
            <p className="text-xs text-encre-3">
              Humeur {m.bandeLabel} - {m.xp} XP
              {m.streak > 1 ? ` - ${m.streak} jours d'activité` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={caresser}>
              <Hand size={16} />
              Caresser
            </Button>
            <Button
              variant="primary"
              disabled={!m.peutNourrir}
              onClick={nourrir}
            >
              <Cookie size={16} />
              {m.peutNourrir ? 'Nourrir' : 'Rassasiée'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Jauge label="Évolution" valeur={progression} couleur="bg-gel-rose" />
          <Jauge
            label="Humeur"
            valeur={m.humeur}
            couleur={COULEUR_BANDE[m.humeurBande]}
          />
          <Jauge label="Faim" valeur={m.faim} couleur={couleurFaim(m.faim)} />
        </div>
      </div>
    </section>
  );
}
