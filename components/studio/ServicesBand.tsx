import Marquee from './Marquee';

const ROW_A = ['Websites', 'Facebook & Instagram ads', 'Google Ads & SEO', 'Social media'];
const ROW_B = ['Shopify stores', 'Google Business', 'AI booking agents', 'E-commerce'];

/** Two counter-running bands of everything included in the plan. */
export default function ServicesBand() {
  return (
    <section aria-label="What's included" className="border-y border-border py-6 sm:py-10 overflow-hidden bg-background" data-no-reveal>
      <div className="space-y-1 sm:space-y-2 -rotate-[1.5deg] scale-[1.03]">
        <Marquee speed={46}>
          {ROW_A.map((t) => (
            <span key={t} className="flex items-center font-display text-[2.6rem] sm:text-7xl lg:text-[6.5rem] font-semibold tracking-[-0.05em] leading-[1.1] pb-[0.1em] text-foreground">
              {t}<span className="mx-5 sm:mx-9 text-[0.45em] text-foreground/40">✦</span>
            </span>
          ))}
        </Marquee>
        <Marquee speed={52} reverse>
          {ROW_B.map((t) => (
            <span key={t} className="flex items-center font-display text-[2.6rem] sm:text-7xl lg:text-[6.5rem] font-semibold tracking-[-0.05em] leading-[1.1] pb-[0.1em] text-outline">
              {t}<span className="mx-5 sm:mx-9 text-[0.45em] text-foreground/40 [-webkit-text-stroke:0]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
