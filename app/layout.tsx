import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import StructuredData from '@/components/seo/StructuredData';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FormiqStudio - Website Development & Digital Marketing Agency in Kolkata, Durgapur & Asansol | Get More Customers',
    template: '%s | FormiqStudio',
  },
  description: 'FormiqStudio helps local businesses in Kolkata, Durgapur & Asansol get more customers with professional websites, Facebook & Instagram ads, Google Ads & SEO, and social media management. 50+ businesses trust us. Starting at Rs 6,999/month. Free consultation, no lock-in, live in 15 days.',
  keywords: [
    // Core + Local intent (high-volume)
    'digital marketing agency Kolkata',
    'digital marketing agency Durgapur',
    'digital marketing agency Asansol',
    'web development Kolkata',
    'web development Durgapur',
    'website design Asansol',
    'best website development company Kolkata',
    'best digital marketing company Durgapur',
    // Service + Location long-tail
    'Facebook ads agency Kolkata',
    'Instagram ads management Durgapur',
    'Google ads agency Asansol',
    'SEO services Kolkata',
    'SEO company Durgapur',
    'social media marketing Asansol',
    'Google My Business optimisation Kolkata',
    'ecommerce website development Kolkata',
    'Shopify development Durgapur',
    // Branded & AI discovery
    'FormiqStudio',
    'FormiqStudio reviews',
    'tech agency West Bengal',
    'AI automation agency Kolkata',
  ],
  authors: [{ name: 'FormiqStudio Team', url: 'https://formiqstudio.in/about' }],
  creator: 'FormiqStudio',
  publisher: 'FormiqStudio',
  metadataBase: new URL('https://formiqstudio.in'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'en': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://formiqstudio.in',
    siteName: 'FormiqStudio',
    title: 'FormiqStudio — Get More Customers Without the Confusion | Kolkata, Durgapur & Asansol',
    description: 'Website + Ads + Social Media — all included. 50+ local businesses trust us. Starting Rs 6,999/month. No lock-in, live in 15 days, in-person support in Kolkata, Durgapur & Asansol.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FormiqStudio - Website, Ads & Social Media for Local Businesses in Kolkata, Durgapur & Asansol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormiqStudio — Get More Customers Without the Confusion',
    description: 'Website + Ads + Social Media for local businesses in Kolkata, Durgapur & Asansol. Starting Rs 6,999/month. 50+ businesses trust us.',
    images: ['/images/og-image.jpg'],
    creator: '@formiqstudio',
    site: '@formiqstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
  },
  category: 'Business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '28091008350601343');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=28091008350601343&ev=PageView&noscript=1"
          />
        </noscript>

        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17545962148"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17545962148');
          `}
        </Script>

        {/* Organization Structured Data */}
        <StructuredData
          type="organization"
          data={{
            name: "FormiqStudio",
            url: "https://formiqstudio.in",
            logo: "https://formiqstudio.in/images/logo.png",
            description: "FormiqStudio helps local businesses in Kolkata, Durgapur & Asansol get more customers with professional websites, Facebook & Instagram ads, Google Ads & SEO, and social media management. 50+ businesses trust us.",
            contactPoint: {
              telephone: "+91 8918349445",
              contactType: "customer service",
              email: "hello@formiqstudio.in"
            },
            sameAs: [
              "https://www.linkedin.com/company/formiqstudio",
              "https://twitter.com/formiqstudio",
              "https://www.facebook.com/formiqstudio",
              "https://www.instagram.com/formiqstudio"
            ]
          }}
        />

        {/* LocalBusiness Structured Data - Critical for Local SEO & Google Maps */}
        <StructuredData
          type="localBusiness"
          data={{
            name: "FormiqStudio",
            url: "https://formiqstudio.in",
            logo: "https://formiqstudio.in/images/logo.png",
            description: "Website development, Facebook & Instagram ads, Google Ads & SEO, and social media management for local businesses in Kolkata, Durgapur & Asansol. Starting Rs 6,999/month. 50+ businesses trust us. Live in 15 days.",
            telephone: "+91 8918349445",
            email: "hello@formiqstudio.in",
            address: {
              streetAddress: "Arrah Shree Pally",
              addressLocality: "Durgapur",
              addressRegion: "West Bengal",
              postalCode: "713212",
              addressCountry: "IN",
            },
            geo: { latitude: "23.5204", longitude: "87.3119" },
            areaServed: ["Kolkata", "Durgapur", "Asansol", "West Bengal", "Bardhaman", "Raniganj"],
            openingHours: "Mo-Sa 10:00-19:00",
            priceRange: "Rs 6,999 - Rs 14,999",
            sameAs: [
              "https://www.linkedin.com/company/formiqstudio",
              "https://twitter.com/formiqstudio",
              "https://www.facebook.com/formiqstudio",
              "https://www.instagram.com/formiqstudio"
            ]
          }}
        />

        {/* Website Structured Data */}
        <StructuredData
          type="website"
          data={{
            name: "FormiqStudio",
            url: "https://formiqstudio.in",
            description: "Website, Ads & Social Media for local businesses in Kolkata, Durgapur & Asansol. 50+ businesses trust us. Starting Rs 6,999/month.",
            publisher: {
              name: "FormiqStudio",
              url: "https://formiqstudio.in"
            },
            potentialAction: {
              target: "https://formiqstudio.in/search?q={search_term_string}",
              queryInput: "required name=search_term_string"
            }
          }}
        />
      </head>
      
      <body className={inter.className}>
         <ThemeProvider
          attribute="data-theme"
          defaultTheme="light-neon-green"
          enableSystem={true}
          themes={[
            'system', 'light', 'dark',
            'light-agency', 'light-creative', 'light-modern', 'light-tech', 'light-premium',
            'light-neon-cyan', 'light-neon-purple', 'light-neon-green', 'light-neon-pink',
            'neon-agency', 'cyberpunk', 'matrix', 'electric'
          ]}
          disableTransitionOnChange

        >
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}