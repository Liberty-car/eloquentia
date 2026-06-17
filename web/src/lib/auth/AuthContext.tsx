import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tokenStore } from './tokenStore';

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email: string) => {
        // Jeton EN MEMOIRE seulement. En dev, on peut injecter un vrai JWT
        // (issu de `npm run mint-token`) via VITE_DEV_TOKEN pour que les appels
        // backend authentifiés (ex. pièces jointes) fonctionnent. Sinon, jeton
        // factice : l'app locale (localStorage) reste utilisable, mais les
        // routes backend renverront 401.
        const devToken = import.meta.env.VITE_DEV_TOKEN as string | undefined;
        tokenStore.set(devToken && devToken.length > 0 ? devToken : 'factice');
        setUser({ email });
      },
      logout: () => {
        tokenStore.clear();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return ctx;
}
