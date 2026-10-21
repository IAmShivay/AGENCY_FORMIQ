"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Phone, Sparkles, Volume2, VolumeX, RotateCcw, Star, ShieldCheck, Zap } from "lucide-react";
import { trackContact } from '@/lib/meta-pixel';
import LeadFormOverlay from './LeadFormOverlay';
import { getHeroMedia, DEFAULT_HERO_MEDIA, type HeroMedia } from '@/lib/siteContent';

const Hero = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [media, setMedia] = useState<HeroMedia>(DEFAULT_HERO_MEDIA);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className="relative w-full bg-background overflow-hidden">
      {/* Premium mesh gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-t from-primary/[0.03] to-transparent blur-2xl" />
      </div>
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          <div className="text-center lg:text-left space-y-6">
            {/* Eyebrow - premium pill with trust */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-[13px] font-semibold text-foreground">Serving Kolkata, Durgapur & Asansol</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground border-l border-border pl-2.5 ml-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9/5 · 50+ clients
              </span>
            </div>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.05] tracking-tight text-foreground">
              Get More Customers{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Without the Confusion</span>
                <div className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 -rotate-1 rounded-sm" />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              We build your website, run your ads, and manage your social media.
              You focus on your business. Starting at just{' '}
              <span className="text-foreground font-bold bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/10">Rs 6,999/month</span>
            </p>

            {/* Benefits - premium check list with subtle bg */}
            <div className="space-y-2.5 max-w-md mx-auto lg:mx-0 p-3.5 rounded-2xl bg-card border border-border/60 shadow-sm">
              {[
                "Website + Ads + Social Media — all included",
                "No contracts. Cancel anytime.",
                "We can meet you in person — we're local",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm sm:text-[14px] text-foreground">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <button onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap group">
                <Sparkles className="w-4 h-4 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                Free Consultation
                <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a href="https://wa.me/919832078313" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" onClick={() => trackContact('whatsapp_hero')}>
                <button className="w-full px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap">
                  WhatsApp Us
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </a>
              <a href="tel:+918918349445" className="w-full sm:w-auto hidden lg:block" onClick={() => trackContact('phone_hero')}>
                <button className="w-full px-6 py-3.5 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] shadow-sm hover:shadow whitespace-nowrap">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +91 8918349445
                </button>
              </a>
            </div>

            {/* Avatar stack + trust */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex -space-x-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm" style={{ background: `hsl(${217 + i*15} 20% 92%)` }}>
                    {['R','A','S'][i]}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">+47</div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                  <span className="text-xs font-bold text-foreground ml-1">4.9/5</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Trusted by 50+ local businesses</p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 space-y-3">
            <div
              className="relative rounded-[20px] overflow-hidden shadow-2xl border border-border bg-black cursor-pointer group"
              onClick={handleVideoClick}
            >
              {/* Floating badges */}
              <div className="absolute top-3 left-3 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur border border-border shadow-lg text-xs font-semibold text-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live in 15 days
              </div>
              <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground shadow-lg text-xs font-bold">
                <Zap className="w-3.5 h-3.5" /> Rs 6,999/mo
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
                <div
                  className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer z-30 transition-all"
                  onClick={handleReplay}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-transform mb-2">
                    <RotateCcw className="w-8 h-8" />
                  </div>
                  <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">Replay Video</p>
                </div>
              )}

              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 border border-white/10 z-20"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {media.gallery.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-border shadow-sm group/gallery hover:shadow-md transition-shadow">
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover/gallery:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-white text-[9px] sm:text-[10px] font-semibold drop-shadow">{img.label}</span>
                </div>
              ))}
            </div>

            {/* Micro stats bar under video */}
            <div className="hidden sm:grid grid-cols-3 gap-2">
              {[
                { stat: "50+", label: "Businesses grown" },
                { stat: "3×", label: "Avg. lead growth" },
                { stat: "15 Days", label: "To go live" },
              ].map((item, i) => (
                <div key={i} className="text-center p-2.5 rounded-xl bg-card border border-border shadow-sm">
                  <div className="text-sm font-extrabold text-foreground">{item.stat}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </div>
  );
};

export default Hero;
