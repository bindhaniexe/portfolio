export interface Project {
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  demoUrl: string;
}

export const projects: Project[] = [
  {
    title: "Aurora — AI-Powered Health Tracking Mobile App",
    description:
      "AI-powered mobile app delivering intelligent, personalized assistance. Scalable features with secure authentication, real-time data synchronization, and API integration, plus responsive cross-platform Android/iOS interfaces.",
    tech: ["React Native", "Expo", "PostgreSQL", "OpenAI API"],
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "CraveCart — Food Ordering Platform",
    description:
      "Scalable food ordering platform with restaurant discovery, menu browsing, cart management, and order processing. Secure backend services and responsive frontend interfaces for a smooth ordering experience.",
    tech: ["Spring Boot", "React.js", "MySQL", "Hibernate", "REST APIs"],
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "E-Commerce Platform — Full Stack Application",
    description:
      "Full-stack e-commerce platform supporting end-to-end flows with an admin dashboard. Stateless JWT authentication with Spring Security and RBAC across Admin/Seller/Buyer roles, mock payment simulation, and Docker-containerized backend.",
    tech: ["Spring Boot", "React.js", "MongoDB", "JWT", "REST APIs"],
    githubUrl: "#",
    demoUrl: "#",
  },
  {
    title: "Real-Time 3D Hand Tracking in Unity",
    description:
      "Real-time 3D hand-tracking pipeline using a Mediapipe 21-point skeleton and OpenCV, streaming joint coordinates to Unity over UDP at 60fps with ~50ms end-to-end latency for VR gesture interaction.",
    tech: ["Python", "OpenCV", "Mediapipe", "Unity (C#)", "UDP Communication"],
    githubUrl: "#",
    demoUrl: "#",
  },
];
