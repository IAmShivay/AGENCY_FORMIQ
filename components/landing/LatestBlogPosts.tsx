import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import { RAIL_ITEM, RAIL_TO_MD } from '@/components/studio/ui';

const POST_COUNT = 3;
const RAIL_IMAGE_SIZES = '82vw';
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d);
};

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background';

export default async function LatestBlogPosts() {
  const posts = (await getBlogPosts()).slice(0, POST_COUNT);
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;

  return (
    <section aria-labelledby="journal-title" className="relative py-14 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6 mb-8 md:mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4 md:mb-5">(08) Journal</p>
            <h2 id="journal-title" className="font-display text-[2.3rem] leading-[1] sm:text-6xl font-semibold tracking-[-0.04em] text-foreground max-w-3xl">
              Practical guides to grow your business online
            </h2>
          </div>
          <Link href="/blog" className={`group inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-foreground whitespace-nowrap rounded-sm ${FOCUS_RING}`}>
            <span className="link-draw">View all articles</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul aria-label="Latest articles" className={`md:hidden ${RAIL_TO_MD}`}>
          {posts.map((post) => (
            <li key={post.slug} data-reveal className={RAIL_ITEM}>
              <Link href={`/blog/${post.slug}`} className={`group block rounded-2xl ${FOCUS_RING}`}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes={RAIL_IMAGE_SIZES}
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{post.category}</span>
                  {formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-[-0.03em] text-foreground line-clamp-3">
                  {post.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:grid lg:grid-cols-[1.25fr,1fr] gap-10 lg:gap-16">
          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className={`group block rounded-[22px] ${FOCUS_RING}`}>
            <div className="relative aspect-[16/10] rounded-[22px] overflow-hidden border border-border bg-muted">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>{featured.category}</span>
              {formatDate(featured.date) && <time dateTime={featured.date}>{formatDate(featured.date)}</time>}
              <span>{featured.readingTime} min read</span>
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground">
              <span className="link-draw">{featured.title}</span>
            </h3>
            <p className="mt-3 text-[15px] sm:text-base text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">{featured.excerpt}</p>
          </Link>

          {/* Text rows */}
          {rest.length > 0 && (
            <ul className="border-t border-border self-start">
              {rest.map((post) => (
                <li key={post.slug} className="border-b border-border max-sm:[&:nth-child(n+3)]:hidden">
                  <Link href={`/blog/${post.slug}`} className={`group flex items-start justify-between gap-6 py-7 sm:py-8 ${FOCUS_RING}`}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}
                        <span>{post.category}</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl sm:text-2xl font-semibold leading-snug tracking-[-0.03em] text-foreground line-clamp-3">
                        {post.title}
                      </h3>
                    </div>
                    <span aria-hidden="true" className="mt-1 w-11 h-11 rounded-full border border-border flex items-center justify-center flex-shrink-0 text-foreground transition-colors duration-500 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
