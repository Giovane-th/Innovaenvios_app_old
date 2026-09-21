import React, { createContext, useState, useEffect, useContext } from 'react';
import * as API from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('inn_token');
    const cached = localStorage.getItem('inn_user');
    if (token && cached) {
      try { setUser(JSON.parse(cached)); } catch { /* noop */ }
      // refresh in background
      API.me().then((u) => {
        setUser(u);
        localStorage.setItem('inn_user', JSON.stringify(u));
      }).catch(() => {
        localStorage.removeItem('inn_token');
        localStorage.removeItem('inn_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persist = (token, u) => {
    localStorage.setItem('inn_token', token);
    localStorage.setItem('inn_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => {
    const { access_token, user: u } = await API.login({ email, password });
    persist(access_token, u);
    return u;
  };

  const register = async (payload) => {
    const { access_token, user: u } = await API.register(payload);
    persist(access_token, u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('inn_token');
    localStorage.removeItem('inn_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await API.me();
    setUser(u);
    localStorage.setItem('inn_user', JSON.stringify(u));
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
