import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';
import FounderVideoPopup from '@/components/FounderVideoPopup';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppChat />
      <FounderVideoPopup
        videoUrl="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.mp4"
        thumbnail="https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.jpg"
      />
    </>
  );
}
