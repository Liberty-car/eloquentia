import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { AuthProvider } from './lib/auth/AuthContext';
import { MascotteProvider } from './features/mascotte/MascotteProvider';
import { router } from './router';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément racine #root introuvable');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <MascotteProvider>
        <RouterProvider router={router} />
      </MascotteProvider>
    </AuthProvider>
  </StrictMode>,
);
