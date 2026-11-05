import { ReactNode } from 'react';
import { Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';
import FounderVideoPopup from '@/components/FounderVideoPopup';
import StudioShell from '@/components/studio/StudioShell';
import StudioPreloader from '@/components/studio/StudioPreloader';
import SiteChrome from '@/components/studio/SiteChrome';

// Studio typography for the marketing site: characterful display + a mono for labels.
const display = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], variable: '--font-display', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`studio ${display.variable} ${mono.variable}`}>
      <StudioPreloader />
      <StudioShell />
      <SiteChrome><Header /></SiteChrome>
      <main id="studio-main">{children}</main>
      <SiteChrome><Footer /></SiteChrome>
      <WhatsAppChat />
      <FounderVideoPopup
        videoUrl="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.mp4"
        thumbnail="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.jpg"
      />
    </div>
  );
}
