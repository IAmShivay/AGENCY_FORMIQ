import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define routes that should exclude Header and Footer separately
export const excludedHeaderRoutes = ['/login', '/signup'];
export const excludedFooterRoutes = ['/dashboard'];

// Helper functions
export const shouldRenderHeader = (pathname: string) => {
  return !excludedHeaderRoutes.includes(pathname);
};

export const shouldRenderFooter = (pathname: string) => {
  return !excludedFooterRoutes.includes(pathname);
};
