"use client";
import { handleGetUser } from "@/app/global/global";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }) {
  const [user, setUser] = useState(null); // começa null
  const [token, setToken] = useState(null);

  const getUser = async () => {
    const userData = await handleGetUser({ setToken, setUser });
    return userData;
  };

useEffect(() => {
  const fetchUser = async () => {
    const userData = await getUser();
    if (!userData) return;

    document.documentElement.setAttribute(
      "data-theme",
      userData.isDarkMode ? "dark" : "light"
    );
  };

  fetchUser();
}, []);


  return <>{children}</>;
}
