export const GOOGLE_REVIEW_URL = 'https://g.page/r/CdyKwEPD_8rDEBM/review';
export const GOOGLE_PROFILE_URL = 'https://g.page/r/CdyKwEPD_8rDEBM';

export const STUDIO_ADDRESS = {
  street: 'Arrah Kalinagar',
  city: 'Durgapur',
  region: 'West Bengal',
  postalCode: '713212',
  country: 'IN',
} as const;

export const STUDIO_ADDRESS_LINES = [
  `${STUDIO_ADDRESS.street}, ${STUDIO_ADDRESS.city}`,
  `${STUDIO_ADDRESS.region} ${STUDIO_ADDRESS.postalCode}`,
] as const;

export const STUDIO_ADDRESS_LINE = STUDIO_ADDRESS_LINES.join(', ');

export const STUDIO_TIMEZONE = 'Asia/Kolkata';
export const STUDIO_TIMEZONE_LABEL = 'IST';

export const SERVICE_CITIES = ['Kolkata', 'Durgapur', 'Asansol'] as const;

export const LAUNCH_DAYS = 15;

/** Regions the studio works with. */
export const CLIENT_REGIONS = ['US', 'Europe', 'UK', 'UAE', 'India'] as const;

export const CLIENT_REGIONS_PHRASE = 'the US, Europe, the UK, the UAE and India';

export const CLIENT_REGIONS_LINE = CLIENT_REGIONS.join(' · ');
