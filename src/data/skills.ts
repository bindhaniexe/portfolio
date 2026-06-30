export interface SkillCategory {
  name:
    | "Languages"
    | "Frameworks & Libraries"
    | "Tools & Platforms"
    | "Databases & DevOps";
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Java", "Python", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL", "C", "C++"],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "Spring Boot",
      "Hibernate",
      "React.js",
      "React Native",
      "Node.js",
      "Astro.js",
      "Expo",
      "jQuery",
      "Bootstrap",
      "Tailwind CSS",
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "IntelliJ IDEA",
      "Eclipse",
      "Linux / UNIX shell",
      "Docker",
      "AWS EC2",
      "Figma",
      "Postman",
    ],
  },
  {
    name: "Databases & DevOps",
    skills: [
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
      "JWT / Spring Security",
      "CI / CD (GitHub Actions)",
      "Docker Compose",
    ],
  },
];
