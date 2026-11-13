import { z } from 'zod';

// Only Monetag "In-Page Push" is allowed. OnClick/Popunder, Interstitial, Vignette Banner,
// Direct Link/SmartLink, MultiTag and Push Notifications (needs sw.js) are deliberately excluded:
// they hijack clicks, cover content or ask for notification permission, which hurts trust and conversions.
export const MONETAG_ALLOWED_FORMAT = 'in-page-push' as const;

export const MONETAG_EXCLUDED_FORMATS = [
  'onclick-popunder',
  'interstitial',
  'vignette-banner',
  'direct-link',
  'multitag',
  'push-notifications',
] as const;

export const MONETAG_PRIVACY_POLICY_URL = 'https://monetag.com/privacy/';
export const MONETAG_ENABLED_FLAG = 'true';
export const MONETAG_VERIFICATION_META_NAME = 'monetag';
export const MONETAG_SCRIPT_ELEMENT_ID = 'formiq-monetag-inpage-push';
export const MONETAG_ZONE_ATTRIBUTE = 'data-zone';
export const MONETAG_FORMAT_ATTRIBUTE = 'data-formiq-ad-format';
export const AD_IDLE_TIMEOUT_MS = 4000;
export const AD_FALLBACK_DELAY_MS = 2000;

const HTTPS_PROTOCOL = 'https:';
const ZONE_ID_PATTERN = /^\d+$/;

const httpsUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    try {
      return new URL(value).protocol === HTTPS_PROTOCOL;
    } catch {
      return false;
    }
  });

const zoneSchema = z.string().trim().regex(ZONE_ID_PATTERN);

const nonEmptySchema = z.string().trim().min(1);

export type MonetagEnv = {
  enabled?: string;
  src?: string;
  zone?: string;
  siteVerification?: string;
};

export type MonetagConfig = {
  enabled: boolean;
  src: string | null;
  origin: string | null;
  zone: string | null;
  siteVerification: string | null;
};

const parseOptional = <T>(schema: z.ZodType<T>, value: string | undefined): T | null => {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
};

export const parseMonetagConfig = (env: MonetagEnv): MonetagConfig => {
  const src = parseOptional(httpsUrlSchema, env.src);
  return {
    enabled: env.enabled?.trim().toLowerCase() === MONETAG_ENABLED_FLAG,
    src,
    origin: src ? new URL(src).origin : null,
    zone: parseOptional(zoneSchema, env.zone),
    siteVerification: parseOptional(nonEmptySchema, env.siteVerification),
  };
};

export const MONETAG_CONFIG: MonetagConfig = parseMonetagConfig({
  enabled: process.env.NEXT_PUBLIC_MONETAG_ENABLED,
  src: process.env.NEXT_PUBLIC_MONETAG_INPAGE_SRC,
  zone: process.env.NEXT_PUBLIC_MONETAG_INPAGE_ZONE,
  siteVerification: process.env.NEXT_PUBLIC_MONETAG_SITE_VERIFICATION,
});

export const isMonetagConfigured = (config: MonetagConfig): config is MonetagConfig & { src: string } =>
  config.enabled && config.src !== null;

export type AdLoadInput = {
  config: MonetagConfig;
  advertisingConsent: boolean;
  pathEligible: boolean;
};

export const shouldLoadAds = ({ config, advertisingConsent, pathEligible }: AdLoadInput): boolean =>
  isMonetagConfigured(config) && advertisingConsent && pathEligible;
