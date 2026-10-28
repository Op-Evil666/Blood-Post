import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

import {
  loginUser as loginRequest,
  logoutUser as logoutRequest,
  getMe,
  refreshUser,
} from "../services/authService";

import { setAccessToken } from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await refreshUser();

        if (!response.accessToken) {
          throw new Error("Refresh response has no access token.");
        }

        if (cancelled) return;

        setAccessToken(response.accessToken);

        const profile = await getMe();

        if (!cancelled) {
          setUser(profile.user);
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (loginData) => {
    const response = await loginRequest(loginData);

    if (!response.accessToken) {
      throw new Error("Login response has no access token.");
    }

    setAccessToken(response.accessToken);

    try {
      const profile = await getMe();

      setUser(profile.user);
      return profile.user;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
