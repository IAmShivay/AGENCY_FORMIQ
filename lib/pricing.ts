// TODO(owner): confirm prices
// Single source of truth for public pricing. Prices are hand-set per currency (not FX-derived).

export const CURRENCY_CODES = ['EUR', 'GBP', 'AED', 'USD', 'INR'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export const CURRENCIES: Record<CurrencyCode, { code: CurrencyCode; symbol: string; label: string; locale: string }> = {
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', locale: 'en-GB' },
  GBP: { code: 'GBP', symbol: '£', label: 'British pound', locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'AED ', label: 'UAE dirham', locale: 'en-GB' },
  USD: { code: 'USD', symbol: '$', label: 'US dollar', locale: 'en-US' },
  INR: { code: 'INR', symbol: '₹', label: 'Indian rupee', locale: 'en-IN' },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';
export const CURRENCY_STORAGE_KEY = 'formiq.pricing.currency';

/** Exact time zones mapped to a currency. */
export const TIMEZONE_CURRENCY: Record<string, CurrencyCode> = {
  'Europe/London': 'GBP',
  'Asia/Dubai': 'AED',
  'Asia/Muscat': 'AED',
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
};
/** Time-zone prefixes mapped to a currency. */
export const TIMEZONE_PREFIX_CURRENCY: Record<string, CurrencyCode> = {
  'America/': 'USD',
};

export const isCurrencyCode = (v: unknown): v is CurrencyCode =>
  typeof v === 'string' && (CURRENCY_CODES as readonly string[]).includes(v);

export function currencyForTimeZone(tz: string | undefined | null): CurrencyCode {
  if (!tz) return DEFAULT_CURRENCY;
  if (TIMEZONE_CURRENCY[tz]) return TIMEZONE_CURRENCY[tz];
  const prefix = Object.keys(TIMEZONE_PREFIX_CURRENCY).find((p) => tz.startsWith(p));
  return prefix ? TIMEZONE_PREFIX_CURRENCY[prefix] : DEFAULT_CURRENCY;
}

/** Client only: call after mount so server and first client render both use DEFAULT_CURRENCY. */
export function detectCurrency(): CurrencyCode {
  try {
    return currencyForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export type PriceTable = Record<CurrencyCode, number>;

const numberFormats = new Map<string, Intl.NumberFormat>();
const numberFormat = (locale: string) => {
  if (!numberFormats.has(locale)) numberFormats.set(locale, new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }));
  return numberFormats.get(locale)!;
};
export const formatPrice = (amount: number, currency: CurrencyCode) =>
  `${CURRENCIES[currency].symbol}${numberFormat(CURRENCIES[currency].locale).format(amount)}`;

export interface PricingPlan {
  id: string;
  name: string;
  price: PriceTable;
  timeline: string;
  description: string;
  features: string[];
  recommended: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'brand-identity',
    name: 'Brand identity',
    price: { EUR: 3500, GBP: 3000, AED: 14000, USD: 3800, INR: 60000 },
    timeline: '3–4 weeks',
    description: 'A complete identity your business can grow into.',
    features: [
      'Logo & wordmark',
      'Colour + type system',
      'Brand guidelines',
      'Social + packaging starter kit',
    ],
    recommended: false,
  },
  {
    id: 'website',
    name: 'Website',
    price: { EUR: 5000, GBP: 4300, AED: 20000, USD: 5400, INR: 90000 },
    timeline: '4–6 weeks',
    description: 'A custom site designed and built around your customers.',
    features: [
      'Strategy & sitemap',
      'Custom design (no templates)',
      'Next.js or Webflow build',
      'CMS',
      'SEO setup & analytics',
      '30 days post-launch support',
    ],
    recommended: true,
  },
  {
    id: 'ecommerce',
    name: 'Shopify / e-commerce',
    price: { EUR: 6500, GBP: 5600, AED: 26000, USD: 7000, INR: 120000 },
    timeline: '5–8 weeks',
    description: 'A store built to sell in the markets you ship to.',
    features: [
      'Custom Shopify theme',
      'Product & collection setup',
      'Payments, shipping & tax for your markets',
      'Conversion-focused PDP + checkout',
      'Launch support',
    ],
    recommended: false,
  },
];

export const RETAINER_PLAN = {
  id: 'retainer',
  name: 'Design & development partner',
  price: { EUR: 1800, GBP: 1550, AED: 7000, USD: 1950, INR: 35000 } as PriceTable,
  period: 'per month',
  description: "A senior designer + developer on call for your roadmap. Cancel with 30 days' notice.",
};

export const PAYMENT_TERMS =
  '50% to start, 50% at launch. Invoiced in EUR, GBP, AED, USD or INR (Indian invoices include 18% GST). Fixed quote after a free 30-minute call.';

/** Booking link (also hard-coded in components/Contact.tsx and components/landing/LandingHero.tsx; those can import this). */
export const BOOKING_URL = 'https://meet.brevo.com/mr-shivay';

/** Lowest project starting price in the given currency. */
export const startingFromPrice = (currency: CurrencyCode) => Math.min(...PRICING_PLANS.map((p) => p.price[currency]));
export const startingFromLabel = (currency: CurrencyCode) => `Projects from ${formatPrice(startingFromPrice(currency), currency)}`;
