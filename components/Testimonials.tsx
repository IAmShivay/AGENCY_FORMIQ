"use client";

import { Star, ArrowRight } from 'lucide-react';

const testimonials = [
  { quote: "We got 38 enquiries in the first month itself. Way better than the freelancer we had before.", name: "Rajesh Mondal", role: "Mondal Interior Solutions", location: "Durgapur", result: "38 leads/month" },
  { quote: "No online presence to 3x more calls from Google. They set up everything - website, listing, social media.", name: "Ananya Ghosh", role: "Ananya's Kitchen Catering", location: "Kolkata", result: "3x more calls" },
  { quote: "They came to my shop in Asansol to understand my business. Ads bring 2-3 new customers every week.", name: "Sunil Prasad", role: "SP Electronics", location: "Asansol", result: "2-3 customers/week" },
  { quote: "Cost per lead dropped from Rs 800 to Rs 120. Facebook ads + landing page changed everything.", name: "Priya Sharma", role: "StyleCraft Fashion", location: "Kolkata", result: "Rs 120/lead" },
  { quote: "E-commerce website in 15 days. Clean design, payments work perfectly. Sales from day one.", name: "Amit Banerjee", role: "Bengal Handicrafts", location: "Durgapur", result: "Live in 15 days" },
  { quote: "22 new gym memberships in month one from Google Ads + social media. Best investment I've made.", name: "Vikram Singh", role: "FitZone Gym", location: "Kolkata", result: "22 new members" },
];

export default function Testimonials() {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1.5 sm:mb-3">
            Real Results from Real Businesses
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Local businesses in Kolkata, Durgapur & Asansol trust us
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {testimonials.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-[80vw] snap-center p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {t.result}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-2.5 pt-2.5 border-t border-border">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}, {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
              <p className="text-[15px] text-foreground leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
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

        <div className="text-center mt-6 sm:mt-10">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20similar%20results" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all text-sm sm:text-base shadow-lg shadow-primary/20">
              Get Results Like These
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
