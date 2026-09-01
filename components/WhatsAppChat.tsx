'use client';

import { useEffect } from 'react';

const WhatsAppChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js';
    script.id = 'aisensy-wa-widget';
    script.setAttribute('widget-id', 'aabmk4');
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById('aisensy-wa-widget');
      if (existing) existing.remove();
    };
  }, []);

  return null;
};

export default WhatsAppChat;
