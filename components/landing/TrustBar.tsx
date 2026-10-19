"use client";

import { Star, ShieldCheck, Clock, Users, MapPin } from "lucide-react";

const TrustBar = () => {
  return (
    <section className="py-3 sm:py-3.5 bg-card border-y border-border/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile: compact 2 rows */}
        <div className="flex flex-col sm:hidden gap-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">4.9/5</span>
            <span className="text-[11px] text-muted-foreground">· 50+ businesses</span>
            <span className="w-px h-3 bg-border mx-1" />
            <span className="text-[11px] font-medium text-foreground flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> Kolkata · Durgapur · Asansol</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> No lock-in</span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-primary" /> 15 days</span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-primary" /> Local team</span>
          </div>
        </div>

        {/* Desktop: single row premium */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-0.5 p-1.5 rounded-full bg-amber-50 border border-amber-200">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">4.9/5</span>
              <span className="text-sm text-muted-foreground">from 50+ local businesses</span>
            </div>
            <div className="h-5 w-px bg-border" />
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> Serving <span className="font-semibold text-foreground">Kolkata · Durgapur · Asansol</span>
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"><ShieldCheck className="w-3.5 h-3.5" /> No lock-in · Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Live in 15 days</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
