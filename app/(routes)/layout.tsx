import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppChat />
    </>
  );
}
