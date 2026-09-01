'use client';

import Script from 'next/script';

const WhatsAppChat = () => {
  return (
    <Script
      src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
      id="aisensy-wa-widget"
      strategy="lazyOnload"
      data-widget-id="aabmk4"
    />
  );
};

export default WhatsAppChat;
