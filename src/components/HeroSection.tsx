"use client";

import { motion, LayoutGroup } from "motion/react";
import { TextRotate } from "./ui/text-rotate";
import Floating, { FloatingElement } from "./ui/parallax-floating";

/**
 * Portfolio images — software engineering aesthetics
 * sourced from Unsplash (known-stable URLs).
 */
const portfolioImages = [
  {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    alt: "Code on a dark terminal screen",
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    alt: "Developer working on laptop with code",
  },
  {
    url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2070&auto=format&fit=crop",
    alt: "Lines of code on a monitor",
  },
  {
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop",
    alt: "Java code on a screen",
  },
  {
    url: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=2070&auto=format&fit=crop",
    alt: "Developer workspace with multiple screens",
  },
];

/**
 * Rotating keywords reflecting a full-stack software engineering profile.
 */
const rotatingKeywords = [
  "scalable 🚀",
  "full-stack 💻",
  "secure 🔒",
  "fast ⚡",
  "tested ✅",
  "clean 🧹",
  "reliable 🛡️",
  "well-crafted 🛠️",
  "type-safe 📐",
  "cloud-ready ☁️",
  "open source 🌍",
  "modern 🔥",
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Parallax floating images */}
      <Floating sensitivity={-0.5} className="h-full">
        {/* Top-left — small */}
        <FloatingElement
          depth={0.5}
          className="top-[15%] left-[2%] md:top-[22%] md:left-[4%]"
        >
          <motion.img
            src={portfolioImages[0].url}
            alt={portfolioImages[0].alt}
            className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 object-cover rounded-xl shadow-2xl -rotate-[3deg] hover:scale-105 transition-transform duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        {/* Top-left — large */}
        <FloatingElement
          depth={1}
          className="top-[0%] left-[7%] md:top-[5%] md:left-[10%]"
        >
          <motion.img
            src={portfolioImages[1].url}
            alt={portfolioImages[1].alt}
            className="w-40 h-28 sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-60 lg:h-48 object-cover rounded-xl shadow-2xl -rotate-12 hover:scale-105 transition-transform duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
        </FloatingElement>

        {/* Bottom-left */}
        <FloatingElement
          depth={4}
          className="top-[82%] left-[5%] md:top-[72%] md:left-[7%]"
        >
          <motion.img
            src={portfolioImages[2].url}
            alt={portfolioImages[2].alt}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 object-cover rounded-xl shadow-2xl -rotate-[4deg] hover:scale-105 transition-transform duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </FloatingElement>

        {/* Top-right */}
        <FloatingElement
          depth={2}
          className="top-[2%] left-[86%] md:top-[3%] md:left-[82%]"
        >
          <motion.img
            src={portfolioImages[3].url}
            alt={portfolioImages[3].alt}
            className="w-40 h-36 sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-64 lg:h-56 object-cover rounded-xl shadow-2xl rotate-[6deg] hover:scale-105 transition-transform duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
        </FloatingElement>

        {/* Bottom-right */}
        <FloatingElement
          depth={1}
          className="top-[74%] left-[82%] md:top-[65%] md:left-[82%]"
        >
          <motion.img
            src={portfolioImages[4].url}
            alt={portfolioImages[4].alt}
            className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover rounded-xl shadow-2xl rotate-[12deg] hover:scale-105 transition-transform duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
        </FloatingElement>
      </Floating>

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-[260px] sm:w-[340px] md:w-[520px] lg:w-[720px] pointer-events-auto px-4 text-center">
        {/* Eyebrow */}
        <motion.p
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 sm:text-base"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          Designing &amp; Engineering
        </motion.p>

        {/* Headline with rotating keyword */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-neutral-50 w-full flex flex-col items-center space-y-1 md:space-y-3"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span>I build software that is</span>

          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre justify-center">
              <TextRotate
                texts={rotatingKeywords}
                mainClassName="overflow-hidden pr-2 text-accent py-0 pb-1 md:pb-3 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={2800}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>

        {/* Sub-description */}
        <motion.p
          className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed max-w-xl"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Full-Stack Software Engineer — building robust, scalable systems
          from API design to polished user interfaces.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 md:mt-10 flex flex-row gap-4 items-center justify-center"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
        >
          <motion.a
            href="#projects"
            className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-neutral-50 bg-accent px-5 py-2.5 md:px-7 md:py-3 rounded-full shadow-2xl z-20 inline-flex items-center"
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            View Projects
          </motion.a>

          <motion.a
            href="#skills"
            className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-accent border border-accent px-5 py-2.5 md:px-7 md:py-3 rounded-full shadow-2xl z-20 inline-flex items-center hover:bg-accent hover:text-neutral-50 transition-colors duration-200"
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            Tech Stack
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
