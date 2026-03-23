"use client";

import { motion } from "framer-motion";

const shopItems = [
  {
    title: "Ceremonial Matcha Tin",
    description: "Uji shade-grown matcha for a smooth, vibrant daily ritual.",
    price: "$28",
  },
  {
    title: "Starter Set",
    description: "Everything you need to brew café-quality matcha at home.",
    price: "$49",
  },
  {
    title: "Whisk & Tools",
    description: "Hand-selected essentials for the perfect froth and whisk.",
    price: "$39",
  },
];

export function ShopSection() {
  return (
    <section id="shop" className="py-24 bg-[#050505] relative z-20 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <span className="text-white/40 tracking-[0.3em] uppercase text-xs font-semibold mb-4">Shop</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white/90 tracking-tighter max-w-2xl">
            CURATED FOR YOUR RITUAL.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {shopItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="mb-4 text-white/90 font-bold text-xl tracking-tight">{item.title}</div>
              <p className="text-white/50 leading-relaxed font-light">{item.description}</p>
              <div className="mt-6 flex items-center justify-between gap-6">
                <span className="text-white/70 font-semibold tracking-wide">{item.price}</span>
                <button
                  type="button"
                  disabled
                  className="opacity-60 cursor-not-allowed px-5 py-2 rounded-full bg-white text-[#050505] font-black tracking-[0.15em] uppercase text-xs"
                >
                  Coming Soon
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

