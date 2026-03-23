"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const MUSIC_SRC = "/audio/background-music.wav";
const TARGET_VOLUME = 0.18;
const FADE_MS = 420;

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  const clearFadeFrame = () => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const stopAudioCompletely = () => {
    clearFadeFrame();
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 0;
    setIsPlaying(false);
  };

  const fadeVolume = (from: number, to: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeFrame();
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / FADE_MS);
      audio.volume = from + (to - from) * t;

      if (t < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        fadeFrameRef.current = null;
        done?.();
      }
    };

    fadeFrameRef.current = window.requestAnimationFrame(tick);
  };

  const handleToggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        audio.volume = 0;
        await audio.play();
        setIsPlaying(true);
        fadeVolume(0, TARGET_VOLUME);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    const currentVolume = audio.volume;
    fadeVolume(currentVolume, 0, () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    });
  };

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const autoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        fadeVolume(0, TARGET_VOLUME);
      } catch {
        setIsPlaying(false);
      }
    };

    autoplay();

    return () => {
      stopAudioCompletely();
      if (audioRef.current) audioRef.current.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Do not keep music playing across route changes.
    stopAudioCompletely();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handlePageLeave = () => {
      stopAudioCompletely();
    };

    window.addEventListener("pagehide", handlePageLeave);
    window.addEventListener("beforeunload", handlePageLeave);

    return () => {
      window.removeEventListener("pagehide", handlePageLeave);
      window.removeEventListener("beforeunload", handlePageLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9998 2C7.02983 2 2.99983 6.03 2.99983 11C2.99983 15.97 7.02983 20 11.9998 20C12.5498 20 12.9998 20.45 12.9998 21V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.9998 11C20.9998 6.03 16.9698 2 11.9998 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.9998 20C16.9698 20 20.9998 15.97 20.9998 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 4"/>
          </svg>
          <span className="text-white font-black tracking-widest text-lg uppercase">Greenleaf</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-white/70 uppercase">
          <a href="#shop" className="hover:text-white transition-colors">Shop</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#locations" className="hover:text-white transition-colors">Locations</a>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            whileTap={{ scale: 0.94 }}
            animate={{
              boxShadow: isPlaying
                ? "0 0 0px rgba(0,229,255,0), 0 0 24px rgba(0,229,255,0.32)"
                : "0 0 0px rgba(0,229,255,0), 0 0 12px rgba(0,229,255,0.12)",
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="group relative overflow-hidden w-11 h-11 rounded-full border border-[#00E5FF]/45 bg-black/60 backdrop-blur-md text-[#A5F6FF] flex items-center justify-center hover:scale-105"
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle, rgba(0,229,255,0.18) 0%, rgba(0,229,255,0.02) 62%, rgba(0,229,255,0) 100%)",
              }}
            />

            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
              animate={{ rotate: isPlaying ? [0, 2, -2, 0] : 0 }}
              transition={{ duration: 1.6, repeat: isPlaying ? Infinity : 0 }}
            >
              <path
                d="M10 9.5V17.5C10 19.2 8.7 20.5 7 20.5C5.3 20.5 4 19.2 4 17.5C4 15.8 5.3 14.5 7 14.5C7.55 14.5 8.07 14.64 8.5 14.88V6L18 4V14C18 15.66 16.66 17 15 17C13.34 17 12 15.66 12 14C12 12.34 13.34 11 15 11C15.55 11 16.07 11.14 16.5 11.38V6.3L10 7.9V9.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M19.5 8.5C20.8 9.9 20.8 12.1 19.5 13.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                animate={{ opacity: isPlaying ? [0.2, 1, 0.2] : 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M21.5 6.5C24 9.1 24 12.9 21.5 15.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                animate={{ opacity: isPlaying ? [0.1, 0.8, 0.1] : 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          </motion.button>

          <a href="#shop" className="px-6 py-2.5 bg-white text-[#050505] font-black tracking-[0.15em] uppercase text-xs rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-white/5">
            Buy Now
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
