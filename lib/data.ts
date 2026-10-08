// Single source of truth for everything on the site.
// Edit here — the page renders entirely from this file.

export const profile = {
  name: "Akash Kumar",
  role: "Python Full-Stack Engineer",
  location: "Punjab, India",
  email: "akashjune11990@gmail.com",
  phone: "+91 70095 47183",
  phoneHref: "+917009547183",
  linkedin: "https://www.linkedin.com/in/akash-kumar-92a788197",
  linkedinLabel: "in/akash-kumar-92a788197",
  github: "https://github.com/akashdev007",
  githubLabel: "akashdev007",
  resume: "/akash-kumar-resume.pdf",
  status: "Building RL environments at Quess Corp",
};

export const stats = [
  { value: "2+", label: "years shipping full-time" },
  { value: "05", label: "teams shipped with" },
  { value: "03", label: "products built end to end" },
  { value: "'22", label: "first production React" },
];

export type Role = {
  title: string;
  company: string;
  place: string;
  start: string;
  end: string;
  current?: boolean;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    title: "Python Full Stack Developer",
    company: "Quess Corp Pvt. Ltd.",
    place: "Gurugram",
    start: "Feb 2026",
    end: "Present",
    current: true,
    points: [
      "Develop interactive games in Python used in LLM training and benchmarking workflows.",
      "Build reinforcement-learning environments for training and fine-tuning large language models.",
      "Create evaluation harnesses that measure LLM performance on coding problems and verify benchmark correctness.",
    ],
    tags: ["Python", "RL environments", "LLM evals", "Game design"],
  },
  {
    title: "Software Engineer",
    company: "Centaq Pvt. Ltd.",
    place: "Chandigarh",
    start: "Mar 2025",
    end: "Feb 2026",
    points: [
      "Built a server-side rendered web application with a Next.js front end and a FastAPI back end.",
      "Developed and optimised full-stack applications with a focus on performance and scalability.",
    ],
    tags: ["Next.js", "FastAPI", "SSR", "Performance"],
  },
  {
    title: "Full Stack Developer",
    company: "IIT Ropar",
    place: "Punjab",
    start: "Nov 2024",
    end: "Mar 2025",
    points: [
      "Developed a full-stack Learning Management System in React and Django with AI-based security.",
      "Led the implementation of AI proctoring that monitors student activity during lectures.",
    ],
    tags: ["React", "Django", "AI proctoring"],
  },
  {
    title: "MERN Stack Developer",
    company: "CRFM",
    place: "Chandigarh",
    start: "Jan 2024",
    end: "Nov 2024",
    points: [
      "Built front-end features in React and back-end services with Node.js, Express and MongoDB.",
      "Deployed and maintained applications on Render, Vercel and Netlify.",
    ],
    tags: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    title: "React Developer Intern",
    company: "Solitair Infosys",
    place: "Chandigarh",
    start: "Jul 2022",
    end: "Aug 2022",
    points: ["Built web applications in React, integrating REST APIs and third-party libraries."],
    tags: ["React", "REST APIs"],
  },
];

export type Project = {
  id: "lms" | "salon" | "letsmake";
  name: string;
  context: string;
  year: string;
  pitch: string;
  features: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    id: "lms",
    name: "LMS Portal",
    context: "IIT Ropar",
    year: "2024–25",
    pitch:
      "A full-stack learning platform where an AI proctor watches for engagement, not just attendance.",
    features: [
      "AI-based proctoring that tracks student activity during live lectures",
      "Video assessments with integrity checks built into the flow",
      "React front end over Django, with Express and FastAPI services alongside",
    ],
    stack: ["React", "Django", "Express", "FastAPI", "shadcn/ui", "Tailwind CSS"],
  },
  {
    id: "salon",
    name: "Salon Inventory",
    context: "Personal project",
    year: "2025",
    pitch:
      "Server-rendered stock control for salons: live inventory, AI restock suggestions and appointment booking in one place.",
    features: [
      "Live stock tracking, server-rendered for fast first loads",
      "AI suggestions for what to reorder and when",
      "Appointment booking tied to the products each service consumes",
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Tailwind CSS"],
  },
  {
    id: "letsmake",
    name: "LetsMake",
    context: "Personal project",
    year: "2025",
    pitch:
      "A collaborative ad-production platform: versioned creatives, frame-accurate video review and side-by-side version comparison.",
    features: [
      "Versioned creatives, so every revision has a history",
      "Frame-level comments pinned to the exact moment in a video",
      "Version comparison to see what changed between cuts",
    ],
    stack: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Redis", "DigitalOcean"],
  },
];

// `core` marks the tools used day to day.
export const toolchain: { group: string; items: { name: string; core?: boolean }[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "Python", core: true },
      { name: "TypeScript", core: true },
      { name: "JavaScript", core: true },
      { name: "SQL", core: true },
      { name: "HTML" },
      { name: "CSS" },
    ],
  },
  {
    group: "Frameworks",
    items: [
      { name: "React", core: true },
      { name: "Next.js", core: true },
      { name: "FastAPI", core: true },
      { name: "Django", core: true },
      { name: "Node.js" },
      { name: "Express" },
      { name: "Vue.js" },
      { name: "Redux" },
      { name: "Tailwind CSS" },
      { name: "Bootstrap" },
      { name: "jQuery" },
    ],
  },
  {
    group: "Data",
    items: [{ name: "PostgreSQL", core: true }, { name: "Redis", core: true }, { name: "MongoDB" }],
  },
  {
    group: "Tooling",
    items: [
      { name: "Docker", core: true },
      { name: "Git", core: true },
      { name: "REST APIs", core: true },
      { name: "JWT" },
      { name: "Vite" },
      { name: "Webpack" },
      { name: "Babel" },
      { name: "ESLint" },
      { name: "Prettier" },
    ],
  },
  {
    group: "Cloud",
    items: [
      { name: "AWS" },
      { name: "GCP" },
      { name: "Azure" },
      { name: "DigitalOcean" },
      { name: "Vercel", core: true },
      { name: "Render" },
      { name: "Netlify" },
    ],
  },
];

export const education = [
  {
    school: "Chandigarh Engineering College",
    detail: "B.Tech, Computer Science & Engineering",
    when: "2020 — 2024",
  },
  { school: "Kendriya Vidyalaya 2", detail: "Class XII, Non-Medical", when: "2019 — 2020" },
  { school: "Jawahar Navodaya Vidyalaya", detail: "Class X", when: "2017 — 2018" },
];
