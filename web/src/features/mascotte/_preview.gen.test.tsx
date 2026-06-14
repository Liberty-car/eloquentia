import { it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { QuetiaSprite } from './QuetiaSprite';
import { FxOverlay } from './Fx';

it('génère un aperçu de l’état content', () => {
  const sprite = renderToStaticMarkup(
    <QuetiaSprite stade={2} expression="radieux" size={150} />,
  );
  const coeur = renderToStaticMarkup(<FxOverlay kind="coeur" />);
  // Deux petits coeurs au-dessus de la tête (viewBox coeur = 120).
  const c1 = `<g transform="translate(70 -6) scale(0.22)">${coeur}</g>`;
  const c2 = `<g transform="translate(96 0) scale(0.14)">${coeur}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#fbfaf8"/><g transform="translate(25 30)">${sprite}${c1}${c2}</g></svg>`;
  writeFileSync('/tmp/quetia-content.svg', svg);
});
