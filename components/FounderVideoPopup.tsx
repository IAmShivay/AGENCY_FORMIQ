"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { trackContact } from "@/lib/meta-pixel";
import LeadFormOverlay from "./LeadFormOverlay";
import {
  getFounderPopupContent,
  DEFAULT_FOUNDER_POPUP,
  type FounderPopupContent,
} from "@/lib/siteContent";

const STORAGE_KEY = "founder_video_seen";

interface FounderVideoPopupProps {
  videoUrl?: string;
  thumbnail?: string;
  founderName?: string;
  founderRole?: string;
  formUrl?: string;
  whatsappNumber?: string;
  forceOpen?: boolean;
}

export default function FounderVideoPopup({
  videoUrl: propVideoUrl,
  thumbnail: propThumbnail,
  founderName: propName,
  founderRole: propRole,
  formUrl: propFormUrl,
  whatsappNumber: propWhatsappNumber,
  forceOpen = false,
}: FounderVideoPopupProps) {
  const [content, setContent] = useState<FounderPopupContent>(DEFAULT_FOUNDER_POPUP);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getFounderPopupContent().then(setContent);
  }, []);

  useEffect(() => {
    setMounted(true);

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("reset_founder") === "1") {
      localStorage.removeItem(STORAGE_KEY);
    }
    if (params.get("preview_founder") === "true" || params.get("founder_video") === "1") {
      setIsOpen(true);
      return;
    }

    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, (content.delay_seconds || 1.2) * 1000);
      return () => clearTimeout(timer);
    }
  }, [forceOpen, content.delay_seconds]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;
      if (videoRef.current && (videoRef.current.muted || isMuted)) {
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, [isMuted]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsEnded(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMuted(false);
            })
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => {});
              }
            });
        }
      }
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

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
      const nextMuted = !(isMuted || videoRef.current.muted);
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
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
      if (isMuted || videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
        if (videoRef.current.currentTime < 3) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play().catch(() => {});
        return;
      }
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleOpenForm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUrl = propFormUrl !== undefined ? propFormUrl : content.form_url;
    if (targetUrl && targetUrl.trim().length > 0) {
      window.open(targetUrl, "_blank");
    } else {
      setShowLeadForm(true);
    }
  };

  const video =
    propVideoUrl ||
    content.video_url ||
    "https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.mp4";
  const thumb =
    propThumbnail ||
    content.video_thumbnail ||
    "https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.jpg";
  const name = propName || content.founder_name || "Shivay Sharma";
  const role = propRole || content.founder_role || "Founder & CEO";
  const phone = propWhatsappNumber || content.whatsapp_number || "919832078313";
  const whatsappMsg = content.whatsapp_message || "Hi Shivay, I saw your founder video and want to discuss my project!";

  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMsg)}`;

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={handleClose}
            />

            <motion.div
              className="relative w-full max-w-[420px] sm:max-w-[450px] md:max-w-[480px] aspect-[9/16] max-h-[90vh] rounded-3xl overflow-hidden bg-black border-2 border-white/15 shadow-2xl shadow-primary/20 flex flex-col justify-between"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handleVideoClick}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={thumb}
                  autoPlay
                  playsInline
                  onEnded={handleVideoEnded}
                >
                  <source src={video} type="video/mp4" />
                </video>
              </div>

              {isMuted && !isEnded && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <div className="px-4 py-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center gap-2.5 shadow-2xl animate-pulse">
                    <VolumeX className="w-5 h-5 text-primary" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      Tap anywhere for sound
                    </span>
                  </div>
                </div>
              )}

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

              <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
                  <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center font-bold text-xs text-primary">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{name}</h4>
                    <p className="text-[10px] text-white/70">{role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 border border-white/10"
                    aria-label="Toggle Sound"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-primary animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 border border-white/10"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative z-30 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-12 space-y-3 pointer-events-auto">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    className="flex-1 py-3 px-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/30 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>{content.form_button_text || "Free Consultation"}</span>
                  </button>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContact("whatsapp_founder_popup")}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full py-3 px-3.5 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#25D366]/30 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>{content.whatsapp_button_text || "WhatsApp"}</span>
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LeadFormOverlay
        open={showLeadForm}
        onClose={() => setShowLeadForm(false)}
      />
    </>
  );
}
