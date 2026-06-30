export interface GalleryImage {
  src: string; // placeholder high-resolution image URL
  alt: string; // descriptive alt text for accessibility
}

export const galleryImages: GalleryImage[] = [
  {
    src: "https://picsum.photos/seed/arch-living-room/1200/1600",
    alt: "Photorealistic 3D interior render of a sunlit modern living room with floor-to-ceiling windows and minimalist furniture.",
  },
  {
    src: "https://picsum.photos/seed/arch-villa-exterior/1600/1100",
    alt: "Exterior 3D visualization of a contemporary two-story villa with a reflecting pool and landscaped garden at dusk.",
  },
  {
    src: "https://picsum.photos/seed/arch-kitchen/1200/1500",
    alt: "Detailed 3D render of a sleek open-plan kitchen featuring an island, pendant lighting, and natural wood cabinetry.",
  },
  {
    src: "https://picsum.photos/seed/arch-highrise/1100/1700",
    alt: "Architectural 3D render of a glass-clad high-rise tower set against a clear blue sky in an urban skyline.",
  },
  {
    src: "https://picsum.photos/seed/arch-bedroom/1500/1100",
    alt: "Cozy 3D interior visualization of a master bedroom with warm ambient lighting, textured walls, and a city view.",
  },
  {
    src: "https://picsum.photos/seed/arch-courtyard/1300/1500",
    alt: "Exterior 3D render of a residential courtyard with stone paving, lush greenery, and a covered seating area.",
  },
];
