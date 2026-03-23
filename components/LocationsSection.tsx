"use client";

import { motion } from "framer-motion";

const locations = [
  { city: "Los Angeles", address: "2120 Sunset Blvd, CA" },
  { city: "New York", address: "44 W 8th St, NY" },
  { city: "Austin", address: "900 E 6th St, TX" },
];

export function LocationsSection() {
  return (
    <section id="locations" className="py-24 md:py-32 bg-[#050505] relative z-20 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <span className="text-white/40 tracking-[0.3em] uppercase text-xs font-semibold mb-4">Locations</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white/90 tracking-tighter max-w-2xl">
            FIND A CAFE NEAR YOU.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {locations.map((loc, idx) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="text-white/80 text-sm uppercase tracking-[0.25em] font-semibold mb-4">
                {loc.city}
              </div>
              <p className="text-white/60 font-light leading-relaxed">{loc.address}</p>

              <button
                type="button"
                className="mt-8 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#050505] font-black tracking-[0.15em] uppercase text-xs hover:opacity-90 transition-opacity shadow-xl shadow-white/10"
              >
                Get Directions
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

