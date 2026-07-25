import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";

/**
 * AuthProvider
 * ------------
 * Talks to the real backend (/api/auth) with email/password + JWT.
 * The token and a lightweight user object are cached in localStorage so a
 * page refresh keeps the session alive without re-hitting the network on
 * every render.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TOKEN_KEY = "zapshift-token";
const USER_KEY = "zapshift-user";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, verify the cached token is still valid.
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const freshUser = { displayName: res.data.data.name, email: res.data.data.email };
        setUser(freshUser);
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = ({ token, user: apiUser }) => {
    const mappedUser = { displayName: apiUser.name, email: apiUser.email };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
    return mappedUser;
  };

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
      return persistSession(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      return persistSession(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const authInfo = { user, loading, setUser, login, signup, logout };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
