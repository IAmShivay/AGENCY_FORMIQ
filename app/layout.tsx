import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import StructuredData from '@/components/seo/StructuredData';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FormiqStudio - Digital Marketing & Development Agency',
    template: '%s | FormiqStudio'
  },
  description: 'Transforming businesses through innovative software solutions, digital marketing, AI-driven automation, web development, mobile apps, and comprehensive digital marketing services.',
  keywords: [
    'digital marketing agency',
    'web development',
    'mobile app development',
    'AI automation',
    'software solutions',
    'SEO services',
    'social media marketing',
    'e-commerce development',
    'Shopify development',
    'custom software',
    'digital transformation',
    'marketing automation'
  ],
  authors: [{ name: 'FormiqStudio Team' }],
  creator: 'FormiqStudio',
  publisher: 'FormiqStudio',
  metadataBase: new URL('https://formiqstudio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://formiqstudio.com',
    siteName: 'FormiqStudio',
    title: 'FormiqStudio - Digital Marketing & Development Agency',
    description: 'Transforming businesses through innovative software solutions, digital marketing, AI-driven automation, web development, mobile apps, and comprehensive digital marketing services.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FormiqStudio - Digital Marketing & Development Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormiqStudio - Digital Marketing & Development Agency',
    description: 'Transforming businesses through innovative software solutions, digital marketing, AI-driven automation, web development, mobile apps, and comprehensive digital marketing services.',
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
      {
        url: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/favicon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code', // Add your actual Google verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17545962148"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
            url: "https://formiqstudio.com",
            logo: "https://formiqstudio.com/images/logo.png",
            description: "Transforming businesses through innovative software solutions, digital marketing, AI-driven automation, web development, mobile apps, and comprehensive digital marketing services.",
            contactPoint: {
              telephone: "+91 8918349445",
              contactType: "customer service",
              email: "contact@formiqstudio.com"
            },
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
            url: "https://formiqstudio.com",
            description: "Digital Marketing & Development Agency specializing in innovative software solutions, web development, mobile apps, and AI-driven automation.",
            publisher: {
              name: "FormiqStudio",
              url: "https://formiqstudio.com"
            },
            potentialAction: {
              target: "https://formiqstudio.com/search?q={search_term_string}",
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