import { NavLink, Outlet } from 'react-router';
import { Calendar, Home, LogOut, Mail, Users, Wallet } from 'lucide-react';
import { useAuth } from './lib/auth/AuthContext';
import { Mascotte } from './features/mascotte/Mascotte';
import { cn } from './lib/cn';

const links = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/crm', label: 'CRM', icon: Users, end: false },
  { to: '/calendrier', label: 'Calendrier', icon: Calendar, end: false },
  { to: '/mail', label: 'Mail marketing', icon: Mail, end: false },
  { to: '/comptabilite', label: 'Comptabilité', icon: Wallet, end: false },
];

export function RootLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-scene">
      <aside className="flex w-62 flex-col border-r border-trait px-3 py-5">
        <div className="px-3 pb-6 text-xl font-extrabold text-encre">
          Eloquentia Strasbourg
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-jaune-brume font-semibold text-encre'
                    : 'text-encre-2 hover:bg-papier',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-encre-2 hover:bg-papier"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
        {user && (
          <span className="px-3 pt-1 text-xs text-encre-3">{user.email}</span>
        )}
      </aside>
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
      <Mascotte />
    </div>
  );
}
