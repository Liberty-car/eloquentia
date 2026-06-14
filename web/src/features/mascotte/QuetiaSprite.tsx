// Créature « Quetia » : SVG paramétrique original (genre petit monstre kawaii
// rose et jaune), décliné par stade (silhouette qui grandit) et par expression.
import { useId } from 'react';
import { paramsStade, type Expression } from './sprites';
import type { Stade } from './types';

function Yeux({ expression }: { expression: Expression }) {
  if (expression === 'radieux') {
    return (
      <g className="quetia-yeux">
        {[48, 72].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={60} rx={5.2} ry={6.4} fill="#2b2536" />
            <circle cx={cx - 1.6} cy={57.6} r={1.9} fill="#ffffff" />
            <circle
              cx={cx + 1.4}
              cy={61.4}
              r={1}
              fill="#ffffff"
              opacity={0.8}
            />
          </g>
        ))}
      </g>
    );
  }
  if (expression === 'serein') {
    return (
      <g
        className="quetia-yeux"
        fill="none"
        stroke="#2b2536"
        strokeWidth={2.6}
        strokeLinecap="round"
      >
        <path d="M43 61 q5 4 10 0" />
        <path d="M67 61 q5 4 10 0" />
      </g>
    );
  }
  // fatigue / epuise : paupières lourdes
  return (
    <g
      className="quetia-yeux"
      fill="none"
      stroke="#2b2536"
      strokeWidth={2.6}
      strokeLinecap="round"
    >
      <path d="M43 60 q5 2.5 10 0" />
      <path d="M67 60 q5 2.5 10 0" />
    </g>
  );
}

function Bouche({ expression }: { expression: Expression }) {
  if (expression === 'radieux') {
    return (
      <g>
        <path d="M50 75 q10 13 20 0 q-10 5 -20 0 z" fill="#b73259" />
        <path d="M54 79 q6 4 12 0 q-6 2.5 -12 0 z" fill="#f08aa6" />
      </g>
    );
  }
  if (expression === 'serein') {
    return (
      <path
        d="M53 77 q7 6 14 0"
        fill="none"
        stroke="#b73259"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d="M55 79 q5 2.5 10 0"
      fill="none"
      stroke="#b73259"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  );
}

export function QuetiaSprite({
  stade,
  expression,
  idleClassName = '',
  className,
  size = 96,
}: {
  stade: Stade;
  expression: Expression;
  idleClassName?: string;
  className?: string;
  size?: number;
}) {
  const p = paramsStade(stade);
  const uid = useId().replace(/:/g, '');
  const gCorps = `corps-${uid}`;
  const gVentre = `ventre-${uid}`;
  const gAura = `aura-${uid}`;
  const chevron = expression === 'radieux' ? '#f5df4d' : '#ffe08a';

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gCorps} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1bdce" />
          <stop offset="1" stopColor="#db6a8f" />
        </linearGradient>
        <radialGradient id={gVentre} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fdeef3" />
          <stop offset="1" stopColor="#f7d9e3" />
        </radialGradient>
        <radialGradient id={gAura} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.75" />
          <stop offset="0.6" stopColor="#fbc9da" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fbc9da" stopOpacity="0" />
        </radialGradient>
      </defs>

      {p.aura && <circle cx={60} cy={62} r={52} fill={`url(#${gAura})`} />}

      {/* ombre portée */}
      <ellipse
        cx={60}
        cy={108}
        rx={26 * p.echelle}
        ry={5}
        fill="#1f2937"
        opacity={0.1}
      />

      {/* Groupe externe : taille du stade (attribut SVG, statique).
          Groupe interne : animation idle (transform CSS). Les deux sont séparés
          car un transform CSS écrase l'attribut transform SVG au lieu de s'y
          composer : les fusionner annulerait la mise à l'échelle par stade. */}
      <g transform={`translate(60 64) scale(${p.echelle}) translate(-60 -64)`}>
        <g className={idleClassName}>
          {/* crête jaune */}
          {p.crete && (
            <path
              d="M60 22 q5 8 0 16 q-5 -8 0 -16 z M52 26 q3 7 0 13 q-4 -7 0 -13 z M68 26 q-3 7 0 13 q4 -7 0 -13 z"
              fill="#f5df4d"
              stroke="#e6c93c"
              strokeWidth={0.8}
            />
          )}

          {/* oreilles */}
          <g fill={`url(#${gCorps})`} stroke="#c85b7e" strokeWidth={1.2}>
            <ellipse
              cx={40}
              cy={36}
              rx={9}
              ry={13}
              transform="rotate(-22 40 36)"
            />
            <ellipse
              cx={80}
              cy={36}
              rx={9}
              ry={13}
              transform="rotate(22 80 36)"
            />
          </g>
          <g fill="#ffd777">
            <ellipse
              cx={41}
              cy={35}
              rx={4}
              ry={6.5}
              transform="rotate(-22 41 35)"
            />
            <ellipse
              cx={79}
              cy={35}
              rx={4}
              ry={6.5}
              transform="rotate(22 79 35)"
            />
          </g>

          {/* corps */}
          <ellipse
            cx={60}
            cy={66}
            rx={36}
            ry={34}
            fill={`url(#${gCorps})`}
            stroke="#c85b7e"
            strokeWidth={1.4}
          />
          {/* ventre */}
          <ellipse cx={60} cy={74} rx={22} ry={20} fill={`url(#${gVentre})`} />

          {/* pattes */}
          <g fill="#cf6184">
            <ellipse cx={48} cy={98} rx={9} ry={6} />
            <ellipse cx={72} cy={98} rx={9} ry={6} />
          </g>

          {/* joues */}
          <circle cx={40} cy={70} r={6} fill={chevron} opacity={0.95} />
          <circle cx={80} cy={70} r={6} fill={chevron} opacity={0.95} />

          <Yeux expression={expression} />
          <Bouche expression={expression} />

          {/* goutte de sueur */}
          {expression === 'fatigue' && (
            <path
              d="M86 52 q3 5 0 7 q-3 -2 0 -7 z"
              fill="#7cc7e0"
              stroke="#57b0cf"
              strokeWidth={0.6}
            />
          )}

          {/* accessoire : petit micro (éloquence) */}
          {p.accessoire && (
            <g transform="rotate(20 96 80)">
              <rect
                x={94}
                y={78}
                width={3.4}
                height={16}
                rx={1.7}
                fill="#7b8190"
              />
              <circle cx={95.7} cy={76} r={5.5} fill="#3f4654" />
              <circle cx={95.7} cy={76} r={2.6} fill="#9aa0ad" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
