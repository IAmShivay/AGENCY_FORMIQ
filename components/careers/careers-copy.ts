import { CLIENT_REGIONS_PHRASE as regions, STUDIO_ADDRESS } from '@/lib/studio-facts';

export const CAREERS_INTRO = `A small, senior studio in ${STUDIO_ADDRESS.city} making brands, websites and products for clients in ${regions}.`;

export const PRINCIPLES = [
  { title: 'Craft over volume', text: 'We take on fewer projects so each one gets the time it deserves, from the first sketch to the last pixel.' },
  { title: 'Real work, early', text: 'You work on live client projects from your first weeks, with a senior next to you.' },
  { title: 'Direct feedback', text: 'No layers of account managers. You hear from clients and from each other, clearly and kindly.' },
  { title: 'International clients', text: `Most of our work is for brands in ${regions}, so the bar is set by the best studios in the world.` },
] as const;

export const HIRING_STEPS = [
  { title: 'Apply', text: 'Send your work and a few lines about you. A link to your portfolio, GitHub or CV is enough.' },
  { title: 'Intro call', text: 'A 30-minute conversation about what you have made and what you want to do next.' },
  { title: 'Work session', text: 'Walk us through a project you are proud of. For some roles, a short paid task.' },
  { title: 'Offer', text: 'We decide quickly and tell you why, whichever way it goes.' },
] as const;

export const NO_ROLES_COPY = {
  title: 'No open roles right now.',
  text: 'We still want to hear from exceptional designers, developers and marketers. Send an open application and we will reach out when the right project comes up.',
} as const;
