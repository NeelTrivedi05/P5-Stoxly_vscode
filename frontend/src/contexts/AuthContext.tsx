import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    preferences?: string;
    updated_at: string;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { full_name?: string; avatar_url?: string; preferences?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Optionally verify token is still valid
      verifyToken(storedAccessToken);
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const user = await api.getCurrentUser(token);
      setUser(user);
    } catch (err) {
      // Token might be expired, clear it
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.login({ email, password });
      
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      
      // Store tokens
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Fetch user details
      const userData = await api.getCurrentUser(response.access_token);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.signup({
        email,
        password,
        full_name: fullName,
      });
      
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      
      // Store tokens
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Fetch user details
      const userData = await api.getCurrentUser(response.access_token);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string; preferences?: string }) => {
    try {
      setError(null);
      if (!accessToken) throw new Error('Not authenticated');
      
      const updatedUser = await api.updateProfile(accessToken, data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
