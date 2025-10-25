"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getUserByToken } from "@/services/userService";
import Cookies from "js-cookie";

const UserContext = createContext(null);

function isTokenExpired(token) {
  if (!token) return true;

  try {
    // Decodifica o payload do JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Verifica se o token tem campo 'exp' e se está expirado
    if (payload.exp && payload.exp < currentTime) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthData = useCallback(() => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      const tokenFromCookie = Cookies.get("token");

      if (!tokenFromCookie) {
        setLoading(false);
        return null;
      }

      // Verifica se o token está expirado
      if (isTokenExpired(tokenFromCookie)) {
        console.log("Token expirado, limpando dados de autenticação");
        clearAuthData();
        return null;
      }

      setToken(tokenFromCookie);
      const userData = await getUserByToken(tokenFromCookie);
      
      console.log("User data fetched:", userData);
      if (userData) {
        setUser(userData);
      }
      return userData;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);

      // Limpa dados de autenticação em caso de erro de autenticação
      if (
        err.message === "Token expirado." ||
        err.message === "Token não encontrado." ||
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        console.log("Erro de autenticação, limpando dados");
        clearAuthData();
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  const logout = useCallback(() => {
    console.log("User logged out");
    clearAuthData();
    setLoading(false);
  }, [clearAuthData]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user && user.fontSize !== undefined) {
      const newSize = 1 + user.fontSize * 0.07;
      document.documentElement.style.fontSize = `${newSize}em`;
      console.log("Font size aplicado:", newSize);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, token, loading, refreshUser: getUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}