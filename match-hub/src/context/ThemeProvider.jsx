"use client";

import { useEffect } from "react";
import { useUser } from "./UserContext";

export default function ThemeProvider({ children }) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user) return;

    document.documentElement.setAttribute(
      "data-theme",
      user.isDarkMode ? "dark" : "light"
    );
  }, [user, loading]);

  return <>{children}</>;
}
