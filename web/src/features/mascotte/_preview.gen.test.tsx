import { it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { QuetiaSprite } from './QuetiaSprite';
import type { Expression } from './sprites';
import type { Stade } from './types';

it('génère un aperçu SVG des sprites', () => {
  const stades: Stade[] = [1, 2, 3, 4];
  const exprs: Expression[] = ['radieux', 'serein', 'fatigue'];
  const cell = 160;
  let parts = '';
  exprs.forEach((e, row) =>
    stades.forEach((s, col) => {
      const inner = renderToStaticMarkup(
        <QuetiaSprite stade={s} expression={e} size={130} />,
      );
      const x = col * cell + 15;
      const y = row * cell + 10;
      parts += `<g transform="translate(${x} ${y})">${inner}<text x="65" y="150" font-size="12" text-anchor="middle" fill="#1f2937">stade ${s} / ${e}</text></g>`;
    }),
  );
  const w = 4 * cell + 30;
  const h = 3 * cell + 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#fbfaf8"/>${parts}</svg>`;
  writeFileSync('/tmp/quetia.svg', svg);
});
