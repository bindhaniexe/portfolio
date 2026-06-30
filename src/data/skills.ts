export interface SkillCategory {
  name: "Languages" | "Frameworks & Libraries" | "Tools & Platforms" | "Design";
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Java", "Python", "JavaScript (ES6+)", "HTML5", "CSS3", "SQL", "C", "C++"],
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
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "Eclipse",
      "IntelliJ IDEA",
      "Linux/UNIX shell",
      "Docker (Basic)",
      "AWS EC2",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  {
    name: "Design",
    skills: ["Figma", "3D Architectural Visualization (Exterior and Interior)"],
  },
];
