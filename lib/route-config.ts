import type { Metadata } from 'next';


export const ADMIN_PATH_PREFIX = '/admin';
export const USER_PATH_PREFIX = '/user';

export const AUTH_PROTECTED_PATH_PREFIXES = [ADMIN_PATH_PREFIX, USER_PATH_PREFIX] as const;

export const LOGIN_PATH = '/login';

export const LOGIN_REDIRECT_PARAM = 'redirect';

export const NON_ADMIN_FALLBACK_PATH = USER_PATH_PREFIX;

export const ADMIN_ROLE_EXEMPT_PATHS = ['/admin/setup'] as const;

export const NOINDEX_PATH_PREFIXES = ['/admin', '/user', '/login', '/quote'] as const;

export const ROBOTS_HEADER_INDEX = 'index, follow';
export const ROBOTS_HEADER_NOINDEX = 'noindex, nofollow';

export const DEAD_PUBLIC_ROUTES = [
  '/landing',
  '/theme-showcase',
  '/services/hosting',
  '/services/domains',
  '/services/email',
  '/services/cloud',
  '/services/marketing',
  '/services/checkout',
  '/software-tools',
  '/software-tools/development',
  '/software-tools/marketing',
  '/software-tools/productivity',
  '/portfolio/designs',
] as const;

export const NOINDEX_ROBOTS: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
};

export const NOINDEX_METADATA: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export function matchesPathPrefix(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
