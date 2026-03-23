"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

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
          {/* Simple Leaf Icon using SVG */}
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

        <div>
          <a href="#shop" className="px-6 py-2.5 bg-white text-[#050505] font-black tracking-[0.15em] uppercase text-xs rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-white/5">
            Buy Now
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
