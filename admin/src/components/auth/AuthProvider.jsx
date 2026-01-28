// Auth Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../security/PasswordHash';
import { SessionService } from '../storage/LocalStorageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const savedSession = SessionService.getSession();
      if (savedSession && SessionService.isAuthenticated()) {
        setSession(savedSession);
        return;
      }
      
      SessionService.clearSession();
      setSession(null);
    };
    
    checkAuth();
  }, []);

  const login = async (password) => {
    setLoading(true);
    setError(null);
    
    const result = await AuthService.login(password);
    
    if (result.success) {
      const userId = 'admin';
      const newSession = {
        userId,
        timestamp: Date.now(),
      };
      
      SessionService.setSession(newSession);
      setSession(newSession);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const logout = () => {
    SessionService.clearSession();
    setSession(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
