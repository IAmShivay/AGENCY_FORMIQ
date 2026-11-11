'use client';

import type { ButtonHTMLAttributes } from 'react';
import { openLeadSheet } from '@/lib/lead-sheet';

export default function OpenSheetButton({ onClick, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) openLeadSheet(); }}
      {...props}
    />
  );
}
