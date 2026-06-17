import { NavLink, Outlet } from 'react-router';
import {
  Calendar,
  ExternalLink,
  Home,
  LogOut,
  Mail,
  Users,
  Wallet,
} from 'lucide-react';
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
        <div className="flex justify-center pb-4">
          <img
            src="/logo.png"
            alt="Eloquentia Strasbourg"
            className="w-full object-contain"
          />
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          <a
            href="https://app.notion.com/p/3827b37b2a5780878bbbd975d1110a17?pvs=106"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 flex items-center gap-2.5 rounded-[10px] bg-gel-rose px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-velours"
          >
            <ExternalLink size={16} />
            Notion
          </a>
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
        <div className="px-3 pb-1">
          <Mascotte />
        </div>
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
    </div>
  );
}
