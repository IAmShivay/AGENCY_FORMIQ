'use client';

import { useEffect, useState } from 'react';
import LeadFormOverlay from './LeadFormOverlay';
import { OPEN_LEAD_SHEET_EVENT } from '@/lib/lead-sheet';

export default function LeadSheetHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_LEAD_SHEET_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LEAD_SHEET_EVENT, onOpen);
  }, []);

  return <LeadFormOverlay open={open} onClose={() => setOpen(false)} />;
}
