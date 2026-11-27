// All site copy lives here, so text can be edited without touching components.
import aryaVedaShot from "../assets/projects/aryaveda.jpg";
import lawNationShot from "../assets/projects/lawnation.jpg";

export const contact = {
  name: "Aman Mirza",
  email: "aman9811269898@gmail.com",
  phone: "+91 80769 93834",
  phoneHref: "tel:+918076993834",
  address: "Gurugram, Haryana, India",
  hours: "Mon–Fri, 10:00–19:00 IST",
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

// `count: true` animates the number up from zero when it scrolls into view.
export const facts = [
  { value: 150, suffix: "+", label: "Projects delivered", count: true },
  { value: 12, suffix: "", label: "Countries served", count: true },
  { value: 40, suffix: "+", label: "Long-term clients", count: true },
  { value: 2019, suffix: "", label: "Founded", count: false },
];

export const clients = [
  "Nimbus Finance",
  "Pulse Health",
  "Lumen AI",
  "Terra Goods",
  "Orbit Logistics",
  "Kavya Learning",
  "Northwind Retail",
  "Helix Labs",
];

export const services = [
  {
    title: "Web development",
    text: "Marketing sites, customer portals and web applications. Fast, accessible and easy for your team to update.",
    stack: ["React", "Next.js", "Node.js", "Shopify"],
  },
  {
    title: "Mobile apps",
    text: "iOS and Android apps from a single codebase, with native modules where performance matters.",
    stack: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    title: "Product design",
    text: "User research, wireframes, interface design and design systems that developers can actually build from.",
    stack: ["Figma", "Prototyping", "Design systems"],
  },
  {
    title: "AI integration",
    text: "Assistants, document search and workflow automation built on top of your existing data and tools.",
    stack: ["OpenAI", "Claude", "RAG", "Python"],
  },
  {
    title: "Cloud & DevOps",
    text: "Infrastructure setup, CI/CD pipelines, monitoring and cost reviews on AWS, GCP and Vercel.",
    stack: ["AWS", "Docker", "Terraform", "GitHub Actions"],
  },
  {
    title: "SEO & analytics",
    text: "Technical SEO, Core Web Vitals and analytics setup so you know what is working and what is not.",
    stack: ["GA4", "Search Console", "Hotjar"],
  },
];

export const projects = [
  {
    name: "Arya Veda Academy",
    url: "https://www.aryavedaacademy.com",
    result: { value: 12, decimals: 0, suffix: "k", label: "Students trained by the academy" },
    sign: "Namaste!",
    tags: ["React", "Bilingual IT/EN", "Lead forms"],
    sector: "Education & wellness",
    scope: "Academy website, Italy",
    year: "2026",
    summary: "Website for an Ayurveda academy in Milan and Reggio Emilia. It covers courses, consultations and India trips, and includes a free Prakriti constitution test and GDPR-compliant enquiry forms, in Italian and English.",
    tone: "#F6EFD9",
    accent: "#2E6B3A",
    kind: "screenshot",
    image: aryaVedaShot,
  },
  {
    name: "Law Nation",
    url: "https://lawnation.co.in",
    result: { value: 40, decimals: 0, suffix: "+", label: "Legal research areas, searchable by title, author or keyword" },
    sign: "Objection overruled!",
    tags: ["Next.js", "Search", "Author portal"],
    sector: "Legal publishing",
    scope: "Online law journal platform",
    year: "2026",
    summary: "Open-access law journal based in New Delhi. Authors submit papers online, readers browse issues and search articles with advanced filters, and every piece carries its own citation (e.g. 2025 LN(6)A47).",
    tone: "#F7E4E4",
    accent: "#B91C1C",
    kind: "screenshot",
    image: lawNationShot,
  },
];

export const process = [
  {
    title: "Discovery",
    duration: "1–2 weeks",
    text: "We talk to your team and users, review what exists today and agree on goals we can measure.",
  },
  {
    title: "Planning",
    duration: "1 week",
    text: "Scope, technical architecture, timeline and a fixed quote. No surprises later.",
  },
  {
    title: "Design",
    duration: "2–4 weeks",
    text: "Wireframes first, then high-fidelity screens and a clickable prototype you can test.",
  },
  {
    title: "Development",
    duration: "4–12 weeks",
    text: "Two-week sprints with a demo at the end of each one. You get access to staging from day one.",
  },
  {
    title: "Launch & support",
    duration: "Ongoing",
    text: "Release, monitoring and a 30-day warranty period, followed by an optional support plan.",
  },
];

export const stack = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin"] },
  { group: "Backend", items: ["Node.js", "Python", "PostgreSQL", "MongoDB"] },
  { group: "Cloud", items: ["AWS", "Google Cloud", "Vercel", "Docker"] },
  { group: "AI", items: ["OpenAI", "Anthropic", "LangChain", "Pinecone"] },
];

export const testimonials = [
  {
    quote:
      "They questioned parts of our brief that we had not thought through, and the product is better for it. Weekly demos meant we always knew where things stood.",
    name: "Rohan Kapoor",
    role: "CEO, Nimbus Finance",
  },
  {
    quote:
      "We had tried two agencies before. Otterova was the first team that shipped on the date they gave us, and the app has been stable since launch.",
    name: "Sara Mendes",
    role: "Founder, Pulse Health",
  },
  {
    quote:
      "Clear communication, sensible technical decisions and good documentation at handover. Our in-house team picked it up without any trouble.",
    name: "Daniel Lee",
    role: "CTO, Lumen AI",
  },
];

export const interests = ["Website", "Mobile app", "Product design", "AI integration", "Other"];

export const budgets = ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹40L", "₹40L+"];
