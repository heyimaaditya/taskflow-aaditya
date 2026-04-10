import React, { useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import type { User, AuthResponse } from '../types';
import { ApiClientError } from '../api/client';

const TOKEN_KEY = 'taskflow-token';
const USER_KEY = 'taskflow-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const isLoading = false;

  const saveAuth = useCallback((authResponse: AuthResponse) => {
    setToken(authResponse.token);
    setUser(authResponse.user);
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(
        data.error || 'Login failed',
        response.status,
        data.fields
      );
    }

    saveAuth(data);
  }, [saveAuth]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(
        data.error || 'Registration failed',
        response.status,
        data.fields
      );
    }

    saveAuth(data);
  }, [saveAuth]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};