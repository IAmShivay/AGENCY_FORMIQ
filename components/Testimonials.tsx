"use client";

import { Star, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    quote: "We were spending Rs 15,000 on a freelancer who wasn't delivering. FormiqStudio built us a proper website and started running ads. We got 38 enquiries in the first month itself.",
    name: "Rajesh Mondal",
    role: "Mondal Interior Solutions",
    location: "Durgapur",
    result: "38 leads in month 1",
  },
  {
    quote: "I had no online presence at all. They set up everything - website, Google listing, social media. Now customers find us on Google and call directly. Worth every rupee.",
    name: "Ananya Ghosh",
    role: "Ananya's Kitchen Catering",
    location: "Kolkata",
    result: "3x more calls",
  },
  {
    quote: "What I liked most is they came to my shop in Asansol to understand my business. No other agency does that. The ads they run bring 2-3 new customers every week.",
    name: "Sunil Prasad",
    role: "SP Electronics",
    location: "Asansol",
    result: "2-3 customers/week",
  },
  {
    quote: "We were wasting money on newspaper ads. FormiqStudio moved us to Facebook ads and built a landing page. Our cost per lead dropped from Rs 800 to Rs 120.",
    name: "Priya Sharma",
    role: "StyleCraft Fashion",
    location: "Kolkata",
    result: "Rs 120 per lead",
  },
  {
    quote: "They delivered our e-commerce website in exactly 15 days. Clean design, fast loading, and the payment integration works perfectly. Sales started from day one.",
    name: "Amit Banerjee",
    role: "Bengal Handicrafts",
    location: "Durgapur",
    result: "Live in 15 days",
  },
  {
    quote: "As a gym owner, I needed local customers. Their Google Ads and social media posts brought in 22 new memberships in the first month. Best investment I've made.",
    name: "Vikram Singh",
    role: "FitZone Gym",
    location: "Kolkata",
    result: "22 new members",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            Real Results from Real Businesses
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Local businesses in Kolkata, Durgapur & Asansol trust us with their growth
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="group p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {t.result}
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-foreground leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20similar%20results%20for%20my%20business" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20">
              Get Results Like These
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
