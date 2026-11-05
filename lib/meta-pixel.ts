declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const META_PIXEL_ID = '28091008350601343';
export const META_CAPI_ENDPOINT = '/api/meta-capi';
export const META_CURRENCY = 'INR';

export const META_EVENTS = {
  LEAD: 'Lead',
  CONTACT: 'Contact',
  SCHEDULE: 'Schedule',
  VIEW_CONTENT: 'ViewContent',
} as const;

export const CONTACT_METHODS = {
  WHATSAPP: 'whatsapp',
  PHONE: 'phone',
  EMAIL: 'email',
} as const;

type TrackedLinkRule = {
  matches: (href: string) => boolean;
  event: string;
  method?: string;
};

export const TRACKED_LINK_RULES: TrackedLinkRule[] = [
  {
    matches: (h) => /(^|\/\/)(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp\.com\/send)/i.test(h),
    event: META_EVENTS.CONTACT,
    method: CONTACT_METHODS.WHATSAPP,
  },
  { matches: (h) => h.startsWith('tel:'), event: META_EVENTS.CONTACT, method: CONTACT_METHODS.PHONE },
  { matches: (h) => h.startsWith('mailto:'), event: META_EVENTS.CONTACT, method: CONTACT_METHODS.EMAIL },
  { matches: (h) => /meet\.brevo\.com/i.test(h), event: META_EVENTS.SCHEDULE },
];

type UserData = { email?: string; phone?: string };

const newEventId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const sendServerEvent = (eventName: string, eventId: string, customData: Record<string, any>, user?: UserData) => {
  fetch(META_CAPI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      sourceUrl: window.location.href,
      customData,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
    }),
  }).catch(() => {});
};

export const trackEvent = (eventName: string, params: Record<string, any> = {}, user?: UserData) => {
  if (typeof window === 'undefined') return;
  const eventId = newEventId();
  if (window.fbq) {
    window.fbq('track', eventName, params, { eventID: eventId });
  }
  sendServerEvent(eventName, eventId, params, user);
};

type LeadData = UserData & { content_name?: string; value?: number; [key: string]: any };

export const trackLead = (data: LeadData = {}) => {
  const { email, phone, ...rest } = data;
  trackEvent(
    META_EVENTS.LEAD,
    { content_name: rest.content_name || 'Contact Form', value: rest.value || 0, currency: META_CURRENCY, ...rest },
    { email, phone }
  );
};

export const trackContact = (method: string, source?: string) => {
  trackEvent(META_EVENTS.CONTACT, { method, source });
};

export const trackSchedule = (source?: string) => {
  trackEvent(META_EVENTS.SCHEDULE, { source });
};

export const trackViewContent = (contentName: string) => {
  trackEvent(META_EVENTS.VIEW_CONTENT, { content_name: contentName });
};

export const trackLinkClick = (href: string, source?: string) => {
  const rule = TRACKED_LINK_RULES.find((r) => r.matches(href));
  if (!rule) return false;
  trackEvent(rule.event, { method: rule.method, source });
  return true;
};
