"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Phone, Sparkles, Volume2, VolumeX, RotateCcw } from "lucide-react";
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

  const handleVideoEnded = () => {
    setIsEnded(true);
  };

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
      if (videoRef.current.paused && !isEnded) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleVideoClick = () => {
    if (isEnded) {
      handleReplay();
      return;
    }
    if (videoRef.current) {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-primary">Serving Kolkata, Durgapur & Asansol</span>
            </div>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
              Get More Customers{' '}
              <span className="text-primary relative">
                Without the Confusion
                <svg className="absolute -bottom-1 left-0 w-full hidden sm:block" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              We build your website, run your ads, and manage your social media.
              You focus on your business. Starting at just{' '}
              <span className="text-foreground font-bold bg-primary/10 px-2 py-0.5 rounded">Rs 6,999/month</span>
            </p>

            <div className="space-y-2.5 max-w-md mx-auto lg:mx-0">
              {[
                "Website + Ads + Social Media - all included",
                "No contracts. Cancel anytime.",
                "We can meet you in person - we're local",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-foreground">
                  <CheckCircle className="w-[18px] h-[18px] text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <button onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] shadow-lg shadow-primary/20 whitespace-nowrap">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                Free Consultation
              </button>
              <a href="https://wa.me/15553419743" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" onClick={() => trackContact('whatsapp_hero')}>
                <button className="w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] shadow-lg shadow-[#25D366]/20 whitespace-nowrap">
                  WhatsApp Us
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </a>
              <a href="tel:+918918349445" className="w-full sm:w-auto hidden lg:block" onClick={() => trackContact('phone_hero')}>
                <button className="w-full px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-[15px] whitespace-nowrap">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +91 8918349445
                </button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0 pt-2">
              {[
                { stat: "50+", label: "Businesses" },
                { stat: "3x", label: "Lead Growth" },
                { stat: "15 Days", label: "Delivery" },
              ].map((item, i) => (
                <div key={i} className="text-center p-2.5 rounded-xl bg-card border border-border">
                  <div className="text-lg sm:text-xl font-bold text-primary">{item.stat}</div>
                  <div className="text-[10px] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30 ring-4 ring-primary/10 aspect-video bg-black cursor-pointer group"
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={
                  media.video_thumbnail && !media.video_thumbnail.includes("pexels")
                    ? media.video_thumbnail
                    : "https://res.cloudinary.com/dzwekdoeo/video/upload/v1792316284/MINE_ounxke.jpg"
                }
                autoPlay
                playsInline
                onEnded={handleVideoEnded}
              >
                <source
                  src={
                    media.video_url && !media.video_url.includes("pexels")
                      ? media.video_url
                      : "https://res.cloudinary.com/dzwekdoeo/video/upload/v1792316284/MINE_ounxke.mp4"
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
                  <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                    Replay Video
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 border border-white/10 z-20"
                aria-label="Toggle Sound"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4 text-green-400" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {media.gallery.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-white text-[9px] sm:text-[10px] font-medium">{img.label}</span>
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
