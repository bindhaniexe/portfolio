export interface SkillItem {
  name: string;
  /** URL to the technology's official logo PNG */
  image: string;
}

export interface SkillCategory {
  name:
    | "Languages"
    | "Frameworks & Libraries"
    | "Tools & Platforms"
    | "Databases & DevOps";
  skills: SkillItem[];
}

// Devicon CDN — PNG versions have guaranteed pixel dimensions (WebGL-safe)
const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      { name: "Java",              image: `${CDN}/java/java-original.svg` },
      { name: "Python",            image: `${CDN}/python/python-original.svg` },
      { name: "JavaScript",        image: `${CDN}/javascript/javascript-original.svg` },
      { name: "TypeScript",        image: `${CDN}/typescript/typescript-original.svg` },
      { name: "HTML5",             image: `${CDN}/html5/html5-original.svg` },
      { name: "CSS3",              image: `${CDN}/css3/css3-original.svg` },
      { name: "C",                 image: `${CDN}/c/c-original.svg` },
      { name: "C++",               image: `${CDN}/cplusplus/cplusplus-original.svg` },
    ],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      { name: "Spring Boot",       image: `${CDN}/spring/spring-original.svg` },
      { name: "React",             image: `${CDN}/react/react-original.svg` },
      { name: "React Native",      image: `${CDN}/react/react-original.svg` },
      { name: "Node.js",           image: `${CDN}/nodejs/nodejs-original.svg` },
      { name: "Astro",             image: `${CDN}/astro/astro-original.svg` },
      { name: "jQuery",            image: `${CDN}/jquery/jquery-original.svg` },
      { name: "Bootstrap",         image: `${CDN}/bootstrap/bootstrap-original.svg` },
      { name: "Tailwind CSS",      image: `${CDN}/tailwindcss/tailwindcss-original.svg` },
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Git",               image: `${CDN}/git/git-original.svg` },
      { name: "GitHub",            image: `${CDN}/github/github-original-wordmark.svg` },
      { name: "VS Code",           image: `${CDN}/vscode/vscode-original.svg` },
      { name: "IntelliJ IDEA",     image: `${CDN}/intellij/intellij-original.svg` },
      { name: "Linux",             image: `${CDN}/linux/linux-original.svg` },
      { name: "Docker",            image: `${CDN}/docker/docker-original.svg` },
      { name: "AWS",               image: `${CDN}/amazonwebservices/amazonwebservices-plain-wordmark.svg` },
      { name: "Figma",             image: `${CDN}/figma/figma-original.svg` },
      { name: "Postman",           image: `${CDN}/postman/postman-original.svg` },
    ],
  },
  {
    name: "Databases & DevOps",
    skills: [
      { name: "MySQL",             image: `${CDN}/mysql/mysql-original.svg` },
      { name: "MongoDB",           image: `${CDN}/mongodb/mongodb-original.svg` },
      { name: "PostgreSQL",        image: `${CDN}/postgresql/postgresql-original.svg` },
      { name: "GitHub Actions",    image: `${CDN}/githubactions/githubactions-original.svg` },
    ],
  },
];

/**
 * Flattened list of all skills as CircularGallery items.
 */
export const allSkillsAsGalleryItems = skillCategories.flatMap(cat =>
  cat.skills.map(skill => ({ image: skill.image, text: skill.name }))
);
