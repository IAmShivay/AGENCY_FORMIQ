'use client';

import { ReactNode, useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { ADMIN_BTN_ACCENT, ADMIN_BTN_DANGER, ADMIN_BTN_OUTLINE, ADMIN_BTN_PRIMARY, ADMIN_ICON_BTN, ADMIN_TONE } from '@/components/admin/admin-ui';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-[95vw]',
} as const;

const OVERLAY = 'fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-[2px]';
const PANEL = 'w-full rounded-2xl border border-border bg-card text-card-foreground';

const useEscape = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);
};

export default function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }: ModalProps) {
  useEscape(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className={OVERLAY}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`${PANEL} ${SIZE_CLASSES[size]} flex max-h-[90vh] flex-col overflow-hidden`}>
        <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
          {showCloseButton && (
            <button type="button" onClick={onClose} className={ADMIN_ICON_BTN} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const CONFIRM_TYPES = {
  danger: { tone: ADMIN_TONE.negative, icon: AlertTriangle, button: ADMIN_BTN_DANGER },
  warning: { tone: ADMIN_TONE.warning, icon: AlertTriangle, button: ADMIN_BTN_PRIMARY },
  info: { tone: ADMIN_TONE.accent, icon: Info, button: ADMIN_BTN_ACCENT },
} as const;

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmModalProps) {
  useEscape(isOpen, onClose);
  if (!isOpen) return null;
  const { tone, icon: Icon, button } = CONFIRM_TYPES[type];

  return (
    <div className={OVERLAY}>
      <div role="alertdialog" aria-modal="true" aria-label={title} className={`${PANEL} max-w-md p-6`}>
        <div className="flex items-start gap-4">
          <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${tone}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={ADMIN_BTN_OUTLINE}>{cancelText}</button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className={button}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
