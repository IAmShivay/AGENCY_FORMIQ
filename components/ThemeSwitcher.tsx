"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { name: "System", value: "system", icon: Palette },
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
];

const lightSchemes = [
  { name: "Professional Blue", value: "light", color: "217 91% 60%" },
  { name: "Light Agency", value: "light-agency", color: "217 91% 50%" },
  { name: "Light Creative", value: "light-creative", color: "180 84% 40%" },
  { name: "Light Modern", value: "light-modern", color: "270 91% 50%" },
  { name: "Light Tech", value: "light-tech", color: "142 76% 36%" },
  { name: "Light Premium", value: "light-premium", color: "220 91% 40%" },
];

const lightNeonSchemes = [
  { name: "Light Neon Cyan", value: "light-neon-cyan", color: "180 100% 35%" },
  { name: "Light Neon Purple", value: "light-neon-purple", color: "270 100% 40%" },
  { name: "Light Neon Green", value: "light-neon-green", color: "184, 45%, 21%" },
  { name: "Light Neon Pink", value: "light-neon-pink", color: "330 100% 40%" },
];

const darkSchemes = [
  { name: "Professional Dark", value: "dark", color: "180 100% 50%" },
  { name: "Neon Agency", value: "neon-agency", color: "180 100% 50%" },
  { name: "Cyberpunk", value: "cyberpunk", color: "270 100% 70%" },
  { name: "Matrix", value: "matrix", color: "120 100% 50%" },
  { name: "Electric", value: "electric", color: "210 100% 60%" },
];

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem className="font-semibold">
          <Palette className="mr-2 h-4 w-4" />
          Theme Options
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`cursor-pointer ${theme === t.value ? 'bg-primary/10' : ''}`}
          >
            <t.icon className="mr-2 h-4 w-4" />
            {t.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-semibold text-xs uppercase tracking-wide">
          Light Themes
        </DropdownMenuItem>
        {lightSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setTheme(scheme.value)}
            className={`cursor-pointer ${theme === scheme.value ? 'bg-primary/10' : ''}`}
          >
            <div
              className="mr-2 h-4 w-4 rounded-full border border-border/20"
              style={{
                background: `hsl(${scheme.color})`,
                boxShadow: `0 0 6px hsl(${scheme.color} / 0.2)`,
              }}
            />
            {scheme.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-semibold text-xs uppercase tracking-wide">
          Light Neon Themes
        </DropdownMenuItem>
        {lightNeonSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setTheme(scheme.value)}
            className={`cursor-pointer ${theme === scheme.value ? 'bg-primary/10' : ''}`}
          >
            <div
              className="mr-2 h-4 w-4 rounded-full border border-border/20"
              style={{
                background: `hsl(${scheme.color})`,
                boxShadow: `0 0 8px hsl(${scheme.color} / 0.4)`,
              }}
            />
            {scheme.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-semibold text-xs uppercase tracking-wide">
          Dark Themes
        </DropdownMenuItem>
        {darkSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setTheme(scheme.value)}
            className={`cursor-pointer ${theme === scheme.value ? 'bg-primary/10' : ''}`}
          >
            <div
              className="mr-2 h-4 w-4 rounded-full border border-border/20"
              style={{
                background: `hsl(${scheme.color})`,
                boxShadow: `0 0 8px hsl(${scheme.color} / 0.3)`,
              }}
            />
            {scheme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}