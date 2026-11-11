import { STUDIO_ADDRESS } from '@/lib/studio-facts';

export interface StudioPhoto {
  src: string;
  alt: string;
  caption: string;
}

const STUDIO_PLACE = `${STUDIO_ADDRESS.street}, ${STUDIO_ADDRESS.city}`;

export const STUDIO_PHOTOS = {
  wide: {
    src: '/images/studio/studio-wide.webp',
    alt: `The FormiqStudio workspace in ${STUDIO_ADDRESS.city}, with a long shared desk and a planning whiteboard`,
    caption: `The studio, ${STUDIO_PLACE}`,
  },
  angle: {
    src: '/images/studio/studio-angle.webp',
    alt: 'Design and development desks along the FormiqStudio wall',
    caption: 'Where the work gets made',
  },
  overhead: {
    src: '/images/studio/studio-overhead.webp',
    alt: 'Overhead view of the FormiqStudio shared desk with four workstations',
    caption: 'Four seats, one table',
  },
  desks: {
    src: '/images/studio/studio-desks.webp',
    alt: 'Close-up of FormiqStudio workstations with code on screen',
    caption: 'Design and build, side by side',
  },
  room: {
    src: '/images/studio/studio-room.webp',
    alt: 'FormiqStudio room with desks, plants and a planning whiteboard',
    caption: `The studio, ${STUDIO_PLACE}`,
  },
} as const satisfies Record<string, StudioPhoto>;

export const STUDIO_GALLERY: StudioPhoto[] = [
  STUDIO_PHOTOS.wide,
  STUDIO_PHOTOS.overhead,
  STUDIO_PHOTOS.angle,
  STUDIO_PHOTOS.desks,
];
