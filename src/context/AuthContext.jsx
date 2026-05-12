import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

function loadUser() {
  try {
    const u = localStorage.getItem('pelvi_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLogout = () => { setUser(null); };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  useEffect(() => {
    const { accessToken } = api.getTokens();
    if (accessToken && !user) {
      api.get('/auth/me').then(res => {
        if (res.success) {
          setUser(res.data);
          localStorage.setItem('pelvi_user', JSON.stringify(res.data));
        } else {
          api.clearTokens();
        }
      }).catch(() => {});
    }
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, rememberMe });
      if (!res.success) throw new Error(res.error);
      api.setTokens(res.data.accessToken, res.data.refreshToken);
      localStorage.setItem('pelvi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (!res.success) throw new Error(res.error);
      api.setTokens(res.data.accessToken, res.data.refreshToken);
      localStorage.setItem('pelvi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerClinician = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/clinician/register', data);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = api.getTokens();
    await api.post('/auth/logout', { refreshToken }).catch(() => {});
    api.clearTokens();
    setUser(null);
  }, []);

  const isAdmin = user && ['admin', 'superadmin'].includes(user.role);
  const isSuperAdmin = user?.role === 'superadmin';
  const isClinician = user?.role === 'clinician';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, registerClinician, logout, isAdmin, isSuperAdmin, isClinician }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
