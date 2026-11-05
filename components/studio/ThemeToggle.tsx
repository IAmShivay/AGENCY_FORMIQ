'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/studio-motion';

const DARK = new Set(['dark', 'neon-agency', 'cyberpunk', 'matrix', 'electric']);

/**
 * Light ⇄ dark. The new theme is revealed as a blind dropping from the top of
 * the screen (View Transitions API; instant elsewhere).
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && DARK.has((theme === 'system' ? resolvedTheme : theme) ?? '');

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || prefersReducedMotion()) { setTheme(next); return; }
    doc.startViewTransition(() => flushSync(() => setTheme(next))).ready.then(() => {
      document.documentElement.animate(
        { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] },
        { duration: 700, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`tap w-11 h-11 inline-flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors ${className}`}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}
