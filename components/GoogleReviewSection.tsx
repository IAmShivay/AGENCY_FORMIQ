"use client";

import { Star, QrCode, ExternalLink, Heart, MapPin } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/CdyKwEPD_8rDEBM/review";
const GOOGLE_PROFILE_URL = "https://g.page/r/CdyKwEPD_8rDEBM";
const QR_IMAGE = "/images/google-review-qr.png";

export default function GoogleReviewSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-muted/30 relative overflow-hidden">
      {/* subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-[24px] shadow-xl shadow-primary/5 overflow-hidden">
          {/* top accent bar - Google colors */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

          <div className="grid lg:grid-cols-[380px_1fr] gap-0">
            {/* LEFT - QR */}
            <div className="bg-muted/40 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold tracking-widest text-amber-700 uppercase mb-4">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Loved working with us?
              </div>

              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label="Tap to rate FormiqStudio on Google"
              >
                <div className="relative bg-white p-3 rounded-[20px] shadow-lg shadow-black/10 border border-border group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/20 transition-all duration-300 group-hover:-translate-y-0.5">
                  <img
                    src={QR_IMAGE}
                    alt="Scan QR code to rate FormiqStudio on Google - 4.9 stars from 50+ businesses"
                    width={280}
                    height={320}
                    className="w-[200px] sm:w-[240px] h-auto rounded-xl object-contain"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-center text-[11px] font-medium text-muted-foreground mt-3 flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
                  <ExternalLink className="w-3 h-3" /> Tap QR to open review page
                </p>
              </a>

              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> Scan with Camera
                </span>
                <span className="w-px h-3 bg-border" />
                <span>30 sec</span>
              </div>
            </div>

            {/* RIGHT - Content */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <img
                    src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico"
                    alt="Google"
                    className="w-5 h-5"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Google Reviews</span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified
                </span>
              </div>

              <h2 className="text-[22px] sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight mb-2">
                Enjoyed working with <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">FormiqStudio?</span>
              </h2>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-4">
                Your 5-star rating on Google helps local businesses in <span className="font-semibold text-foreground">Kolkata, Durgapur & Asansol</span> discover us. It takes just 30 seconds and means the world to our small team.
              </p>

              {/* Rating preview */}
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/50 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold text-foreground leading-none">4.9 / 5</div>
                  <div className="text-[11px] text-muted-foreground">from 50+ happy businesses</div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 ml-auto text-xs text-muted-foreground">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Helps us grow
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4285F4] text-white rounded-xl font-semibold hover:bg-[#3367D6] transition-all shadow-lg shadow-[#4285F4]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <Star className="w-4 h-4 fill-white" />
                  Rate us on Google
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <a
                  href={GOOGLE_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all hover:border-primary/20 text-sm"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  View profile
                </a>
              </div>

              <p className="text-[11px] text-muted-foreground mt-3 text-center sm:text-left">
                No login hassle · Tap stars to rate · Your review appears in ~1 day
              </p>

              {/* micro trust */}
              <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-border text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Real client reviews
                </span>
                <span className="hidden sm:block w-px h-4 bg-border" />
                <span>Already rated? Thank you — share with a friend!</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4 max-w-2xl mx-auto">
          Pro tip: On phone, just open Camera and point at QR. No app needed. On desktop, click the QR or the blue button above.
        </p>
      </div>
    </section>
  );
}
