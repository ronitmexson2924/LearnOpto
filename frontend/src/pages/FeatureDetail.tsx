import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Search, BookmarkCheck, BarChart3, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, navigateBack, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildSoftwareApplicationSchema, buildBreadcrumbSchema } from "@/components/seo/schemaHelpers";

interface FeatureInfo {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  howItWorks: string;
}

const FEATURES: Record<string, FeatureInfo> = {
  "ai-search": {
    title: "AI Multi-Source Educational Search",
    subtitle: "Eliminate Search Fatigue Across YouTube, Docs, Podcasts & Courses",
    description: "LearnOpto queries multiple authoritative educational platforms simultaneously, analyzing and ranking top video tutorials, technical documentation, podcasts, and structured courses into one distraction-free feed.",
    benefits: [
      "Combines videos, podcasts, documentation, and courses in a single unified view",
      "Performs real-time automated HTTP HEAD checks to guarantee zero dead links",
      "Eliminates clickbait thumbnails, ad noise, and low-quality algorithm recommendations",
      "Saves developers and self-taught learners 30–45 minutes of search time per topic",
    ],
    howItWorks: "Our backend utilizes Gemini 2.5 Flash algorithms combined with custom DNS and network reachability checkers. Each topic is processed to return structured JSON resource cards with title, description, verified URL, source, and media type.",
  },
  "personal-library": {
    title: "Personal Learning Library & Bookmarks",
    subtitle: "Build Your Second Brain of Verified Learning Resources",
    description: "Save your favorite tutorials, reference manuals, audio interviews, and courses with one click. Access your private, organized library across desktop, tablet, and mobile devices.",
    benefits: [
      "Idempotent 1-click bookmarking across all search results",
      "Filter saved items by media type (Videos, Audio, Docs, Courses)",
      "Syncs instantly with HTTP-Only cookie security across all your devices",
      "No lost links or expired browser bookmarks",
    ],
    howItWorks: "Saved items are stored securely in Neon Serverless PostgreSQL with composite unique indexing (`userId` + `url`), ensuring your personal library is private, instant, and deduplicated.",
  },
  roadmaps: {
    title: "Curated Learning Roadmaps",
    subtitle: "Guided Step-by-Step Paths for Modern Software Technologies",
    description: "Break down overwhelming tech stacks into clear, milestone-driven learning steps tailored for developers, students, and engineers.",
    benefits: [
      "Structured milestone progression from beginner fundamentals to advanced production patterns",
      "Covers Frontend Development, Backend Architecture, AI Engineering, and System Design",
      "Direct integration with LearnOpto's AI search engine to fetch live study materials for each step",
    ],
    howItWorks: "LearnOpto maps learning roadmaps to canonical technology entities, grouping resources by complexity so you always know what to study next.",
  },
};

export default function FeatureDetail({ slug = "ai-search" }: { slug?: string }) {
  const feature = FEATURES[slug.toLowerCase()] || FEATURES["ai-search"];

  const softwareSchema = buildSoftwareApplicationSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Features", url: "/features/ai-search" },
    { name: feature.title, url: `/features/${slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title={`${feature.title} — LearnOpto Features`}
        description={feature.description}
        canonicalUrl={`https://learnopto.site/features/${slug}`}
      />
      <JsonLd data={[softwareSchema, breadcrumbSchema]} />

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            reloadCurrentPage();
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight font-poppins">LearnOpto</span>
        </a>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-2">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <span className="text-muted-foreground">Features</span>
            <span>/</span>
            <span className="text-foreground font-medium">{feature.title}</span>
          </nav>

          {/* Hero Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Feature Deep Dive
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins">
              {feature.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {feature.subtitle}. {feature.description}
            </p>
          </div>

          {/* Key Benefits */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-poppins text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Core Benefits
            </h2>
            <ul className="space-y-3 pl-2">
              {feature.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div className="space-y-3 bg-card/60 border border-border/80 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold font-poppins">How It Works Under the Hood</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {feature.howItWorks}
            </p>
          </div>

          {/* Action CTA */}
          <div className="bg-card border border-border/80 rounded-3xl p-8 text-center space-y-4 shadow-md">
            <h3 className="text-xl font-bold font-poppins">Try {feature.title} Free</h3>
            <Button
              onClick={() => navigateTo("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
            >
              Get Started with LearnOpto
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-border/40 bg-background">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnOpto. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="/about" className="hover:text-foreground transition-colors">About Creator</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
