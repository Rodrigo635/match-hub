"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { handleGetUser } from "@/app/global/global";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const userData = await handleGetUser({ setToken, setUser });
      console.log("User data fetched:", userData);
      if (userData) {
        setUser(userData); // Garanta que o user é setado
      }
      return userData;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    console.log("User state updated:", user);
    console.log("User is now:", user ? "SET" : "NULL");
  }, [user]);

  useEffect(() => {
    console.log("Token state updated:", token);
  }, [token]);

  console.log("UserProvider rendering with:", { user, token, loading });

  return (
    <UserContext.Provider value={{ user, token, loading, refreshUser: getUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para uso mais fácil no app
export function useUser() {
  const context = useContext(UserContext);
  console.log("useUser hook called, context:", context);
  return context;
}