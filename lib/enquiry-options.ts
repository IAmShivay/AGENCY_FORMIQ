// Options for the project enquiry forms (lead overlay, /contact, service pages).
// Service labels come from lib/pricing.ts so the form and the pricing section stay in step.

import { CURRENCIES, PRICING_PLANS, RETAINER_PLAN, type CurrencyCode } from './pricing';

export const ENQUIRY_TABLE = 'contact_messages';
export const ENQUIRY_NOTIFY_ENDPOINT = '/api/whatsapp/send';
export const ENQUIRY_EMAIL = 'hello@formiqstudio.in';
export const ENQUIRY_REPLY_PROMISE = 'within one working day';

export const AI_AGENT_SERVICE = 'AI booking agent';
export const NOT_SURE_SERVICE = 'Not sure yet';

/** "What do you need" chips (multi-select). */
export const SERVICE_CHOICES: string[] = [
  ...PRICING_PLANS.map((p) => p.name),
  RETAINER_PLAN.name,
  AI_AGENT_SERVICE,
  NOT_SURE_SERVICE,
];

/** Budget band edges per currency (hand-set, not FX-derived). Bands: under a, a–b, b–c, c+. */
export const BUDGET_EDGES: Record<CurrencyCode, readonly [number, number, number]> = {
  EUR: [5000, 10000, 25000],
  GBP: [4000, 8500, 21000],
  USD: [5500, 11000, 27000],
  AED: [20000, 40000, 100000],
  INR: [100000, 250000, 500000],
};

const THOUSAND = 1000;
const LAKH = 100000;

/** Budget chips use thousands (k), except INR which uses lakhs (L). */
const BUDGET_UNIT: Record<CurrencyCode, { size: number; suffix: string }> = {
  EUR: { size: THOUSAND, suffix: 'k' },
  GBP: { size: THOUSAND, suffix: 'k' },
  AED: { size: THOUSAND, suffix: 'k' },
  USD: { size: THOUSAND, suffix: 'k' },
  INR: { size: LAKH, suffix: 'L' },
};

/** Budget chips in the visitor's currency, e.g. "Under €5k", "€5–10k", "€10–25k", "€25k+". */
export function budgetChoices(currency: CurrencyCode): string[] {
  const sym = CURRENCIES[currency].symbol;
  const { size, suffix } = BUDGET_UNIT[currency];
  const n = (value: number) => `${value / size}`;
  const [a, b, c] = BUDGET_EDGES[currency];
  return [
    `Under ${sym}${n(a)}${suffix}`,
    `${sym}${n(a)}–${n(b)}${suffix}`,
    `${sym}${n(b)}–${n(c)}${suffix}`,
    `${sym}${n(c)}${suffix}+`,
  ];
}

export const TIMELINE_CHOICES = ['ASAP', '1–3 months', '3–6 months', 'Just exploring'] as const;

export const PHONE_PLACEHOLDER = '+44 20 1234 5678';

export const MIN_NAME_LENGTH = 2;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
