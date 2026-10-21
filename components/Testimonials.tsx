"use client";

import { Star, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  { quote: "We got 38 enquiries in the first month itself. Way better than the freelancer we had before.", name: "Rajesh Mondal", role: "Mondal Interior Solutions", location: "Durgapur", result: "38 leads/month", initials: "RM", color: "bg-blue-500" },
  { quote: "No online presence to 3x more calls from Google. They set up everything — website, listing, social media.", name: "Ananya Ghosh", role: "Ananya's Kitchen Catering", location: "Kolkata", result: "3x more calls", initials: "AG", color: "bg-pink-500" },
  { quote: "They came to my shop in Asansol to understand my business. Ads bring 2-3 new customers every week.", name: "Sunil Prasad", role: "SP Electronics", location: "Asansol", result: "2-3/week", initials: "SP", color: "bg-amber-500" },
  { quote: "Cost per lead dropped from Rs 800 to Rs 120. Facebook ads + landing page changed everything.", name: "Priya Sharma", role: "StyleCraft Fashion", location: "Kolkata", result: "Rs 120/lead", initials: "PS", color: "bg-emerald-500" },
  { quote: "E-commerce website in 15 days. Clean design, payments work perfectly. Sales from day one.", name: "Amit Banerjee", role: "Bengal Handicrafts", location: "Durgapur", result: "Live in 15 days", initials: "AB", color: "bg-violet-500" },
  { quote: "22 new gym memberships in month one from Google Ads + social media. Best investment I've made.", name: "Vikram Singh", role: "FitZone Gym", location: "Kolkata", result: "22 new members", initials: "VS", color: "bg-orange-500" },
];

export default function Testimonials() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold tracking-widest text-amber-700 uppercase mb-3">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Real results
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
            Real Results from Real Businesses
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Local businesses in Kolkata, Durgapur & Asansol trust us — here’s what they say
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex sm:hidden gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex-shrink-0 w-[84vw] snap-center p-4 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">
              <Quote className="absolute top-3 right-3 w-8 h-8 text-muted/40" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                  {t.result}
                </span>
              </div>
              <blockquote className="text-sm text-foreground leading-relaxed mb-4 relative z-10">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-2.5 pt-3 border-t border-border relative z-10">
                <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {t.initials}
                </div>
                <div>
                  <cite className="text-xs font-semibold text-foreground not-italic">{t.name}</cite>
                  <p className="text-[11px] text-muted-foreground">{t.role} · {t.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <figure key={i} className="group relative p-6 rounded-[20px] bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <Quote className="absolute top-4 right-4 w-10 h-10 text-muted/30 group-hover:text-primary/10 transition-colors" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {t.result}
                </span>
              </div>
              <blockquote className="text-[15px] text-foreground leading-relaxed mb-5 relative z-10">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border relative z-10">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {t.initials}
                </div>
                <div>
                  <cite className="text-sm font-semibold text-foreground not-italic">{t.name}</cite>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Trust strip below */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-10 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified Google Reviews</span>
          <span className="hidden sm:block w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9/5 average rating</span>
          <span className="hidden sm:block w-px h-4 bg-border" />
          <span>50+ happy businesses</span>
        </div>

        <div className="text-center mt-8">
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20similar%20results" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all text-sm sm:text-[15px] shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group">
              Get Results Like These
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
