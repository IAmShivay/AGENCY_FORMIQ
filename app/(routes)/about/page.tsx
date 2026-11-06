import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/studio/PageHeader';
import Magnetic from '@/components/studio/Magnetic';
import { BTN_PRIMARY, CONTAINER, EYEBROW, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import { CLIENT_REGIONS, STUDIO_ADDRESS } from '@/lib/studio-facts';
import { PRICING_PLANS } from '@/lib/pricing';
import OpenSheetButton from '@/components/OpenSheetButton';

const OFFICE_PHOTO_SRC = 'https://res.cloudinary.com/dyiso4ohk/image/upload/v1792491779/WhatsApp_Image_2026-10-20_yp1tak.jpg';
const WHITEBOARD_PHOTO_SRC = 'https://res.cloudinary.com/dyiso4ohk/image/upload/v1792491788/Tech_Office_Services_Whiteboard_hwvgvb.png';

const WEBSITE_TIMELINE = PRICING_PLANS.find((p) => p.id === 'website')?.timeline ?? '';

const facts = [
  { value: String(CLIENT_REGIONS.length), label: `Regions we work with (${CLIENT_REGIONS.join(', ')})` },
  { value: WEBSITE_TIMELINE, label: 'Typical website build' },
  { value: 'Fixed quote', label: 'Agreed before we start' },
];

const values = [
  { title: 'Results-driven', description: 'Every decision we make is focused on delivering measurable outcomes for your business.' },
  { title: 'Fast delivery', description: 'We move fast without cutting corners. Your MVP in 15 days, production-ready.' },
  { title: 'Security first', description: 'Enterprise-grade security practices baked into every solution from day one.' },
  { title: 'Global reach', description: 'Teams across India and USA serving clients worldwide with round-the-clock support.' },
];

const expertise = [
  'Full-stack web development (React, Next.js, Node.js)',
  'Native & cross-platform mobile apps (React Native, Flutter)',
  'AI & ML automation (custom agents, workflow tools)',
  'E-commerce & marketplace management (Amazon, Flipkart, Shopify)',
  'Digital marketing (SEO, social media, email campaigns)',
  'Cloud infrastructure & DevOps (AWS, GCP, CI/CD)',
  'UI/UX design & branding',
  'ERP & management software',
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) About FormiqStudio"
        title={<>Your trusted <span className="text-primary">technology</span> partner</>}
        intro="FormiqStudio is a full-service digital agency that designs, develops, and delivers custom solutions to help businesses grow faster and smarter. We combine innovation, performance, and strategy to achieve measurable results."
      >
        <dl className="mt-14 sm:mt-20 grid border-t border-border sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="py-6 border-b border-border sm:border-b-0 sm:px-6 sm:first:pl-0 sm:[&:not(:first-child)]:border-l">
              <dt className={EYEBROW}>{f.label}</dt>
              <dd className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Office */}
      <section className="pb-20 sm:pb-28">
        <div className={CONTAINER}>
          <figure>
            <div className="relative overflow-hidden rounded-[22px] border border-border bg-muted aspect-[4/3] sm:aspect-[16/9]">
              <img
                src={OFFICE_PHOTO_SRC}
                alt={`FormiqStudio office in ${STUDIO_ADDRESS.city}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className={`${EYEBROW} mt-4`}>Our studio, {STUDIO_ADDRESS.locality}, {STUDIO_ADDRESS.city}</figcaption>
          </figure>

          <figure className="mt-10 sm:mt-14 lg:ml-auto lg:w-7/12">
            <div className="relative overflow-hidden rounded-[22px] border border-border bg-muted aspect-video">
              <img
                src={WHITEBOARD_PHOTO_SRC}
                alt="Strategy whiteboard planning client projects"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className={`${EYEBROW} mt-4`}>Strategy board, planning client projects</figcaption>
          </figure>
        </div>
      </section>

      {/* Story + values */}
      <section className={`border-t border-border ${SECTION_Y}`}>
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <p className={`${EYEBROW} mb-5`}>(02) Our story</p>
            <h2 className={H2}>Built to make good technology accessible</h2>
            <div className="mt-8 space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                FormiqStudio was founded with a simple mission: make world-class technology accessible to businesses of every size. We started as a small team of passionate developers and have grown into a full-service digital agency serving clients across India, USA, and beyond.
              </p>
              <p>
                What sets us apart is our speed and commitment to quality. We believe in shipping fast (our average MVP delivery is just 15 days) without ever compromising on code quality, security, or user experience.
              </p>
              <p>
                Today, we help companies across industries build, scale, and succeed with custom software, mobile apps, e-commerce platforms, AI automation, and digital marketing strategies.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className={`${EYEBROW} mb-5`}>(03) What we value</p>
            <ol className="border-t border-border">
              {values.map((v, i) => (
                <li key={v.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 sm:gap-x-6 py-6 sm:py-8 border-b border-border">
                  <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground pt-2">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">{v.title}</h3>
                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className={`tone-sand ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <p className={`${EYEBROW} mb-5`}>(04) Expertise</p>
              <h2 className={H2}>What we work on</h2>
            </div>
          </div>
          <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
            {expertise.map((item, i) => (
              <li key={item} className="flex items-baseline gap-4 py-5 border-b border-border text-base sm:text-lg">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{pad2(i + 1)}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className={SECTION_Y}>
        <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[1fr,auto] lg:items-end`}>
          <div>
            <p className={`${EYEBROW} mb-5`}>(05) Work with us</p>
            <h2 className={H2}>Ready to work <span className="text-primary">together</span>?</h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl">
              Let us help you turn your ideas into reality. Get a free consultation today.
            </p>
          </div>
          <Magnetic>
            <OpenSheetButton className={BTN_PRIMARY}>
              Get started
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
            </OpenSheetButton>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
