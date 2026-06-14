import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import DashboardPage from './features/dashboard';
import PartnersPage from './features/partners';
import JuryPage from './features/jury';
import EventsPage from './features/events';
import TasksPage from './features/tasks';
import EmailingPage from './features/emailing';

// Routeur en mode librairie (React Router v7). Une route placeholder par
// feature. Les pages sont volontairement vides (fondations sans UI).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'jury', element: <JuryPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'emailing', element: <EmailingPage /> },
    ],
  },
]);
