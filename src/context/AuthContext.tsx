import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '../types';

export type AuthScreen = 'login' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  activeScreen: AuthScreen;
  resetTokenForRecovery?: string;
  setActiveScreen: (screen: AuthScreen) => void;
  setResetTokenForRecovery: (token: string) => void;
  clearError: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: UserRole;
    organization?: string;
    termsAccepted: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; resetToken?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'aicte_verifyai_token';
const TOKEN_EXPIRY_KEY = 'aicte_verifyai_token_expiry';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<AuthScreen>('login');
  const [resetTokenForRecovery, setResetTokenForRecovery] = useState<string | undefined>(undefined);

  const clearError = useCallback(() => setError(null), []);

  // Check existing session on boot
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
        const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY) || sessionStorage.getItem(TOKEN_EXPIRY_KEY);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        if (storedExpiry && Date.now() > parseInt(storedExpiry, 10)) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(TOKEN_EXPIRY_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Session verification error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Authentication failed. Please check your credentials.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_STORAGE_KEY, data.token);
      storage.setItem(TOKEN_EXPIRY_KEY, String(data.expiresAt));

      // Clear the other storage just in case
      if (rememberMe) {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
      }

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      const errMsg = 'Network or connection error. Please verify server connectivity.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const signup = async (formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: UserRole;
    organization?: string;
    termsAccepted: boolean;
  }) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Sign up registration failed.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(data.expiresAt));

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      const errMsg = 'Network error during account registration.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      setUser(null);
      setToken(null);
      setActiveScreen('login');
    }
  };

  const requestPasswordReset = async (email: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Password reset request failed.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      if (data.resetToken) {
        setResetTokenForRecovery(data.resetToken);
      }

      return { 
        success: true, 
        message: data.message, 
        resetToken: data.resetToken 
      };
    } catch (err: any) {
      const errMsg = 'Failed to dispatch password recovery request.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const resetPassword = async (tokenInput: string, newPassword: string, confirmPassword: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: tokenInput, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Password update failed.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setResetTokenForRecovery(undefined);
      return { success: true, message: data.message };
    } catch (err: any) {
      const errMsg = 'Failed to update password.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        activeScreen,
        resetTokenForRecovery,
        setActiveScreen,
        setResetTokenForRecovery,
        clearError,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
