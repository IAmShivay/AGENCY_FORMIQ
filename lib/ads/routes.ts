import { ADMIN_PATH_PREFIX, LOGIN_PATH, USER_PATH_PREFIX, matchesPathPrefix } from '@/lib/route-config';

export const BLOG_PATH = '/blog';
export const HOME_PATH = '/';

export const BLOG_NON_ARTICLE_SEGMENTS = ['category', 'tag'] as const;

export const AD_DENIED_PATH_PREFIXES = [
  ADMIN_PATH_PREFIX,
  USER_PATH_PREFIX,
  '/employee',
  '/manager',
  LOGIN_PATH,
  '/signup',
  '/services',
  '/contact',
  '/quote',
] as const;

const PATH_SEPARATOR = '/';
const TRAILING_SLASHES = /\/+$/;

const normalizePath = (pathname: string): string => {
  const [path] = pathname.split(/[?#]/);
  const trimmed = path.replace(TRAILING_SLASHES, '');
  return (trimmed || HOME_PATH).toLowerCase();
};

export const isAdEligiblePath = (pathname: string | null | undefined): boolean => {
  if (!pathname) return false;
  const path = normalizePath(pathname);
  if (path === HOME_PATH) return false;
  if (matchesPathPrefix(path, AD_DENIED_PATH_PREFIXES)) return false;
  if (!path.startsWith(`${BLOG_PATH}${PATH_SEPARATOR}`)) return false;

  const segments = path.slice(BLOG_PATH.length + PATH_SEPARATOR.length).split(PATH_SEPARATOR);
  if (segments.length !== 1 || !segments[0]) return false;
  return !(BLOG_NON_ARTICLE_SEGMENTS as readonly string[]).includes(segments[0]);
};
