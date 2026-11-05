"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Check, Phone, Volume2, VolumeX, RotateCcw, Star } from "lucide-react";
import LeadFormOverlay from './LeadFormOverlay';
import Magnetic from './studio/Magnetic';
import { getHeroMedia, DEFAULT_HERO_MEDIA, type HeroMedia } from '@/lib/siteContent';
import { gsap, SplitText, useGSAP, introReady, shouldPlayEntrance } from '@/lib/studio-motion';

// Canvas backdrop is client-only and off the critical path.
const AttentionField = dynamic(() => import('./studio/AttentionField'), { ssr: false });

/** WhatsApp mark in currentColor, so it follows the monochrome theme. */
const WhatsAppGlyph = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
  </svg>
);

const Hero = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [media, setMedia] = useState<HeroMedia>(DEFAULT_HERO_MEDIA);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLDivElement>(null);

  // Entrance: headline words rise out of line masks, then the rest follows.
  useGSAP(() => {
    if (!shouldPlayEntrance()) return;
    gsap.set('[data-hero-title]', { autoAlpha: 0 });
    gsap.set('[data-hero-in]', { y: 28, autoAlpha: 0 });
    Promise.all([introReady, document.fonts.ready]).then(() => {
      if (!root.current) return;
      const split = SplitText.create('[data-hero-title]', { type: 'words,lines', mask: 'lines' });
      gsap.set('[data-hero-title]', { autoAlpha: 1 });
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from(split.words, { yPercent: 110, duration: 1.2, stagger: 0.06 })
        .to('[data-hero-in]', { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.07 }, 0.3);
    });
  }, { scope: root });

  useEffect(() => {
    getHeroMedia().then(setMedia);
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    };
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("click", unlockAudio, { passive: true });
    window.addEventListener("scroll", unlockAudio, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsMuted(false);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  const handleVideoEnded = () => setIsEnded(true);
  const handleReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
    }
  };
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused && !isEnded) videoRef.current.play().catch(() => {});
    }
  };
  const handleVideoClick = () => {
    if (isEnded) { handleReplay(); return; }
    if (videoRef.current) {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else {
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
    }
  };

  return (
    <div ref={root} data-hero className="relative w-full bg-background overflow-hidden">
      <AttentionField />
      {/* Keeps the copy legible where the crowd drifts behind it */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_25%_42%,hsl(var(--background)/0.94)_35%,transparent_80%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 md:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-12 lg:gap-14 items-center">

          <div className="space-y-7">
            <div data-hero-in className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className="inline-flex items-center gap-2 text-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground" />
                </span>
                Kolkata · Durgapur · Asansol
              </span>
              <span className="hidden sm:inline-block w-6 h-px bg-border" />
              <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 4.9/5 · 50+ clients</span>
            </div>

            <h1 data-hero-title className="text-[2.6rem] leading-[0.98] min-[400px]:text-5xl sm:text-6xl lg:text-[4.6rem] xl:text-[5.4rem] font-bold tracking-[-0.05em] text-foreground">
              Get more customers <span className="text-outline">without</span> the confusion.
            </h1>

            <p data-hero-in className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              We build your website, run your ads, and manage your social media.
              You focus on your business. Starting at just{' '}
              <span className="text-foreground font-semibold underline decoration-1 underline-offset-4">Rs 6,999/month</span>
            </p>

            <ul data-hero-in className="space-y-2.5 max-w-md">
              {[
                "Website + Ads + Social Media — all included",
                "No contracts. Cancel anytime.",
                "We can meet you in person — we're local",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm sm:text-[15px] text-foreground">
                  <span className="w-5 h-5 rounded-full border border-foreground/25 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div data-hero-in className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
              <Magnetic>
                <button onClick={() => setShowLeadForm(true)} className="btn-ink btn-ink-invert h-14 px-7 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group">
                  Free consultation
                  <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic>
                <a href="https://wa.me/919832078313" target="_blank" rel="noopener noreferrer" data-track-source="hero" className="btn-ink h-14 px-7 border border-foreground/20 text-foreground rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap">
                  <WhatsAppGlyph className="w-[18px] h-[18px]" />
                  WhatsApp us
                </a>
              </Magnetic>
              <a href="tel:+918918349445" data-track-source="hero" className="hidden lg:inline-flex h-14 px-4 items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                <Phone className="w-4 h-4" /> <span className="link-draw">+91 8918349445</span>
              </a>
            </div>

            <div data-hero-in className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {['R', 'A', 'S'].map((ch) => (
                  <div key={ch} className="w-9 h-9 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-foreground">{ch}</div>
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-background bg-foreground flex items-center justify-center text-[11px] font-bold text-background">+47</div>
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-foreground fill-current" />)}
                  <span className="text-xs font-bold text-foreground ml-1.5">4.9/5</span>
                </div>
                <p className="text-[12px] text-muted-foreground">Trusted by 50+ local businesses</p>
              </div>
            </div>
          </div>

          <div data-hero-in className="space-y-3">
            <div
              data-cursor={isEnded ? 'Replay' : isMuted ? 'Sound' : 'Pause'}
              className="relative rounded-[22px] overflow-hidden border border-border bg-neutral-950 cursor-pointer shadow-[0_40px_80px_-40px_hsl(0_0%_0%/0.45)]"
              onClick={handleVideoClick}
            >
              <div className="absolute top-3 left-3 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-foreground font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" /> Live in 15 days
              </div>
              <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center px-3 py-1.5 rounded-full bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.12em]">
                Rs 6,999/mo
              </div>

              <video
                ref={videoRef}
                className="w-full h-full object-cover aspect-video"
                poster={
                  media.video_thumbnail && !media.video_thumbnail.includes("pexels")
                    ? media.video_thumbnail
                    : "https://res.cloudinary.com/dyiso4ohk/image/upload/v1792491779/WhatsApp_Image_2026-10-20_yp1tak.jpg"
                }
                autoPlay
                playsInline
                onEnded={handleVideoEnded}
              >
                <source
                  src={
                    media.video_url && !media.video_url.includes("pexels")
                      ? media.video_url
                      : "https://res.cloudinary.com/dyiso4ohk/video/upload/v1792491766/GROWTH_eqyg8v.mp4"
                  }
                  type="video/mp4"
                />
              </video>

              {isEnded && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer z-30" onClick={handleReplay}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform mb-2">
                    <RotateCcw className="w-7 h-7" />
                  </div>
                  <p className="text-white font-mono text-xs uppercase tracking-[0.16em]">Replay</p>
                </div>
              )}

              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white transition-colors active:scale-95 border border-white/10 z-20"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="grid grid-cols-3 gap-2" data-no-reveal>
              {media.gallery.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-border group/gallery">
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover grayscale group-hover/gallery:grayscale-0 group-hover/gallery:scale-105 transition-[filter,transform] duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em]">{img.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 border-y border-border" data-no-reveal>
              {[
                { stat: "50+", label: "Businesses grown" },
                { stat: "3×", label: "Avg. lead growth" },
                { stat: "15", label: "Days to go live" },
              ].map((item, i) => (
                <div key={i} className="py-3 px-2 text-center [&:not(:last-child)]:border-r border-border">
                  <div className="text-xl sm:text-2xl font-bold tracking-[-0.04em] text-foreground font-display">{item.stat}</div>
                  <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <div className="absolute bottom-12 sm:bottom-14 inset-x-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="relative block w-px h-7 bg-border overflow-hidden"><span className="absolute inset-x-0 top-0 h-1/2 bg-foreground studio-cue" /></span>
            Scroll
          </span>
          <span className="hidden lg:inline">Your ad pulls the crowd in · click to launch a campaign</span>
        </div>
      </div>
      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </div>
  );
};

export default Hero;
