import { ReactNode } from 'react';
import { STUDIO_FONT_VARS } from '@/lib/studio-fonts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';
// import FounderVideoPopup from '@/components/FounderVideoPopup';
import StudioShell from '@/components/studio/StudioShell';
import StudioPreloader from '@/components/studio/StudioPreloader';
import SiteChrome from '@/components/studio/SiteChrome';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`studio ${STUDIO_FONT_VARS}`}>
      <StudioPreloader />
      <StudioShell />
      <SiteChrome><Header /></SiteChrome>
      <main id="studio-main">{children}</main>
      <SiteChrome><Footer /></SiteChrome>
      <WhatsAppChat />
      {/* Founder video popup — disabled for now.
      <FounderVideoPopup
        videoUrl="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.mp4"
        thumbnail="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.jpg"
      />
      */}
    </div>
  );
}
