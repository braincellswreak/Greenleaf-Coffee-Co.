"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useSpring, useTransform, motion } from "framer-motion";

export function CoffeeReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [renderTick, setRenderTick] = useState(0);
  const totalFrames = 120;
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const aspectRatioRef = useRef<number[]>([]);

  const reducedMotion = useReducedMotion();

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const smoothProgress = reducedMotion ? scrollYProgress : springProgress;

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    imagesRef.current = new Array(totalFrames).fill(null);
    aspectRatioRef.current = new Array(totalFrames).fill(0);

    // We expect the image sequence at /sequence/frame_X.webp
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.webp`;

      img.onload = () => {
        loadedCount++;
        imagesRef.current[i] = img;
        aspectRatioRef.current[i] = img.width / img.height;

        if (i === 0) {
          setLoading(false);
          setRenderTick((t) => t + 1); // Force a redraw when the first frame is ready.
        }
        if (loadedCount === totalFrames) setLoading(false);
      };

      // Handle error gracefully if image doesn't exist
      img.onerror = () => {
        loadedCount++;
        imagesRef.current[i] = null;
        aspectRatioRef.current[i] = 0;

        if (i === 0) {
          setLoading(false);
          setRenderTick((t) => t + 1); // Force a redraw when the first frame errored.
        }
        if (loadedCount === totalFrames) setLoading(false);
      };
    }
  }, [totalFrames]);

  // Rendering logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for non-transparent backgrounds
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;

    let rafId: number | null = null;
    let lastProgress = 0;

    const render = (progress: number) => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(progress * totalFrames))
      );

      const img = imagesRef.current[frameIndex];
      const imgAspect = aspectRatioRef.current[frameIndex] || 0;

      // Always clear the canvas (prevents stale frame when frames aren't loaded yet).
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, cssW, cssH);

      // If the frame isn't ready, keep the black background.
      if (!img || img.naturalWidth === 0 || imgAspect <= 0) return;

      const containerRatio = cssW / cssH;

      let drawWidth = cssW;
      let drawHeight = cssH;

      if (containerRatio > imgAspect) {
        drawWidth = cssH * imgAspect;
        drawHeight = cssH;
      } else {
        drawWidth = cssW;
        drawHeight = cssW / imgAspect;
      }

      const offsetX = (cssW - drawWidth) / 2;
      const offsetY = (cssH - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Sub to scroll (throttled via requestAnimationFrame).
    const unsubscribe = smoothProgress.on("change", (latest) => {
      lastProgress = latest;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          render(lastProgress);
        });
      }
    });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);

      // Keep CSS size aligned with viewport, regardless of DPR.
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      // Draw in CSS pixel coordinates, while using a higher DPR-backed bitmap.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      render(smoothProgress.get());
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resizeCanvas);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [smoothProgress, totalFrames, renderTick]);

  // Scrollytelling Beats Opacities
  const opacityA = useTransform(smoothProgress, [0, 0.1, 0.15, 0.2], [1, 1, 1, 0]);
  const yA = useTransform(smoothProgress, [0, 0.1, 0.2], [0, 0, -20]);

  const opacityB = useTransform(smoothProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const yB = useTransform(smoothProgress, [0.2, 0.25, 0.45], [20, 0, -20]);

  const opacityC = useTransform(smoothProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const yC = useTransform(smoothProgress, [0.45, 0.5, 0.7], [20, 0, -20]);

  const opacityD = useTransform(smoothProgress, [0.7, 0.75, 0.9, 0.95], [0, 1, 1, 0]);
  const yD = useTransform(smoothProgress, [0.7, 0.75, 0.95], [20, 0, -20]);
  
  // Fade out scroll indicator
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  const handleFindCafe = () => {
    const el = document.getElementById("locations");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={containerRef} className="h-[400vh] relative bg-[#050505] w-full">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mb-6 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white/80"
                initial={{ width: reducedMotion ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 1.5, ease: "easeInOut", repeat: Infinity }
                }
              />
            </div>
            <p className="text-white/50 tracking-[0.3em] text-xs uppercase font-light">
              Brewing Experience...
            </p>
          </div>
        )}

        {/* The Canvas Sequence */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Beats Container */}
        <div className="absolute inset-0 z-10 p-6 md:p-24 pointer-events-none flex flex-col justify-center">
          
          <motion.div 
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-[pulse_2s_ease-in-out_Infinity]" />
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to Explore</p>
          </motion.div>

          {/* Beat A */}
          <motion.div 
            style={{ opacity: opacityA, y: yA }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white/90 mb-4 drop-shadow-2xl">
              GREENLEAF
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium max-w-lg tracking-tight">
              The CEO Matcha. Redefined.
            </p>
          </motion.div>

          {/* Beat B */}
          <motion.div 
            style={{ opacity: opacityB, y: yB }}
            className="absolute inset-0 flex flex-col justify-center items-start text-left max-w-2xl px-6 md:px-24"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white/90 mb-4 drop-shadow-lg">
              EXPLODED FLAVOR
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-medium tracking-tight">
              Ceremonial grade matcha meets hand-crafted espresso.
            </p>
          </motion.div>

          {/* Beat C */}
          <motion.div 
            style={{ opacity: opacityC, y: yC }}
            className="absolute inset-0 flex flex-col justify-center items-end text-right px-6 md:px-24"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white/90 mb-4 drop-shadow-lg">
                PRECISION LAYERS
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-medium tracking-tight">
                Every ingredient suspended in perfect motion.
              </p>
            </div>
          </motion.div>

          {/* Beat D */}
          <motion.div 
            style={{ opacity: opacityD, y: yD }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white/90 mb-10 drop-shadow-2xl">
              TASTE THE ENERGY
            </h2>
            <button
              type="button"
              onClick={handleFindCafe}
              className="px-10 py-5 bg-white text-[#050505] font-black tracking-[0.2em] uppercase text-xs rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10"
            >
              Find a Cafe
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
