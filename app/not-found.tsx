import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
