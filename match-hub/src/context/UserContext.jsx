"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { handleGetUser } from "@/app/global/global";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const userData = await handleGetUser({ setToken, setUser });
      if (userData) setUser(userData);
      return userData;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    setLoading(false);
    // Limpe também localStorage/sessionStorage se tiver tokens lá
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    // Aplicar font size quando user é carregado
    if (user && user.fontSize !== undefined) {
      const newSize = 1 + user.fontSize * 0.07;
      document.documentElement.style.fontSize = `${newSize}em`;
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

// Hook para uso mais fácil no app
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
