import './globals.css';
import ConversionTracker from '@/components/ConversionTracker';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import StructuredData from '@/components/seo/StructuredData';
import CookieConsent from '@/components/CookieConsent';
import { STUDIO_ADDRESS } from '@/lib/studio-facts';
import { SEO_CONSTANTS } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: 'FormiqStudio — Brand, website & Shopify studio',
    template: '%s | FormiqStudio',
  },
  description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
  keywords: [
    ...SEO_CONSTANTS.KEYWORDS,
    'FormiqStudio',
    'FormiqStudio reviews',
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
    title: 'FormiqStudio — Brand, website & Shopify studio',
    description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FormiqStudio, brand, website and Shopify studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormiqStudio — Get More Customers Without the Confusion',
    description: 'Brand identity, websites and Shopify stores for growing brands. Fixed quotes, clear timelines.',
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
  category: 'Business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>        {/* Organization Structured Data */}
        <StructuredData
          type="organization"
          data={{
            name: "FormiqStudio",
            url: "https://formiqstudio.in",
            logo: "https://formiqstudio.in/images/logo.png",
            description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
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
            description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
            telephone: "+91 8918349445",
            email: "hello@formiqstudio.in",
            address: {
              streetAddress: `${STUDIO_ADDRESS.street}, ${STUDIO_ADDRESS.locality}`,
              addressLocality: STUDIO_ADDRESS.city,
              addressRegion: "West Bengal",
              postalCode: STUDIO_ADDRESS.postalCode,
              addressCountry: "IN",
            },
            areaServed: SEO_CONSTANTS.AREA_SERVED,
            openingHours: "Mo-Sa 10:00-19:00",
            priceRange: SEO_CONSTANTS.PRICE_RANGE,
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
            description: "Brand identity, websites and Shopify stores for growing brands. Fixed quotes, clear timelines.",
            publisher: {
              name: "FormiqStudio",
              url: "https://formiqstudio.in"
            }
          }}
        />
      </head>
      
      <body className={inter.className}>
         <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          themes={['light', 'dark']}
          disableTransitionOnChange

        >
          <main>{children}</main>
          <ConversionTracker />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}