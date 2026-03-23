"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function CursorFX() {
  const isEnabledRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  const trailCount = 7;
  const trailSizes = useMemo(() => [9, 7, 6, 5, 4, 3, 2], []);
  const trailFalloff = useMemo(() => [0.18, 0.22, 0.28, 0.34, 0.42, 0.52, 0.62], []);

  const target = useRef<Point>({ x: 0, y: 0 });
  const current = useRef<Point>({ x: 0, y: 0 });
  const trailPoints = useRef<Point[]>(
    Array.from({ length: trailCount }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const hoverCapable = window.matchMedia("(hover: hover)");
    const notSmallScreen = !window.matchMedia("(max-width: 768px)").matches;
    isEnabledRef.current = finePointer.matches && hoverCapable.matches && notSmallScreen;
    if (!isEnabledRef.current) return;

    document.body.classList.add("cursor-fx-hidden");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const getInteractive = (el: Element | null) => {
      if (!el) return null;
      const interactive = el.closest("a,button,input,textarea,select,[role='button']");
      return interactive;
    };

    const onOver = (e: PointerEvent) => {
      setHoveringInteractive(Boolean(getInteractive(e.target as Element | null)));
    };
    const onOut = () => {
      // If leaving interactive element, revert when related target isn't interactive.
      // For simplicity, set false on any pointerout; this still feels good visually.
      setHoveringInteractive(false);
    };

    const onDown = (e: PointerEvent) => {
      if (!isEnabledRef.current) return;

      const ripple = document.createElement("span");
      ripple.className = "cursor-fx-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      window.setTimeout(() => {
        ripple.remove();
      }, 700);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const tick = () => {
      rafRef.current = window.requestAnimationFrame(tick);

      const tx = target.current.x;
      const ty = target.current.y;

      // Smooth-follow
      current.current.x += (tx - current.current.x) * 0.22;
      current.current.y += (ty - current.current.y) * 0.22;

      // Keep inside viewport a bit so translate doesn't go wild on edges.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      current.current.x = clamp(current.current.x, 0, vw);
      current.current.y = clamp(current.current.y, 0, vh);

      // Update trail points
      for (let i = 0; i < trailCount; i++) {
        const prev = i === 0 ? current.current : trailPoints.current[i - 1];
        const alpha = trailFalloff[i] ?? 0.3;
        trailPoints.current[i] = {
          x: trailPoints.current[i].x + (prev.x - trailPoints.current[i].x) * alpha,
          y: trailPoints.current[i].y + (prev.y - trailPoints.current[i].y) * alpha,
        };

        const el = trailRefs.current[i];
        if (!el) continue;
        el.style.transform = `translate3d(${trailPoints.current[i].x}px, ${trailPoints.current[i].y}px, 0) translate(-50%, -50%)`;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        const scale = hoveringInteractive ? 1.7 : 1.0;
        ringRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
    };

    tick();

    return () => {
      document.body.classList.remove("cursor-fx-hidden");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);

      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Trail */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-fx-trail"
          style={{
            width: `calc(${trailSizes[i] ?? 6}px * var(--cursor-scale, 1))`,
            height: `calc(${trailSizes[i] ?? 6}px * var(--cursor-scale, 1))`,
            opacity: 0.9 - i * 0.08,
          }}
        />
      ))}

      {/* Dot */}
      <div ref={cursorRef} className="cursor-fx-dot" />
      {/* Ring */}
      <div ref={ringRef} className="cursor-fx-ring" />
    </>
  );
}

