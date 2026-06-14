import '@testing-library/jest-dom';

// jsdom n'implémente pas matchMedia : polyfill minimal requis par framer-motion
// (useReducedMotion) et par toute requête média.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
