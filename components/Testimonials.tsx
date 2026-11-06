"use client";

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Magnetic from './studio/Magnetic';
import { GOOGLE_REVIEW_URL } from '@/lib/studio-facts';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const WHATSAPP_RESULTS_URL = 'https://wa.me/919832078313?text=Hi%2C%20I%20want%20similar%20results';

const testimonials = [
  { quote: "We got 38 enquiries in the first month itself. Way better than the freelancer we had before.", name: "Rajesh Mondal", role: "Mondal Interior Solutions", location: "Durgapur", result: "38 leads/month", initials: "RM" },
  { quote: "No online presence to 3x more calls from Google. They set up everything — website, listing, social media.", name: "Ananya Ghosh", role: "Ananya's Kitchen Catering", location: "Kolkata", result: "3x more calls", initials: "AG" },
  { quote: "They came to my shop in Asansol to understand my business. Ads bring 2-3 new customers every week.", name: "Sunil Prasad", role: "SP Electronics", location: "Asansol", result: "2-3/week", initials: "SP" },
  { quote: "Cost per lead dropped from Rs 800 to Rs 120. Facebook ads + landing page changed everything.", name: "Priya Sharma", role: "StyleCraft Fashion", location: "Kolkata", result: "Rs 120/lead", initials: "PS" },
  { quote: "E-commerce website in 15 days. Clean design, payments work perfectly. Sales from day one.", name: "Amit Banerjee", role: "Bengal Handicrafts", location: "Durgapur", result: "Live in 15 days", initials: "AB" },
  { quote: "22 new gym memberships in month one from Google Ads + social media. Best investment I've made.", name: "Vikram Singh", role: "FitZone Gym", location: "Kolkata", result: "22 new members", initials: "VS" },
];

type Testimonial = (typeof testimonials)[number];

const Avatar = ({ t, size }: { t: Testimonial; size: 'sm' | 'lg' }) => (
  <span
    aria-hidden="true"
    className={`flex flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background font-semibold ${size === 'lg' ? 'w-12 h-12 text-sm' : 'w-9 h-9 text-xs'}`}
  >
    {t.initials}
  </span>
);

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">(04) Clients</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Real results from real businesses
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Local businesses in Kolkata, Durgapur &amp; Asansol trust us. Here&rsquo;s what they say.
          </p>
        </div>

        {/* Featured quote */}
        <figure className="border-t border-border pt-10 sm:pt-14 pb-14 sm:pb-20 grid gap-8 lg:grid-cols-12">
          <span aria-hidden="true" className="lg:col-span-1 font-display text-7xl sm:text-8xl leading-[0.7] text-primary select-none">&ldquo;</span>
          <div className="lg:col-span-11">
            <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.08] tracking-[-0.035em] max-w-5xl">
              {featured.quote}
            </blockquote>
            <figcaption className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="flex items-center gap-3">
                <Avatar t={featured} size="lg" />
                <span>
                  <cite className="block not-italic font-semibold">{featured.name}</cite>
                  <span className="block text-sm text-muted-foreground">{featured.role} · {featured.location}</span>
                </span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground border-l border-border pl-6">
                {featured.result}
              </span>
            </figcaption>
          </div>
        </figure>

        {/* The rest: swipe row on mobile, two-column masonry from sm up */}
        <ul
          tabIndex={0}
          aria-label="More client testimonials"
          className={`-mx-4 px-4 scroll-px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:block sm:columns-2 sm:gap-4 sm:overflow-visible sm:pb-0 rounded-sm ${FOCUS_RING}`}
        >
          {rest.map((t) => (
            <li key={t.name} data-reveal className="w-[82%] flex-shrink-0 snap-start sm:w-auto sm:mb-4 sm:break-inside-avoid">
              <figure className="h-full p-6 sm:p-7 rounded-2xl bg-card text-card-foreground border border-border">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.result}</p>
                <blockquote className="mt-4 text-[15px] sm:text-base leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar t={t} size="sm" />
                  <span className="min-w-0">
                    <cite className="block not-italic text-sm font-semibold">{t.name}</cite>
                    <span className="block text-xs text-muted-foreground">{t.role} · {t.location}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Footer row */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-5">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm ${FOCUS_RING}`}
          >
            <span className="link-draw">Read our reviews on Google</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <Magnetic>
            <a
              href={WHATSAPP_RESULTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-ink btn-ink-invert h-14 px-7 bg-foreground text-background rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group/cta ${FOCUS_RING}`}
            >
              Get results like these
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
