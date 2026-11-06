const ADMIN_EMAILS_ENV_KEY = 'ADMIN_EMAILS';
const ADMIN_EMAILS_SEPARATOR = ',';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminEmailAllowlist(): string[] {
  const raw = process.env[ADMIN_EMAILS_ENV_KEY] ?? '';
  return raw
    .split(ADMIN_EMAILS_SEPARATOR)
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAllowlistedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = getAdminEmailAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(normalizeEmail(email));
}
