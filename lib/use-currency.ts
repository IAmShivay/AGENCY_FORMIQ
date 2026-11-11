'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY, detectCurrency, isCurrencyCode, type CurrencyCode } from './pricing';

// One store for the whole page, so every price follows the pricing toggle.
let current: CurrencyCode = DEFAULT_CURRENCY;
let resolved = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

const readStored = (): CurrencyCode | null => {
  try {
    const v = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isCurrencyCode(v) ? v : null;
  } catch {
    return null;
  }
};

const writeStored = (c: CurrencyCode) => {
  try { window.localStorage.setItem(CURRENCY_STORAGE_KEY, c); } catch { /* storage blocked */ }
};

const setCurrency = (c: CurrencyCode) => {
  resolved = true;
  if (c === current) return;
  current = c;
  writeStored(c);
  emit();
};

/** Stored choice, else the visitor's time zone. Runs once, after the first mount. */
const resolveOnce = () => {
  if (resolved) return;
  resolved = true;
  const next = readStored() ?? detectCurrency();
  if (next === current) return;
  current = next;
  emit();
};

const onStorage = (e: StorageEvent) => {
  if (e.key !== CURRENCY_STORAGE_KEY || !isCurrencyCode(e.newValue) || e.newValue === current) return;
  current = e.newValue;
  emit();
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
};

const getSnapshot = () => current;
const getServerSnapshot = () => DEFAULT_CURRENCY;

/** Visitor's display currency, shared across components. Server and hydration render use DEFAULT_CURRENCY. */
export function useCurrency(): [CurrencyCode, (c: CurrencyCode) => void] {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(resolveOnce, []);
  return [currency, setCurrency];
}
