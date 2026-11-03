"use client";

import { ThemeProvider } from "next-themes";

export default function Cs_ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="cs_theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
