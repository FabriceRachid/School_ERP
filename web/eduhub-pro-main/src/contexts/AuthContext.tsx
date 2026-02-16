import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, clearFrontendBundle, restoreFrontendBundle, saveFrontendBundle } from "@/data/mock-data";
import { loadWebBootstrap, loginFrontend } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

const USER_KEY = "erp_user";
const ACCESS_TOKEN_KEY = "erp_access_token";
const REFRESH_TOKEN_KEY = "erp_refresh_token";
const BOOT_GUARD_KEY = "erp_force_login_boot";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    if (!sessionStorage.getItem(BOOT_GUARD_KEY)) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      clearFrontendBundle();
      setUser(null);
      sessionStorage.setItem(BOOT_GUARD_KEY, "1");
    }
    restoreFrontendBundle();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = await loginFrontend(email, password);
      const appUser: User = {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        role: auth.user.role,
        schoolId: auth.user.schoolId,
      };

      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
      const bootstrap = await loadWebBootstrap(auth.accessToken);
      saveFrontendBundle(bootstrap);

      setUser(appUser);
      localStorage.setItem(USER_KEY, JSON.stringify(appUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearFrontendBundle();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
