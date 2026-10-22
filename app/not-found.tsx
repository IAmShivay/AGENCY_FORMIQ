import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
