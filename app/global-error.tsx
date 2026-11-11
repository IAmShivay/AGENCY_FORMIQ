'use client';

import Link from 'next/link';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background px-4 font-sans">
        <div className="max-w-md w-full text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Something went wrong</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">We couldn&apos;t load this page</h1>
          <p className="text-muted-foreground mb-8">
            This is a temporary problem on our side. Please try again, or head back to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Go to homepage
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Need help?{' '}
            <a href="https://wa.me/919832078313" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Chat with us on WhatsApp
            </a>
          </p>
          {error.digest && <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
