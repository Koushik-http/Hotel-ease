"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Remove any client-side only logic that would cause hydration mismatches
  return (
    <NextThemesProvider
      {...props}
      enableSystem={false} // Disable system theme to prevent hydration mismatch
      defaultTheme="light" // Set a consistent default theme
      forcedTheme="light" // Force light theme to prevent mismatches
    >
      {children}
    </NextThemesProvider>
  )
}

