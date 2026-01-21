"use client";

import { AuthProvider } from "./auth";
import { ThemeProvider } from "./theme";

export default function Provider({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
