// Overlays graphiques (FX) superposés au sprite lors des micro-réactions.
import type { FxKind } from './sprites';

function Etoile({
  x,
  y,
  r,
  fill,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
}) {
  // Étincelle à 4 branches.
  return (
    <path
      d={`M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`}
      fill={fill}
    />
  );
}

export function FxOverlay({ kind }: { kind: FxKind }) {
  if (kind === 'coeur') {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <path
          d="M60 40 q-8 -12 -20 -4 q-12 9 0 22 l20 18 l20 -18 q12 -13 0 -22 q-12 -8 -20 4 z"
          fill="#db6a8f"
          opacity={0.92}
        />
      </svg>
    );
  }
  if (kind === 'etincelles') {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <Etoile x={32} y={36} r={9} fill="#f5df4d" />
        <Etoile x={92} y={30} r={7} fill="#db6a8f" />
        <Etoile x={84} y={64} r={6} fill="#f5df4d" />
        <Etoile x={28} y={70} r={5} fill="#ffd777" />
      </svg>
    );
  }
  if (kind === 'sueur') {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <path
          d="M86 36 q6 10 0 15 q-6 -5 0 -15 z"
          fill="#7cc7e0"
          stroke="#57b0cf"
          strokeWidth={1}
        />
      </svg>
    );
  }
  // levelup : géré dans le widget (confettis + bandeau)
  return null;
}

// Petits « z » de sommeil pour la bande épuisée (animation CSS).
export function Zzz() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="quetia-zzz absolute -right-1 -top-1 h-6 w-6"
      aria-hidden="true"
    >
      <text x={6} y={18} fontSize={12} fontWeight={800} fill="#9aa0ad">
        z
      </text>
      <text x={16} y={12} fontSize={9} fontWeight={800} fill="#b8bcc6">
        z
      </text>
      <text x={24} y={8} fontSize={7} fontWeight={800} fill="#cdd0d8">
        z
      </text>
    </svg>
  );
}
