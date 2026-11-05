'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, introReady, isLowEnd } from '@/lib/studio-motion';

/**
 * "Attention → customers". A faint crowd of people mills around the hero; some
 * of them get caught and flow along curves into a street of shopfronts, which
 * light up with a "+1". The cursor is "your ad": it pulls nearby people in and
 * routes them through itself. A click launches a campaign burst.
 * Monochrome — colours come from the theme's foreground token.
 */

type Person = { x: number; y: number; vx: number; vy: number; a: number };
type Lead = { sx: number; sy: number; cx: number; cy: number; shop: number; t: number; speed: number; trail: number[] };
type Shop = { x: number; w: number; glow: number };
type Pop = { x: number; y: number; t: number };

export default function AttentionField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const host = canvas.closest('[data-hero]') as HTMLElement;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const low = isLowEnd();
    const small = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);

    let W = 0, H = 0, street = 0;
    let ink = '0 0% 5%';
    let mono = 'ui-monospace, monospace';
    const readInk = () => {
      const cs = getComputedStyle(canvas);
      ink = cs.getPropertyValue('--foreground').trim() || ink;
      // Canvas can't resolve var(); use the concrete family next/font generated.
      mono = cs.getPropertyValue('--font-mono').trim() || mono;
    };
    readInk();
    const themeObs = new MutationObserver(() => { readInk(); if (reduced) frame(0); });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

    const crowdSize = low ? 200 : small ? 150 : 380;
    const people: Person[] = [];
    const leads: Lead[] = [];
    const pops: Pop[] = [];
    let shops: Shop[] = [];

    const seat = (p: Person) => {
      p.x = Math.random() * W; p.y = Math.random() * (street - 40);
      p.vx = (Math.random() - 0.5) * 12; p.vy = (Math.random() - 0.5) * 12; p.a = 0;
    };
    const layout = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      street = H - (small ? 28 : 40);
      const n = Math.max(5, Math.min(16, Math.floor(W / (small ? 70 : 92))));
      const gap = W / n;
      shops = Array.from({ length: n }, (_, i) => ({ x: gap * i + gap / 2, w: Math.min(30, gap * 0.45), glow: 0 }));
      if (!people.length) for (let i = 0; i < crowdSize; i++) { const p = {} as Person; seat(p); p.a = Math.random(); people.push(p); }
      else people.forEach((p) => { p.x = Math.min(p.x, W); p.y = Math.min(p.y, street - 40); });
      if (reduced) frame(0);
    };
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    // ---- pointer = "your ad" ----
    const mouse = { x: -1e4, y: -1e4, on: false };
    let ripple = { x: 0, y: 0, t: 9 };
    const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const [x, y] = local(e); mouse.x = x; mouse.y = y; mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; };
    const nearestShop = (x: number) => {
      let best = 0, bd = Infinity;
      shops.forEach((s, i) => { const d = Math.abs(s.x - x); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const capture = (p: Person, via?: { x: number; y: number }) => {
      if (leads.length > (small ? 26 : 48)) return;
      // Head for one of the closer shopfronts, curving through the ad when there is one.
      const shop = Math.max(0, Math.min(shops.length - 1, nearestShop(p.x) + Math.round((Math.random() - 0.5) * 4)));
      const cx = via ? via.x : (p.x + shops[shop].x) / 2 + (Math.random() - 0.5) * 120;
      const cy = via ? via.y : Math.min(p.y, street) + (street - p.y) * 0.2;
      leads.push({ sx: p.x, sy: p.y, cx, cy, shop, t: 0, speed: 0.35 + Math.random() * 0.35, trail: [] });
      seat(p);
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button, video, input, textarea')) return;
      const [x, y] = local(e);
      ripple = { x, y, t: 0 };
      // Campaign burst: everyone nearby converts at once.
      people.filter((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < 170 ** 2).slice(0, 26).forEach((p) => capture(p, { x, y }));
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);

    // ---- lifecycle ----
    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(canvas);
    let scrollP = 0;
    const st = ScrollTrigger.create({ trigger: host, start: 'top top', end: 'bottom top', onUpdate: (s) => { scrollP = s.progress; } });
    const intro = { v: reduced ? 1 : 0 };
    let introTween: gsap.core.Tween | undefined;
    introReady.then(() => { if (!reduced) introTween = gsap.to(intro, { v: 1, duration: 1.8, ease: 'power2.out', delay: 0.2 }); });

    let captureClock = 0;
    function frame(dt: number) {
      ctx.clearRect(0, 0, W, H);
      const fade = intro.v * (1 - scrollP);
      if (fade < 0.01) return;
      const col = (a: number) => `hsl(${ink} / ${a * fade})`;

      // Crowd: gentle wandering, a soft pull toward the ad.
      ctx.fillStyle = col(0.22);
      ctx.beginPath();
      for (const p of people) {
        p.vx += (Math.random() - 0.5) * 18 * dt; p.vy += (Math.random() - 0.5) * 18 * dt;
        if (mouse.on) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
          if (d2 < 220 ** 2) { const k = 30 / Math.sqrt(d2 + 400); p.vx += dx * k * dt; p.vy += dy * k * dt; }
        }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0) p.x += W; else if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += street - 40; else if (p.y > street - 40) p.y -= street - 40;
        p.a = Math.min(1, p.a + dt * 0.8);
        const s = 1.6 * p.a;
        ctx.rect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.fill();

      // Steady trickle of conversions; much faster around the ad.
      captureClock += dt;
      const interval = small ? 0.5 : 0.28;
      while (captureClock > interval) {
        captureClock -= interval;
        const p = people[(Math.random() * people.length) | 0];
        capture(p);
      }
      if (mouse.on && Math.random() < dt * 9) {
        const near = people.find((p) => (p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2 < 90 ** 2);
        if (near) capture(near, { x: mouse.x, y: mouse.y });
      }

      // Leads travelling along their curve, with short trails.
      ctx.lineCap = 'round';
      ctx.strokeStyle = col(0.75);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = leads.length - 1; i >= 0; i--) {
        const l = leads[i];
        l.t += dt * l.speed;
        const shop = shops[l.shop];
        if (!shop) { leads.splice(i, 1); continue; }
        const tx = shop.x, ty = street - 12;
        if (l.t >= 1) {
          shop.glow = 1;
          if (pops.length < 14) pops.push({ x: tx, y: street - 30, t: 0 });
          leads.splice(i, 1);
          continue;
        }
        const u = 1 - l.t;
        const x = u * u * l.sx + 2 * u * l.t * l.cx + l.t * l.t * tx;
        const y = u * u * l.sy + 2 * u * l.t * l.cy + l.t * l.t * ty;
        l.trail.push(x, y);
        if (l.trail.length > 14) l.trail.splice(0, 2);
        ctx.moveTo(l.trail[0], l.trail[1]);
        for (let k = 2; k < l.trail.length; k += 2) ctx.lineTo(l.trail[k], l.trail[k + 1]);
      }
      ctx.stroke();
      ctx.fillStyle = col(1);
      ctx.beginPath();
      for (const l of leads) { const n = l.trail.length; if (n) { ctx.moveTo(l.trail[n - 2] + 2, l.trail[n - 1]); ctx.arc(l.trail[n - 2], l.trail[n - 1], 2, 0, 6.283); } }
      ctx.fill();

      // The street: a baseline and minimal shopfronts (awning + door).
      ctx.strokeStyle = col(0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, street + 0.5); ctx.lineTo(W, street + 0.5);
      for (const s of shops) {
        const h = s.w * 0.9, l = s.x - s.w / 2, top = street - h;
        ctx.moveTo(l, street); ctx.lineTo(l, top + 6); ctx.lineTo(l + s.w, top + 6); ctx.lineTo(l + s.w, street);
        // awning
        ctx.moveTo(l - 3, top + 6); ctx.lineTo(l + 2, top); ctx.lineTo(l + s.w - 2, top); ctx.lineTo(l + s.w + 3, top + 6);
        // door
        ctx.moveTo(s.x - 3.5, street); ctx.lineTo(s.x - 3.5, street - h * 0.45); ctx.lineTo(s.x + 3.5, street - h * 0.45); ctx.lineTo(s.x + 3.5, street);
      }
      ctx.stroke();
      for (const s of shops) {
        if (s.glow <= 0) continue;
        const h = s.w * 0.9, l = s.x - s.w / 2;
        ctx.fillStyle = col(0.16 + s.glow * 0.5);
        ctx.fillRect(l + 1, street - h + 7, s.w - 2, h - 7);
        s.glow = Math.max(0, s.glow - dt * 1.4);
      }

      // "+1" pops float up from each shop that just got a customer.
      ctx.font = `500 10px ${mono}`;
      ctx.textAlign = 'center';
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.t += dt;
        if (p.t > 1.1) { pops.splice(i, 1); continue; }
        ctx.fillStyle = col(Math.max(0, 1 - p.t / 1.1) * 0.9);
        ctx.fillText('+1', p.x, p.y - p.t * 26);
      }

      // The ad itself: a dashed halo and a mono tag.
      if (mouse.on) {
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = col(0.45);
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 90, 0, 6.283); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = col(0.7); ctx.textAlign = 'left';
        ctx.fillText('YOUR AD', mouse.x + 16, mouse.y - 14);
      }
      if (ripple.t < 1) {
        ripple.t += dt;
        ctx.strokeStyle = col((1 - ripple.t) * 0.8);
        ctx.beginPath(); ctx.arc(ripple.x, ripple.y, 10 + ripple.t * 180, 0, 6.283); ctx.stroke();
      }
    }

    const budget = small || low ? 1 / 30 : 0;
    let acc = 0;
    const tick = (_t: number, ms: number) => {
      if (reduced || !visible || document.hidden) return;
      acc += Math.min(ms / 1000, 0.1);
      if (acc < budget) return;
      frame(Math.min(acc, 0.05));
      acc = 0;
    };
    gsap.ticker.add(tick);
    layout();

    return () => {
      gsap.ticker.remove(tick);
      introTween?.kill(); st.kill(); io.disconnect(); ro.disconnect(); themeObs.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
