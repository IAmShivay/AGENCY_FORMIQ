declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const META_PIXEL_ID = '28091008350601343';

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

export const trackLead = (data?: { content_name?: string; value?: number }) => {
  trackEvent('Lead', {
    content_name: data?.content_name || 'Contact Form',
    value: data?.value || 0,
    currency: 'INR',
  });
};

export const trackContact = (method: string) => {
  trackEvent('Contact', { method });
};

export const trackViewContent = (contentName: string) => {
  trackEvent('ViewContent', { content_name: contentName });
};

export const trackSchedule = () => {
  trackEvent('Schedule');
};
