"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface DashboardThemeContextType {
  currentTheme: string;
  isDark: boolean;
  themeClasses: {
    background: string;
    card: string;
    sidebar: string;
    header: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    button: {
      primary: string;
      secondary: string;
      ghost: string;
    };
    border: string;
    input: string;
    accent: string;
    gradient: {
      primary: string;
      accent: string;
      background: string;
    };
    glow: {
      primary: string;
      accent: string;
    };
  };
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || 'light') : 'light';
  const isDark = false; // Always light mode

  // Warm studio palette: every class resolves to a design token from app/globals.css,
  // so light/dark is handled by the CSS variables rather than per-theme branches.
  const getThemeClasses = (_theme: string) => ({
    background: 'bg-background',
    card: 'bg-card border border-border',
    sidebar: 'bg-card border-r border-border',
    header: 'bg-card/90 backdrop-blur-md border-b border-border',
    text: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      muted: 'text-muted-foreground/70'
    },
    button: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
      ghost: 'text-foreground hover:bg-muted'
    },
    border: 'border-border',
    input: 'bg-background border-border focus-visible:ring-ring',
    accent: 'text-primary',
    gradient: {
      primary: 'bg-primary/10',
      accent: 'bg-primary/10',
      background: 'bg-background'
    },
    glow: {
      primary: 'shadow-sm',
      accent: 'shadow-sm'
    }
  });

  const themeClasses = getThemeClasses(currentTheme);

  const contextValue: DashboardThemeContextType = {
    currentTheme,
    isDark,
    themeClasses
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <DashboardThemeContext.Provider value={contextValue}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);
  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }
  return context;
}

// Utility function to get consistent dashboard styling (token classes only)
export const getDashboardStyles = (_theme: string, _isDark: boolean) => ({
  layout: {
    main: 'min-h-screen bg-background',
    sidebar: 'bg-card border-r border-border',
    header: 'bg-card/90 backdrop-blur-md border-b border-border',
    content: 'bg-background'
  },
  card: 'bg-card border border-border rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md',
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
    ghost: 'text-foreground hover:bg-muted'
  },
  text: {
    heading: 'text-foreground font-bold',
    body: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-primary'
  },
  input: 'bg-background border-border focus-visible:ring-ring',
  glow: {
    primary: 'shadow-sm',
    accent: 'shadow-sm'
  },
  gradient: {
    primary: 'bg-primary/10',
    background: 'bg-background'
  }
});
