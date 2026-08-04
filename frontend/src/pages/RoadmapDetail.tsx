import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, navigateBack, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildHowToSchema, buildBreadcrumbSchema } from "@/components/seo/schemaHelpers";

interface RoadmapData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  milestones: Array<{ step: string; title: string; text: string }>;
}

const ROADMAPS: Record<string, RoadmapData> = {
  "frontend-development": {
    slug: "frontend-development",
    title: "Frontend Development Learning Roadmap",
    subtitle: "From HTML/CSS Fundamentals to React 18 & Next.js",
    description: "A step-by-step structured curriculum for mastering modern web frontend development with zero search fatigue.",
    milestones: [
      { step: "01", title: "Web Fundamentals", text: "Master HTML5 semantic tags, CSS Flexbox/Grid, and responsive layout principles." },
      { step: "02", title: "JavaScript ES6+", text: "Deep dive into Async/Await, Promises, Closures, DOM manipulation, and Fetch API." },
      { step: "03", title: "React & Component Architecture", text: "Learn React Hooks, state management, component composition, and virtual DOM optimization." },
      { step: "04", title: "TypeScript & Tooling", text: "Integrate TypeScript type checking, Tailwind CSS, Vite, and build optimization." },
      { step: "05", title: "Fullstack Next.js & Deployment", text: "Build SSR, SSG, Server Actions, and deploy to Netlify or Vercel." },
    ],
  },
  "backend-development": {
    slug: "backend-development",
    title: "Backend Development Learning Roadmap",
    subtitle: "Node.js, Express, PostgreSQL, and Microservices",
    description: "Learn how to architect high-performance REST APIs, database queries, authentication systems, and cloud backend microservices.",
    milestones: [
      { step: "01", title: "Node.js & Express Basics", text: "Understand event loops, asynchronous I/O, middleware patterns, and REST API design." },
      { step: "02", title: "Database Systems & SQL", text: "Master PostgreSQL schema design, Prisma ORM, indexing, and ACID transactions." },
      { step: "03", title: "Security & Authentication", text: "Implement JWT, OAuth 2.0 (Google & GitHub), WebAuthn Passkeys, and rate limiting." },
      { step: "04", title: "Caching & Queues", text: "Optimize backend latency with Redis caching and asynchronous message queues." },
      { step: "05", title: "DevOps & Cloud Hosting", text: "Dockerize applications and deploy to Render, Railway, or AWS." },
    ],
  },
  "ai-engineering": {
    slug: "ai-engineering",
    title: "AI Engineering & LLM Systems Roadmap",
    subtitle: "PyTorch, RAG Pipelines, Vector Search & Fine-Tuning",
    description: "A practical guide to building intelligent generative AI applications, vector search indexes, and fine-tuned LLM agents.",
    milestones: [
      { step: "01", title: "Python for AI", text: "Master Python data libraries: NumPy, Pandas, and PyTorch tensors." },
      { step: "02", title: "Neural Networks & Deep Learning", text: "Understand Backpropagation, Transformers, and Multi-Head Attention mechanisms." },
      { step: "03", title: "Vector Embeddings & RAG", text: "Build Retrieval-Augmented Generation systems using Pinecone, Qdrant, and LangChain." },
      { step: "04", title: "Model Fine-Tuning & Evaluation", text: "Fine-tune open-source models (Llama 3, Mistral) using LoRA and QLoRA techniques." },
      { step: "05", title: "Autonomous AI Agents", text: "Deploy multi-agent workflows with tool-calling capabilities." },
    ],
  },
};

export default function RoadmapDetail({ slug = "frontend-development" }: { slug?: string }) {
  const roadmap = ROADMAPS[slug.toLowerCase()] || ROADMAPS["frontend-development"];

  const howToSchema = buildHowToSchema({
    name: roadmap.title,
    description: roadmap.description,
    steps: roadmap.milestones,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Roadmaps", url: "/roadmaps/frontend-development" },
    { name: roadmap.title, url: `/roadmaps/${roadmap.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title={`${roadmap.title} — Step-by-Step Guide`}
        description={roadmap.description}
        canonicalUrl={`https://learnopto.com/roadmaps/${roadmap.slug}`}
      />
      <JsonLd data={[howToSchema, breadcrumbSchema]} />

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
            <span className="text-muted-foreground">Roadmaps</span>
            <span>/</span>
            <span className="text-foreground font-medium">{roadmap.title}</span>
          </nav>

          {/* Hero Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold border border-primary/20">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Learning Roadmap
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins">
              {roadmap.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {roadmap.subtitle}. {roadmap.description}
            </p>
          </div>

          {/* Milestones List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-poppins">Step-by-Step Curriculum Milestones</h2>
            <div className="space-y-4">
              {roadmap.milestones.map((m) => (
                <div key={m.step} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-2 flex gap-4 items-start">
                  <span className="text-2xl font-extrabold text-primary/40 font-poppins shrink-0 mt-0.5">{m.step}</span>
                  <div>
                    <h3 className="text-base font-bold font-poppins text-foreground">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Action */}
          <div className="bg-card border border-border/80 rounded-3xl p-8 text-center space-y-4 shadow-md">
            <h3 className="text-xl font-bold font-poppins">Start Learning This Roadmap</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Search LearnOpto for AI-curated videos, podcasts, documentation, and courses tailored to this path.
            </p>
            <Button
              onClick={() => navigateTo(`/dashboard?q=${encodeURIComponent(roadmap.title)}`)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
            >
              Curate My Learning Feed
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
