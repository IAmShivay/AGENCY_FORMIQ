'use client';

import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // First Input Delay (FID) and Cumulative Layout Shift (CLS)
      const webVitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.entryType}:`, entry);
        }
      });

      try {
        webVitalsObserver.observe({ entryTypes: ['first-input', 'layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // Memory usage monitoring (if available)
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }

      return () => {
        observer.disconnect();
        webVitalsObserver.disconnect();
      };
    }
  }, []);

  return null;
};

export default PerformanceMonitor;
