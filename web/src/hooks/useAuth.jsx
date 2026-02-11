import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = (data) => {
    const userData = {
      ...data,
      loginTime: new Date().toISOString(),
      sessionId: Math.random().toString(36).substr(2, 9)
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
    // Clear all app data on logout
    Object.keys(localStorage).forEach(key => {
      if (key !== 'theme') { // Keep theme preference
        localStorage.removeItem(key);
      }
    });
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const checkSession = () => {
    if (user && user.loginTime) {
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      // Auto logout after 24 hours
      if (hoursDiff > 24) {
        logout();
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      updateProfile,
      checkSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
