import { AuthService } from './PasswordHash';
import { SessionService } from '../storage/LocalStorageService';

const Auth = {
  check: () => {
    return SessionService.isAuthenticated();
  },
  
  login: async (password) => {
    try {
      const result = await AuthService.login(password);
      if (result.success) {
        // Create session
        const newSession = {
          userId: 'admin',
          timestamp: Date.now()
        };
        SessionService.setSession(newSession);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  
  logout: () => {
    SessionService.clearSession();
  }
};

export default Auth;
