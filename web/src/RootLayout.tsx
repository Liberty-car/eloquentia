import { Link, Outlet } from 'react-router';

// Mise en page racine NEUTRE (squelette de navigation, sans design).
// Sert uniquement à relier les routes placeholder des futures features.
const links = [
  { path: '/', label: 'Tableau de bord' },
  { path: '/partners', label: 'Partenaires' },
  { path: '/jury', label: 'Jury' },
  { path: '/events', label: 'Événements' },
  { path: '/tasks', label: 'Tâches' },
  { path: '/emailing', label: 'Emailing' },
];

export function RootLayout() {
  return (
    <div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
