import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { RequireAuth } from './components/RequireAuth';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home';
import CrmPage from './features/crm';
import CalendarPage from './features/calendar';
import MailPage from './features/mail';
import AccountingPage from './features/accounting';

// Routeur en mode librairie (React Router v7).
// /login est public ; les 5 onglets sont proteges par RequireAuth.
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'crm', element: <CrmPage /> },
          { path: 'calendrier', element: <CalendarPage /> },
          { path: 'mail', element: <MailPage /> },
          { path: 'comptabilite', element: <AccountingPage /> },
        ],
      },
    ],
  },
]);
