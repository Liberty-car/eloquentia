import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QuetiaSprite } from './QuetiaSprite';

describe('QuetiaSprite', () => {
  it('met la taille du stade sur un groupe distinct de l’animation idle', () => {
    // Régression : un transform CSS (idle) écrase l'attribut transform SVG.
    // La mise à l'échelle par stade doit donc vivre sur un groupe parent que
    // l'animation ne touche pas.
    const { container } = render(
      <QuetiaSprite
        stade={4}
        expression="serein"
        idleClassName="quetia-idle"
      />,
    );
    const scaleG = container.querySelector('g[transform*="scale(1.08)"]');
    expect(scaleG).not.toBeNull();
    expect(scaleG?.getAttribute('class') ?? '').not.toContain('quetia-idle');
    expect(scaleG?.querySelector('g.quetia-idle')).not.toBeNull();
  });

  it('utilise une échelle différente selon le stade', () => {
    const { container } = render(
      <QuetiaSprite stade={1} expression="serein" />,
    );
    expect(
      container.querySelector('g[transform*="scale(0.78)"]'),
    ).not.toBeNull();
  });
});
