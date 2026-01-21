"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  isDarkTheme: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const setDarkClass = (isDark: boolean) => {
  if (isDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true;
    }
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setDarkClass(isDarkTheme);

    if (isDarkTheme) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
