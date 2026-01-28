import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple auth service for demo purposes
const AUTH_PASSWORD = 'muzo123';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface Session {
  userId: string;
  timestamp: number;
}

interface AuthContextType {
  session: Session | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  sessionTimeRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSessionValid = (session: Session): boolean => {
    return Date.now() - session.timestamp < SESSION_TIMEOUT;
  };

  const getSessionTimeRemaining = (): number => {
    if (!session) return 0;
    const remaining = SESSION_TIMEOUT - (Date.now() - session.timestamp);
    return Math.max(0, remaining);
  };

  useEffect(() => {
    const checkAuth = () => {
      const savedSession = localStorage.getItem('admin_session');
      if (savedSession) {
        try {
          const parsedSession: Session = JSON.parse(savedSession);
          if (isSessionValid(parsedSession)) {
            setSession(parsedSession);
            return;
          }
        } catch (error) {
          console.error('Error parsing saved session:', error);
        }
      }
      
      localStorage.removeItem('admin_session');
      setSession(null);
    };
    
    checkAuth();

    // Check session validity every minute
    const interval = setInterval(() => {
      if (session && !isSessionValid(session)) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const login = async (password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === AUTH_PASSWORD) {
      const newSession: Session = {
        userId: 'admin',
        timestamp: Date.now(),
      };
      
      localStorage.setItem('admin_session', JSON.stringify(newSession));
      setSession(newSession);
    } else {
      setError('Geçersiz şifre');
      throw new Error('Invalid password');
    }
    
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setSession(null);
    setError(null);
  };

  const contextValue: AuthContextType = {
    session,
    login,
    logout,
    loading,
    error,
    isAuthenticated: session !== null && isSessionValid(session),
    sessionTimeRemaining: getSessionTimeRemaining()
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};