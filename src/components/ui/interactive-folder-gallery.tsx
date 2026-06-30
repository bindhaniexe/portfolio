"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface GalleryPhoto {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  tech?: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
  { id: 2, image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop" },
  { id: 3, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop" },
  { id: 4, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop" },
  { id: 5, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop" },
];

export interface InteractiveFolderGalleryProps {
  photos?: GalleryPhoto[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

export function InteractiveFolderGallery({
  photos = defaultPhotos,
  folderName = "Engineering.projects",
  dragHintText = "Drag any card down to close",
  className,
}: InteractiveFolderGalleryProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);

  return (
    <div className={`w-full py-32 relative select-none ${className || ""}`}>
      <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center">
        <div className="relative w-[400px] h-[500px] flex justify-center pointer-events-none z-0">
          {/* Closed folder back */}
          <motion.div
            className="absolute bottom-6 w-80 h-56 drop-shadow-2xl"
            animate={{ opacity: isFolderOpen ? 0 : 1, scale: isFolderOpen ? 0.9 : 1 }}
          >
            <div className="absolute top-0 left-0 w-32 h-10 bg-gradient-to-t from-[#1e1e1e] to-[#2a2a2a] rounded-t-xl border-t border-l border-r border-white/10" />
            <div className="absolute top-8 left-0 right-0 bottom-0 bg-gradient-to-b from-[#1e1e1e] to-[#0a0a0a] rounded-b-xl rounded-tr-xl border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
            <div className="absolute top-10 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner pointer-events-none" />
          </motion.div>

          {/* Project cards stack */}
          <div className="absolute bottom-10 z-10 flex justify-center">
            {photos.map((photo, i) => {
              const offset = i - Math.floor(photos.length / 2);
              const stackY = hoverFolder ? offset * -10 - 40 : offset * -5;
              const stackX = hoverFolder ? offset * 30 : offset * 3;
              const stackRotate = hoverFolder ? offset * 8 : offset * 3;
              const stackScale = 1 - Math.abs(offset) * 0.03;

              const openY = -130;
              const openX = offset * 140;
              const openRotate = 0;
              const openScale = 1.05;

              const hasProjectData = photo.title && photo.tech;

              return (
                <motion.div
                  key={photo.id}
                  drag={isFolderOpen ? true : false}
                  dragSnapToOrigin={true}
                  onDragEnd={(_e, info) => {
                    if (info.offset.y > 100 && isFolderOpen) {
                      setIsFolderOpen(false);
                      setHoverFolder(false);
                    }
                  }}
                  className={`absolute bottom-0 w-56 h-72 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 origin-bottom select-none ${
                    isFolderOpen
                      ? "cursor-grab active:cursor-grabbing pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                  animate={
                    !isFolderOpen
                      ? { y: stackY, x: stackX, rotate: stackRotate, scale: stackScale, zIndex: i + 10 }
                      : { y: openY, x: openX, rotate: openRotate, scale: openScale, zIndex: 50 }
                  }
                  whileHover={isFolderOpen ? { scale: openScale + 0.05, zIndex: 100 } : {}}
                  whileDrag={isFolderOpen ? { scale: openScale + 0.1, rotate: 5, zIndex: 150 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  {/* Cover image */}
                  <img
                    src={photo.image}
                    alt={photo.title || "Project"}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Project overlay — title + tech pills only, no links */}
                  {hasProjectData && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-4 pointer-events-none select-none">
                      <p className="text-white text-xs font-bold leading-tight mb-2 line-clamp-2">
                        {photo.title}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tech?.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Folder front / clickable lid */}
          <motion.div
            className="absolute bottom-0 w-[340px] h-44 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.8)] cursor-pointer z-20 pointer-events-auto"
            style={{ transformOrigin: "bottom" }}
            animate={{
              opacity: isFolderOpen ? 0 : 1,
              rotateX: hoverFolder ? -25 : 0,
              y: hoverFolder ? 10 : 0,
              pointerEvents: isFolderOpen ? "none" : "auto",
            }}
            onMouseEnter={() => setHoverFolder(true)}
            onMouseLeave={() => setHoverFolder(false)}
            onClick={() => setIsFolderOpen(true)}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#2a2a2a] to-[#111] rounded-2xl border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative overflow-hidden flex items-end justify-center pb-8">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="px-5 py-2.5 bg-black rounded-lg border border-black/80 shadow-inner flex items-center justify-center backdrop-blur-md">
                <span className="text-white/90 text-sm font-medium tracking-wide">{folderName}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Drag hint */}
        <motion.div
          animate={{ opacity: isFolderOpen ? 1 : 0, y: isFolderOpen ? 0 : 50 }}
          className="absolute bottom-10 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 text-sm font-medium uppercase tracking-widest pointer-events-none"
        >
          {dragHintText}
        </motion.div>
      </div>
    </div>
  );
}

export { InteractiveFolderGallery as Component };
