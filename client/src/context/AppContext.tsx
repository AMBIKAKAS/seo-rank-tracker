/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import type { AxiosInstance } from "axios";
import axios from "axios";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  plan: string;
  email: string;
  analysiscount?: number;
}

interface AppContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  api: AxiosInstance;

  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
  }>;

  register(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
  }>;

  logout(): void;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

const AppContext = createContext<
  AppContextType | undefined
>(undefined);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [loading, setLoading] =
    useState(true);

  // AXIOS INSTANCE

  const api = axios.create({
    baseURL: BACKEND_URL,
  });

  // UPDATE AXIOS HEADERS

  api.interceptors.request.use((config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  });

  // LOAD USER

  const loadUser = async () => {

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const res = await api.get(
        "/api/auth/user"
      );

      if (res.data.success) {

        setUser(res.data.user);
      }

    } catch (error) {

      localStorage.removeItem("token");

      setToken(null);

      setUser(null);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN

  const login = async (
    email: string,
    password: string
  ) => {

    try {

      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (res.data.success) {

        setToken(res.data.token);

        setUser(res.data.user);

        localStorage.setItem(
          "token",
          res.data.token
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: res.data.message,
      };

    } catch (error: any) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // REGISTER

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {

    try {

      const res = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      if (res.data.success) {

        setToken(res.data.token);

        setUser(res.data.user);

        localStorage.setItem(
          "token",
          res.data.token
        );

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: res.data.message,
      };

    } catch (error: any) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Register failed",
      };
    }
  };

  // LOGOUT

  const logout = () => {

    setToken(null);

    setUser(null);

    localStorage.removeItem("token");
  };

  // CONTEXT VALUE

  const value: AppContextType = {
    user,
    token,
    loading,
    api,
    login,
    register,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// CUSTOM HOOK

export function useApp() {

  const context =
    useContext(AppContext);

  if (!context) {

    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return context;
}