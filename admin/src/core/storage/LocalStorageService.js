import { useState, useEffect } from 'react';

// LocalStorage servisi
const STORAGE_KEY = 'kepekci-lens-admin';
const SESSION_KEY = 'kepekci-lens-session';

export class LocalStorageService {
  static getConfig() {
    return this.get(STORAGE_KEY);
  }

  static setConfig(config) {
    this.set(STORAGE_KEY, config);
  }

  // Generic methods extended for RuleEngine and others
  static get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }
}

export class SessionService {
  static getSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Session okuma hatası:', error);
      return null;
    }
  }

  static setSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Session yazma hatası:', error);
    }
  }

  static clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Session silme hatası:', error);
    }
  }

  static isAuthenticated() {
    const session = this.getSession();
    if (!session || !session.userId) {
      return false;
    }

    const now = Date.now();
    const sessionTime = new Date(session.timestamp);
    const diffMinutes = (now - sessionTime.getTime()) / 60000;

    return diffMinutes < 30;
  }
}

// Hook for components to use
export const useAuth = () => {
  const [session, setSession] = useState(SessionService.getSession());

  const logout = () => {
    SessionService.clearSession();
    setSession(null);
    window.location.reload();
  };

  return { session, logout };
};
