import { describe, expect, it } from 'vitest';
import { isAdEligiblePath } from '@/lib/ads/routes';

describe('isAdEligiblePath', () => {
  it.each(['/blog/shopify-cod-app-guide', '/blog/some-post/', '/blog/some-post?ref=x'])('allows article %s', (path) => {
    expect(isAdEligiblePath(path)).toBe(true);
  });

  it.each([
    '/',
    '',
    '/blog',
    '/blog/',
    '/blog/category/shopify',
    '/blog/tag/seo',
    '/blog/category',
    '/blog/a/b',
    '/admin',
    '/admin/blog/edit',
    '/user/blog',
    '/employee',
    '/manager/reports',
    '/login',
    '/signup',
    '/services',
    '/services/web',
    '/contact',
    '/about',
    '/blogger/post',
  ])('denies %s', (path) => {
    expect(isAdEligiblePath(path)).toBe(false);
  });

  it('denies missing pathnames', () => {
    expect(isAdEligiblePath(null)).toBe(false);
    expect(isAdEligiblePath(undefined)).toBe(false);
  });
});
