/**
 * SEO Pre-Render Script for LearnOpto
 *
 * Since LearnOpto is a Vite SPA deployed on Netlify, Googlebot sees
 * an empty <div id="root"></div>. This script runs after `vite build`
 * and generates route-specific index.html files in dist/ with:
 *   - Correct <title>
 *   - Correct <meta name="description">
 *   - Correct <link rel="canonical">
 *   - Correct <meta property="og:*"> and <meta name="twitter:*">
 *   - Correct <script type="application/ld+json"> structured data
 *
 * Netlify's _redirects rule (`/* /index.html 200`) still serves the SPA,
 * but these pre-rendered files let crawlers see real content immediately.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE_URL = "https://learnopto.site";

// ── Route SEO Data ──────────────────────────────────────────────────
const routes = [
  {
    path: "/",
    title: "LearnOpto — Fast, Smart & Focused Learning Engine",
    description: "LearnOpto is the ultimate personal learning operating system. Aggregate, summarize, roadmap, and master knowledge faster with AI.",
    canonical: SITE_URL,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "LearnOpto",
        alternateName: "LearnOpto AI Study Assistant",
        url: SITE_URL,
        description: "AI-powered educational search platform that curates top YouTube videos, podcasts, technical documentation, and courses into structured study paths.",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/dashboard?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "LearnOpto",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        description: "LearnOpto is an AI-powered educational discovery engine eliminating search fatigue.",
        founder: { "@type": "Person", name: "Ronit Mexson", url: "https://ronitmexson.netlify.app" },
      },
    ],
  },
  {
    path: "/about",
    title: "About Ronit Mexson — Creator & Architect of LearnOpto",
    description: "Learn about Ronit Mexson, creator of LearnOpto. Built to solve search fatigue by organizing video courses, technical documentation, podcasts, and roadmaps with AI.",
    canonical: `${SITE_URL}/about`,
  },
  {
    path: "/faq",
    title: "Frequently Asked Questions (FAQ) — LearnOpto AI Platform",
    description: "Find answers to common questions about LearnOpto's AI search engine, zero dead link verification, resource ranking algorithms, personal library bookmarking, and security.",
    canonical: `${SITE_URL}/faq`,
    schema: [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is LearnOpto and how does it work?", acceptedAnswer: { "@type": "Answer", text: "LearnOpto is an AI-powered educational search and curation engine that queries top learning databases, verifies URLs in real-time, and organizes resources into a clean study feed." } },
        { "@type": "Question", name: "Is LearnOpto free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes! LearnOpto offers free access to AI resource curation, search history, format weighting, and personal library bookmarking." } },
        { "@type": "Question", name: "How does LearnOpto verify zero dead links?", acceptedAnswer: { "@type": "Answer", text: "LearnOpto performs automated HTTP HEAD requests and DNS safety checks to verify every URL is active and reachable." } },
      ],
    }],
  },
  {
    path: "/login",
    title: "Sign In & Authentication — LearnOpto",
    description: "Sign in to LearnOpto with Google OAuth 2.0, GitHub OAuth, or WebAuthn Passkeys to access your personalized library, saved resources, and search history.",
    canonical: `${SITE_URL}/login`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy — LearnOpto",
    description: "LearnOpto Privacy Policy. Details on HTTP-Only cookie security, data handling, and privacy protections for our AI search platform.",
    canonical: `${SITE_URL}/privacy`,
  },
  {
    path: "/terms",
    title: "Terms of Service — LearnOpto",
    description: "LearnOpto Terms of Service. Acceptable use policies, API terms, and user guidelines for our AI-powered educational discovery platform.",
    canonical: `${SITE_URL}/terms`,
  },
  // Topic pages
  {
    path: "/topics/react",
    title: "React & Modern Frontend Engineering — AI-Curated Learning Path",
    description: "Master React 18+, Server Components, Hooks, State Management, and Next.js performance optimizations with AI-curated video courses, official docs, and podcasts.",
    canonical: `${SITE_URL}/topics/react`,
  },
  {
    path: "/topics/python",
    title: "Python Programming & Data Science — AI-Curated Learning Path",
    description: "Learn Python from fundamentals to advanced Data Science, Machine Learning, Web Development (FastAPI/Django), and automation scripts.",
    canonical: `${SITE_URL}/topics/python`,
  },
  {
    path: "/topics/system-design",
    title: "System Design & Distributed Systems — AI-Curated Learning Path",
    description: "Master high-availability architecture, microservices, load balancing, database sharding, caching strategies, and message queues.",
    canonical: `${SITE_URL}/topics/system-design`,
  },
  {
    path: "/topics/machine-learning",
    title: "Machine Learning & AI Engineering — AI-Curated Learning Path",
    description: "Explore Deep Learning, Neural Networks, Natural Language Processing (NLP), Large Language Models (LLMs), PyTorch, and TensorFlow.",
    canonical: `${SITE_URL}/topics/machine-learning`,
  },
  {
    path: "/topics/cloud-computing",
    title: "Cloud Computing & DevOps Engineering — AI-Curated Learning Path",
    description: "Master AWS, GCP, Azure, Docker, Kubernetes, CI/CD pipelines, serverless architecture, and infrastructure as code (Terraform).",
    canonical: `${SITE_URL}/topics/cloud-computing`,
  },
  // Roadmap pages
  {
    path: "/roadmaps/frontend-development",
    title: "Frontend Development Learning Roadmap — Step-by-Step Guide",
    description: "A step-by-step structured curriculum for mastering modern web frontend development with zero search fatigue.",
    canonical: `${SITE_URL}/roadmaps/frontend-development`,
  },
  {
    path: "/roadmaps/backend-development",
    title: "Backend Development Learning Roadmap — Step-by-Step Guide",
    description: "Learn how to architect high-performance REST APIs, database queries, authentication systems, and cloud backend microservices.",
    canonical: `${SITE_URL}/roadmaps/backend-development`,
  },
  {
    path: "/roadmaps/ai-engineering",
    title: "AI Engineering & LLM Systems Roadmap — Step-by-Step Guide",
    description: "A practical guide to building intelligent generative AI applications, vector search indexes, and fine-tuned LLM agents.",
    canonical: `${SITE_URL}/roadmaps/ai-engineering`,
  },
  // Feature pages
  {
    path: "/features/ai-search",
    title: "AI Multi-Source Educational Search — LearnOpto Features",
    description: "LearnOpto queries multiple authoritative educational platforms simultaneously, analyzing and ranking top video tutorials, technical documentation, podcasts, and structured courses into one distraction-free feed.",
    canonical: `${SITE_URL}/features/ai-search`,
  },
  {
    path: "/features/personal-library",
    title: "Personal Learning Library & Bookmarks — LearnOpto Features",
    description: "Save your favorite tutorials, reference manuals, audio interviews, and courses with one click. Access your private, organized library across all devices.",
    canonical: `${SITE_URL}/features/personal-library`,
  },
  {
    path: "/features/roadmaps",
    title: "Curated Learning Roadmaps — LearnOpto Features",
    description: "Break down overwhelming tech stacks into clear, milestone-driven learning steps tailored for developers, students, and engineers.",
    canonical: `${SITE_URL}/features/roadmaps`,
  },
];

// ── Generate pre-rendered HTML files ────────────────────────────────
function generatePreRenderedHTML() {
  const templatePath = resolve(DIST, "index.html");

  if (!existsSync(templatePath)) {
    console.error("❌ dist/index.html not found. Run vite build first.");
    process.exit(1);
  }

  const template = readFileSync(templatePath, "utf-8");
  let count = 0;

  for (const route of routes) {
    if (route.path === "/") continue; // Root is already index.html

    // Build replacement head content
    const titleTag = `<title>${escapeHtml(route.title)}</title>`;
    const descTag = `<meta name="description" content="${escapeHtml(route.description)}">`;
    const canonicalTag = `<link rel="canonical" href="${route.canonical}">`;
    const ogTitleTag = `<meta property="og:title" content="${escapeHtml(route.title)}">`;
    const ogDescTag = `<meta property="og:description" content="${escapeHtml(route.description)}">`;
    const ogUrlTag = `<meta property="og:url" content="${route.canonical}">`;
    const twitterTitleTag = `<meta name="twitter:title" content="${escapeHtml(route.title)}">`;
    const twitterDescTag = `<meta name="twitter:description" content="${escapeHtml(route.description)}">`;

    let html = template;

    // Replace <title>
    html = html.replace(/<title>[^<]*<\/title>/, titleTag);

    // Replace/add meta description
    html = html.replace(/<meta name="description"[^>]*>/, descTag);

    // Replace OG tags
    html = html.replace(/<meta property="og:title"[^>]*>/, ogTitleTag);
    html = html.replace(/<meta property="og:description"[^>]*>/, ogDescTag);
    if (html.includes('og:url')) {
      html = html.replace(/<meta property="og:url"[^>]*>/, ogUrlTag);
    } else {
      html = html.replace(ogTitleTag, `${ogTitleTag}\n    ${ogUrlTag}`);
    }

    // Replace Twitter tags
    html = html.replace(/<meta name="twitter:title"[^>]*>/, twitterTitleTag);
    html = html.replace(/<meta name="twitter:description"[^>]*>/, twitterDescTag);

    // Add canonical link
    if (!html.includes('rel="canonical"')) {
      html = html.replace("</head>", `    ${canonicalTag}\n  </head>`);
    } else {
      html = html.replace(/<link rel="canonical"[^>]*>/, canonicalTag);
    }

    // Add JSON-LD structured data if available
    if (route.schema) {
      const jsonLd = `<script type="application/ld+json">${JSON.stringify(route.schema, null, 2)}</script>`;
      html = html.replace("</head>", `    ${jsonLd}\n  </head>`);
    }

    // Write to dist path
    const dirPath = resolve(DIST, route.path.replace(/^\//, ""));
    mkdirSync(dirPath, { recursive: true });
    writeFileSync(resolve(dirPath, "index.html"), html, "utf-8");
    count++;
  }

  // Also inject schema into the root index.html
  const rootRoute = routes.find((r) => r.path === "/");
  if (rootRoute?.schema) {
    let rootHtml = readFileSync(templatePath, "utf-8");
    const jsonLd = `<script type="application/ld+json">${JSON.stringify(rootRoute.schema, null, 2)}</script>`;
    rootHtml = rootHtml.replace("</head>", `    ${jsonLd}\n  </head>`);
    writeFileSync(templatePath, rootHtml, "utf-8");
    count++;
  }

  console.log(`✅ Pre-rendered ${count} SEO pages in dist/`);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

generatePreRenderedHTML();
