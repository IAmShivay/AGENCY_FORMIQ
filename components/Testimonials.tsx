import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "We were spending Rs 15,000 on a freelancer who wasn't delivering. FormiqStudio built us a proper website and started running ads. We got 38 enquiries in the first month itself.",
    name: "Rajesh Mondal",
    role: "Owner, Mondal Interior Solutions",
    location: "Durgapur",
    result: "38 leads in month 1",
  },
  {
    quote: "I had no online presence at all. They set up everything - website, Google listing, social media. Now customers find us on Google and call directly. Worth every rupee.",
    name: "Ananya Ghosh",
    role: "Founder, Ananya's Kitchen Catering",
    location: "Kolkata",
    result: "3x more calls from Google",
  },
  {
    quote: "What I liked most is they came to my shop in Asansol to understand my business. No other agency does that. The ads they run bring 2-3 new customers every week.",
    name: "Sunil Prasad",
    role: "Owner, SP Electronics",
    location: "Asansol",
    result: "2-3 new customers/week",
  },
  {
    quote: "We were wasting money on newspaper ads. FormiqStudio moved us to Facebook ads and built a landing page. Our cost per lead dropped from Rs 800 to Rs 120.",
    name: "Priya Sharma",
    role: "Director, StyleCraft Fashion",
    location: "Kolkata",
    result: "Cost per lead Rs 800 to Rs 120",
  },
  {
    quote: "They delivered our e-commerce website in exactly 15 days. Clean design, fast loading, and the payment integration works perfectly. Sales started from day one.",
    name: "Amit Banerjee",
    role: "Founder, Bengal Handicrafts",
    location: "Durgapur",
    result: "Website live in 15 days",
  },
  {
    quote: "As a gym owner, I needed local customers. Their Google Ads and social media posts brought in 22 new memberships in the first month. Best investment I've made.",
    name: "Vikram Singh",
    role: "Owner, FitZone Gym",
    location: "Kolkata",
    result: "22 new memberships in month 1",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Real Results from Real Businesses
          </h2>
          <p className="text-muted-foreground text-sm">
            Local businesses in Kolkata, Durgapur & Asansol trust us with their growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {t.result}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} - {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
