"use client";

import { motion } from "framer-motion";

export function QualitySection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#050505] relative z-20 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Left Side text */}
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white/40 tracking-[0.3em] uppercase text-xs font-semibold block mb-4">
              Uncompromising Quality
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white/90 tracking-tighter leading-[1.1]">
              NOT ALL MATCHA <br className="hidden md:block" /> 
              IS CREATED EQUAL.
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-white/60 font-light leading-relaxed max-w-lg"
          >
            Most commercial matcha is dull green, bitter, and culinarily graded. 
            <strong>Greenleaf is different.</strong> We partner directly with a 3rd-generation farm in Uji, Japan, 
            shadowing the tea leaves for 20 days before harvest to maximize chlorophyll and L-theanine.
          </motion.p>

          <motion.ul 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 text-white/70 font-medium"
          >
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              100% First-Harvest Leaves
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Stone Milled to order in small batches
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Zero sugar or preservatives
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4"
          >
            <button className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm hover:opacity-70 transition-opacity">
              Read Our Story 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Right side abstract graphic / visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full aspect-square md:aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.05] p-2 relative overflow-hidden flex items-center justify-center"
        >
          {/* Abstract aesthetic element (since we don't have images) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 flex items-center justify-center">
               <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#050505]">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                 </svg>
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
