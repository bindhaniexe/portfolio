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
    title: "DevLink — Developer Social API",
    description:
      "RESTful social network API for developers to share posts, follow each other, and discover projects. Built with stateless JWT auth, role-based access control, paginated feeds, and full test coverage with JUnit and Mockito.",
    tech: ["Spring Boot", "PostgreSQL", "JWT", "JUnit", "Mockito", "Docker"],
    githubUrl: "#",
    demoUrl: "#",
  },
];
