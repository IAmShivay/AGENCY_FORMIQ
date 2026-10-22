"use client";

import { useEffect } from "react";
import { ADSENSE_PUBLISHER_ID } from "@/lib/adsense";

interface BlogAdUnitProps {
  slot: string;
  publisherId?: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
  label?: string;
}

export default function BlogAdUnit({
  slot,
  publisherId,
  format = "auto",
  className = "",
  label = "Advertisement",
}: BlogAdUnitProps) {
  const pubId = publisherId || ADSENSE_PUBLISHER_ID;
  const isPlaceholder = pubId.includes("0000000000000000");

  useEffect(() => {
    if (isPlaceholder) return;
    try {
      const w = window as unknown as { adsbygoogle: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error", e);
    }
  }, [isPlaceholder]);

  if (isPlaceholder) {
    // Placeholder box in dev / before approval - visible but not an ad
    return (
      <div
        className={`my-6 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center ${className}`}
        aria-label={label}
      >
        <div className="px-4 py-6">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            AdSense slot <span className="font-mono">{slot}</span> — set <span className="font-mono">NEXT_PUBLIC_ADSENSE_ID</span> to enable
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Only visible on /blog — not on homepage or portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-ad my-6 overflow-hidden rounded-xl border border-border/50 bg-card ${className}`} aria-label={label}>
      <p className="px-3 py-1 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
