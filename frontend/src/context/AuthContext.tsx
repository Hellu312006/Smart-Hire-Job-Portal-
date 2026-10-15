import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDto, Role } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  role: Role | null;
  loading: boolean;
  login: (token: string, user: UserDto) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserContext: (partial: Partial<UserDto>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    const saved = localStorage.getItem('smarthire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smarthire_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('smarthire_token');
      if (storedToken) {
        try {
          const freshUser = await authApi.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('smarthire_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session expired or token invalid');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: UserDto) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('smarthire_token', newToken);
    localStorage.setItem('smarthire_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smarthire_token');
    localStorage.removeItem('smarthire_user');
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authApi.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('smarthire_user', JSON.stringify(freshUser));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  const updateUserContext = (partial: Partial<UserDto>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    setUser(updated);
    localStorage.setItem('smarthire_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
        loading,
        login,
        logout,
        refreshUser,
        updateUserContext,
      }}
    >
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
