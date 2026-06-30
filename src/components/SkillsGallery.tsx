"use client";

import CircularGallery from "./ui/CircularGallery";
import { allSkillsAsGalleryItems } from "../data/skills";

/**
 * SkillsGallery — React island that renders the tech-stack skills
 * as a CircularGallery (OGL / WebGL) carousel.
 *
 * Logo images are fetched from the devicon CDN and labelled with the
 * technology name. The gallery loops infinitely and supports mouse drag,
 * touch swipe, scroll-wheel, and keyboard arrow-key navigation.
 */
export default function SkillsGallery() {
  return (
    <div style={{ height: "500px", position: "relative" }}>
      <CircularGallery
        items={allSkillsAsGalleryItems}
        bend={2}
        textColor="#ffffff"
        borderRadius={0.08}
        scrollSpeed={2}
        scrollEase={0.04}
        font="bold 22px Figtree"
        fontUrl="https://fonts.googleapis.com/css2?family=Figtree:wght@700&display=swap"
      />
    </div>
  );
}
