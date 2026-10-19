"use client";

import Script from "next/script";

// Loads AdSense library ONLY for blog routes (via blog layout)
// Uses NEXT_PUBLIC_ADSENSE_ID - falls back to placeholder (no network request if placeholder)
export default function BlogAdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-0000000000000000";
  const isPlaceholder = publisherId.includes("0000000000000000");

  // Don't load external script in dev/placeholder — prevents console errors before approval
  if (isPlaceholder) return null;

  // Only render in production (per best practice vibeberry.io)
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
