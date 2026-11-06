import Marquee from './Marquee';

const ROW_A = ['Websites', 'Facebook & Instagram ads', 'Google Ads & SEO', 'Social media'];
const ROW_B = ['Shopify stores', 'Google Business', 'AI booking agents', 'E-commerce'];

const SEPARATOR = '/';

const ITEM_CLASS =
  'flex items-center font-display text-[2.9rem] min-[400px]:text-[3.4rem] sm:text-8xl lg:text-[8rem] font-bold tracking-[-0.055em] leading-[1.05] pb-[0.08em] text-foreground';

/** Two counter-running bands of everything included in the plan. Ink type on paper; the ember accent lives in the separators. */
export default function ServicesBand() {
  return (
    <section aria-label="What's included" className="relative w-full max-w-full overflow-hidden border-y border-border py-8 sm:py-12" data-no-reveal>
      <div className="space-y-0 sm:space-y-1">
        <Marquee speed={46}>
          {ROW_A.map((t) => (
            <span key={t} className={ITEM_CLASS}>
              {t}
              <span aria-hidden="true" className="mx-5 sm:mx-10 font-normal text-primary">{SEPARATOR}</span>
            </span>
          ))}
        </Marquee>
        <Marquee speed={52} reverse>
          {ROW_B.map((t) => (
            <span key={t} className={ITEM_CLASS}>
              {t}
              <span aria-hidden="true" className="mx-5 sm:mx-10 font-normal text-primary">{SEPARATOR}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
