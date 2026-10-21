/**
 * Dynamic Sitemap Generator for LearnOpto
 * Runs after `vite build` to produce an up-to-date sitemap.xml
 * with accurate <lastmod> timestamps.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://learnopto.site";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ── Route definitions ──────────────────────────────────────────────
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/login", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/faq", changefreq: "weekly", priority: "0.9" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

const topicSlugs = [
  "react",
  "python",
  "system-design",
  "machine-learning",
  "cloud-computing",
];

const roadmapSlugs = [
  "frontend-development",
  "backend-development",
  "ai-engineering",
];

const featureSlugs = ["ai-search", "personal-library", "roadmaps"];

// ── Build URL entries ──────────────────────────────────────────────
const urlEntries = [];

// Static routes
for (const route of staticRoutes) {
  urlEntries.push({
    loc: `${SITE_URL}${route.path}`,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
  });
}

// Feature pages
for (const slug of featureSlugs) {
  urlEntries.push({
    loc: `${SITE_URL}/features/${slug}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });
}

// Topic pages
for (const slug of topicSlugs) {
  urlEntries.push({
    loc: `${SITE_URL}/topics/${slug}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.9",
  });
}

// Roadmap pages
for (const slug of roadmapSlugs) {
  urlEntries.push({
    loc: `${SITE_URL}/roadmaps/${slug}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.9",
  });
}

// ── Generate XML ───────────────────────────────────────────────────
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

// Write to both public/ (for dev server) and dist/ (for production build)
const publicPath = resolve(__dirname, "../public/sitemap.xml");
const distPath = resolve(__dirname, "../dist/sitemap.xml");

writeFileSync(publicPath, xml, "utf-8");
console.log(`✅ Sitemap generated → ${publicPath} (${urlEntries.length} URLs, lastmod: ${today})`);

try {
  writeFileSync(distPath, xml, "utf-8");
  console.log(`✅ Sitemap copied  → ${distPath}`);
} catch {
  // dist/ may not exist if running outside build context
  console.log("ℹ️  dist/ not found — skipping dist copy (run after vite build)");
}
