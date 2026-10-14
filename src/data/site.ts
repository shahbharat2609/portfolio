export type Project = {
  name: string;
  year: string;
  tag: string;
  summary: string;
  stack: string[];
  panel: string;
  ridge: [string, string];
  tagColor: string;
  bike: BikeColors;
  href?: string;
};

export type BikeColors = {
  tank: string;
  jacket: string;
  helmet: string;
};

export type Stop = {
  number: string;
  place: string;
  phase: string;
  title: string;
  text: string;
  x: number;
  chips?: string[];
  checklist?: string[];
};

export type TimelineEntry = {
  period: string;
  role: string;
  detail: string;
};

export const site = {
  name: "Bharat Shah",
  role: "Full-stack engineer",
  email: "you@example.com",
  city: "Your city",
  links: {
    linkedin: "https://www.linkedin.com/in/shahbharat260901/",
    github: "https://github.com/",
    resume: "",
  },
  hero: {
    title: "Full-stack engineer building products that hold up at altitude.",
    intro:
      "I design and ship web apps, APIs and mobile apps end to end, with TypeScript on the server, React in the browser and Flutter on the phone.",
  },
  overview: {
    statement:
      "One engineer across the whole stack, from the schema to the screen, who stays accountable once real users arrive.",
    capabilities: ["Web applications", "Mobile apps", "APIs and integrations", "AI features"],
  },
  projects: [
    {
      name: "FreightFlow",
      year: "2026",
      tag: "Logistics · B2B platform",
      summary:
        "Freight platform where shippers post loads, carriers assign drivers and drivers deliver from a Flutter app.",
      stack: ["Fastify", "Prisma", "React", "Flutter"],
      panel: "#3C6CB4",
      ridge: ["#9DA9BF", "#C08A52"],
      tagColor: "#FFFFFF",
      bike: { tank: "#A8322B", jacket: "#A85E22", helmet: "#F4F1EA" },
    },
    {
      name: "My Cares",
      year: "2025",
      tag: "Health · Consumer app + AI",
      summary:
        "Health and wellness app for tracking medicines, diet, moods and goals, with family groups, events and AI daily insights.",
      stack: ["Expo", "NestJS", "FastAPI", "Next.js"],
      panel: "#2FA7AE",
      ridge: ["#F4F6F8", "#8A5636"],
      tagColor: "#0E2A2C",
      bike: { tank: "#2F6E99", jacket: "#3B4A3A", helmet: "#E6B422" },
    },
    {
      name: "Firm Management",
      year: "2026",
      tag: "Professional services · SSO",
      summary:
        "Practice management for an accounting firm: clients, staff and a client portal, with documents stored in SharePoint behind app-level permissions.",
      stack: ["Fastify", "React 19", "Entra ID", "Playwright"],
      panel: "#C08A52",
      ridge: ["#8A5636", "#1C2126"],
      tagColor: "#2A1A0E",
      bike: { tank: "#6B6F6A", jacket: "#2E5FA8", helmet: "#F4F1EA" },
    },
  ] satisfies Project[],
  stops: [
    {
      number: "01",
      place: "Sarchu",
      phase: "Discover",
      title: "Find the hard part first.",
      text: "Who uses it, what it connects to and where it is most likely to fail. The answers become a plan that can actually be built.",
      x: 200,
      chips: ["Who uses it?", "What does it talk to?", "What breaks first?"],
    },
    {
      number: "02",
      place: "Morey Plains",
      phase: "Build",
      title: "Build every layer.",
      text: "Interface, API, database and mobile app, built by one person who follows the problem across boundaries instead of handing it off.",
      x: 600,
      chips: ["Web UI", "API", "Database", "Mobile"],
    },
    {
      number: "03",
      place: "Tanglang La",
      phase: "Ship",
      title: "Make it hold up.",
      text: "Error states, automated tests, CI pipelines and monitored deploys. Software is judged by what happens after launch.",
      x: 1000,
      checklist: ["Error states", "Tests", "CI/CD", "Deployed"],
    },
  ] satisfies Stop[],
  about: {
    title: "Calm, typed and accountable.",
    lead: "I care about typed contracts, quiet deploys and interfaces people can use without a manual.",
    body: "I own features end to end, from the database schema to the last pixel. I've built SaaS platforms, internal tools and consumer mobile apps for clients across logistics, health and professional services.",
    timeline: [
      {
        period: "2024 – now",
        role: "Software Engineer, Sifars",
        detail: "Full-stack work on client products across web, API and mobile",
      },
      { period: "Years", role: "Previous role, Company", detail: "What you worked on" },
      { period: "Years", role: "Degree, University", detail: "Computer Science" },
    ] satisfies TimelineEntry[],
    skills: [
      {
        group: "Backend",
        items: ["Node.js", "TypeScript", "Fastify", "NestJS", "FastAPI", "Prisma", "PostgreSQL"],
      },
      { group: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind", "shadcn/ui"] },
      { group: "Mobile", items: ["Flutter", "Expo", "Riverpod", "go_router"] },
    ],
  },
};

export const flagColors = ["#2E5FA8", "#F4F1EA", "#C8342B", "#2E8B57", "#E6B422"] as const;
