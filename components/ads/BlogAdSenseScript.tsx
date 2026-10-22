"use client";

import Script from "next/script";
import { ADSENSE_PUBLISHER_ID } from "@/lib/adsense";

export default function BlogAdSenseScript() {
  const publisherId = ADSENSE_PUBLISHER_ID;
  const isPlaceholder = publisherId.includes("0000000000000000");

  if (isPlaceholder) return null;

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
