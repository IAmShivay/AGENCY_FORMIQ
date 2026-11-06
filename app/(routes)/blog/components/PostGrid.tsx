import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';
import { EYEBROW, FOCUS_RING } from '@/components/studio/ui';

export const formatPostDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/** Studio grid of blog post cards: rounded image, mono meta, display title. */
export default function PostGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className={`group block rounded-[22px] ${FOCUS_RING}`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-border bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <p className={`${EYEBROW} mt-5`}>
              {post.category} <span aria-hidden="true">·</span> {formatPostDate(post.date)}
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.035em]">
              <span className="link-draw">{post.title}</span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
            <p className="mt-4 text-sm text-muted-foreground">{post.author.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
