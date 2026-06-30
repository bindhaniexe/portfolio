"use client";

import { motion, LayoutGroup } from "motion/react";
import { TextRotate } from "./ui/text-rotate";
import LiquidEther from "./ui/LiquidEther";

const rotatingKeywords = [
  "intelligent",
  "scalable",
  "full-stack",
  "AI-powered",
  "impactful",
  "reliable",
  "performant",
  "well-crafted",
  "user-friendly",
  "problem-solving",
  "clean",
  "modern",
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* LiquidEther WebGL background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={["#1a1f6e", "#4a6fe0", "#7b9ef5"]}
          mouseForce={25}
          cursorSize={120}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.0}
          autoResumeDelay={2000}
          autoRampDuration={0.8}
          takeoverDuration={0.3}
          isViscous={false}
          iterationsPoisson={24}
          iterationsViscous={24}
        />
      </div>

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-[260px] sm:w-[340px] md:w-[520px] lg:w-[720px] pointer-events-auto px-4 text-center">

        {/* Eyebrow */}
        <motion.p
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 sm:text-base"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          CS Student &amp; Aspiring Engineer
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
          Computer Science student passionate about building scalable applications,
          AI-powered tools, and impactful digital products — turning ideas into
          reliable, performant solutions.
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
