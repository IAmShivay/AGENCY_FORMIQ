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

  // Define theme-specific classes based on current theme
  const getThemeClasses = (theme: string) => {
    const baseClasses = {
      background: isDark 
        ? 'bg-background dark:bg-background' 
        : 'bg-background',
      card: isDark 
        ? 'bg-card dark:bg-card border border-border dark:border-border' 
        : 'bg-card border border-border',
      sidebar: isDark 
        ? 'bg-card/50 dark:bg-card/50 backdrop-blur-xl border-r border-border/50 dark:border-border/50' 
        : 'bg-card/80 backdrop-blur-xl border-r border-border/30',
      header: isDark 
        ? 'bg-card/90 dark:bg-card/90 backdrop-blur-md border-b border-border/50 dark:border-border/50' 
        : 'bg-card/90 backdrop-blur-md border-b border-border/30',
      text: {
        primary: 'text-foreground dark:text-foreground',
        secondary: 'text-muted-foreground dark:text-muted-foreground',
        muted: 'text-muted-foreground/70 dark:text-muted-foreground/70'
      },
      button: {
        primary: 'bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-200',
        secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border',
        ghost: 'hover:bg-accent/10 text-foreground hover:text-accent-foreground'
      },
      border: 'border-border dark:border-border',
      input: 'bg-background border-border focus:border-primary focus:ring-primary/20',
      accent: 'text-accent dark:text-accent',
      gradient: {
        primary: isDark 
          ? 'bg-gradient-to-r from-primary/20 to-accent/20' 
          : 'bg-gradient-to-r from-primary/10 to-accent/10',
        accent: isDark 
          ? 'bg-gradient-to-r from-accent/20 to-primary/20' 
          : 'bg-gradient-to-r from-accent/10 to-primary/10',
        background: isDark 
          ? 'bg-gradient-to-br from-background via-card to-background' 
          : 'bg-gradient-to-br from-background via-card/50 to-background'
      },
      glow: {
        primary: isDark 
          ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40' 
          : 'shadow-lg shadow-primary/15 hover:shadow-primary/25',
        accent: isDark 
          ? 'shadow-lg shadow-accent/25 hover:shadow-accent/40' 
          : 'shadow-lg shadow-accent/15 hover:shadow-accent/25'
      }
    };

    // Theme-specific customizations
    switch (theme) {
      case 'cyberpunk':
        return {
          ...baseClasses,
          glow: {
            primary: 'shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
            accent: 'shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
          }
        };
      case 'matrix':
        return {
          ...baseClasses,
          glow: {
            primary: 'shadow-lg shadow-green-500/30 hover:shadow-green-500/50',
            accent: 'shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
          }
        };
      case 'electric':
        return {
          ...baseClasses,
          glow: {
            primary: 'shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
            accent: 'shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'
          }
        };
      case 'neon-agency':
        return {
          ...baseClasses,
          glow: {
            primary: 'shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
            accent: 'shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'
          }
        };
      default:
        return baseClasses;
    }
  };

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

// Utility function to get consistent dashboard styling
export const getDashboardStyles = (theme: string, isDark: boolean) => ({
  // Layout styles
  layout: {
    main: `min-h-screen ${isDark ? 'bg-background' : 'bg-background'}`,
    sidebar: `${isDark ? 'bg-card/50 backdrop-blur-xl border-r border-border/50' : 'bg-card/80 backdrop-blur-xl border-r border-border/30'}`,
    header: `${isDark ? 'bg-card/90 backdrop-blur-md border-b border-border/50' : 'bg-card/90 backdrop-blur-md border-b border-border/30'}`,
    content: `${isDark ? 'bg-background' : 'bg-background'}`
  },
  
  // Component styles
  card: `bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200`,
  button: {
    primary: `bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200`,
    secondary: `bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border`,
    ghost: `hover:bg-accent/10 text-foreground hover:text-accent-foreground`
  },
  
  // Text styles
  text: {
    heading: `text-foreground font-bold`,
    body: `text-foreground`,
    muted: `text-muted-foreground`,
    accent: `text-accent`
  },
  
  // Interactive styles
  input: `bg-background border-border focus:border-primary focus:ring-primary/20`,
  
  // Effects
  glow: {
    primary: isDark ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40' : 'shadow-lg shadow-primary/15 hover:shadow-primary/25',
    accent: isDark ? 'shadow-lg shadow-accent/25 hover:shadow-accent/40' : 'shadow-lg shadow-accent/15 hover:shadow-accent/25'
  },
  
  // Gradients
  gradient: {
    primary: isDark ? 'bg-gradient-to-r from-primary/20 to-accent/20' : 'bg-gradient-to-r from-primary/10 to-accent/10',
    background: isDark ? 'bg-gradient-to-br from-background via-card to-background' : 'bg-gradient-to-br from-background via-card/50 to-background'
  }
});
