import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, BookOpen, Play, Headphones, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, navigateBack, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCourseSchema, buildBreadcrumbSchema, buildFAQSchema } from "@/components/seo/schemaHelpers";

interface TopicData {
  slug: string;
  name: string;
  category: string;
  description: string;
  learningObjectives: string[];
  recommendedTypes: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTopics: Array<{ name: string; slug: string }>;
}

const TOPICS: Record<string, TopicData> = {
  react: {
    slug: "react",
    name: "React & Modern Frontend Engineering",
    category: "Software Development",
    description: "Master React 18+, Server Components, Hooks, State Management, and Next.js performance optimizations with AI-curated video courses, official docs, and podcasts.",
    learningObjectives: [
      "Understand Component Lifecycle, Virtual DOM, and Concurrent React 18 features",
      "Master useState, useEffect, useMemo, useCallback, and Custom Hooks",
      "Implement robust state management with React Query, Zustand, or Redux Toolkit",
      "Optimize web vital metrics (LCP, INP, CLS) and code-splitting",
    ],
    recommendedTypes: ["Official Documentation", "Video Tutorials", "Interactive Code Sandboxes", "Audio Interviews"],
    faq: [
      {
        question: "What is the best way to learn React in 2026?",
        answer: "Start with the official interactive React docs, practice building real-world component projects, and follow structured video roadmaps for state management and server components.",
      },
      {
        question: "Does LearnOpto search for free React courses?",
        answer: "Yes! LearnOpto aggregates free YouTube courses, GitHub repositories, official documentation, and open-access podcasts with zero paywalls.",
      },
    ],
    relatedTopics: [
      { name: "TypeScript", slug: "typescript" },
      { name: "Frontend Development", slug: "frontend-development" },
      { name: "Next.js", slug: "nextjs" },
    ],
  },
  python: {
    slug: "python",
    name: "Python Programming & Data Science",
    category: "Programming Languages",
    description: "Learn Python from fundamentals to advanced Data Science, Machine Learning, Web Development (FastAPI/Django), and automation scripts.",
    learningObjectives: [
      "Master Python syntax, object-oriented programming (OOP), and type hinting",
      "Build REST APIs with FastAPI and Django",
      "Manipulate data with Pandas, NumPy, and Matplotlib",
      "Deploy scalable Python applications with Docker and cloud services",
    ],
    recommendedTypes: ["Interactive Notebooks", "Video Playlists", "Documentation", "Deep-Dive Podcasts"],
    faq: [
      {
        question: "Is Python beginner-friendly for new developers?",
        answer: "Yes, Python features clean syntax and readable code, making it the top choice for beginners in web development, automation, and AI.",
      },
    ],
    relatedTopics: [
      { name: "Machine Learning", slug: "machine-learning" },
      { name: "Backend Development", slug: "backend-development" },
      { name: "Data Science", slug: "data-science" },
    ],
  },
  "system-design": {
    slug: "system-design",
    name: "System Design & Distributed Systems",
    category: "Software Architecture",
    description: "Master high-availability architecture, microservices, load balancing, database sharding, caching strategies, and message queues.",
    learningObjectives: [
      "Design scalable, fault-tolerant distributed web architectures",
      "Master Caching strategies (Redis, Memcached) and CDN delivery",
      "Understand SQL vs. NoSQL, database sharding, and replication",
      "Implement event-driven architecture using Kafka and RabbitMQ",
    ],
    recommendedTypes: ["Architecture Diagrams", "Video Case Studies", "Technical Papers", "Whitepapers"],
    faq: [
      {
        question: "How do I prepare for System Design interviews?",
        answer: "Study real-world case studies (Uber, Netflix, Twitter architecture), practice drawing component diagrams, and understand latency vs. throughput trade-offs.",
      },
    ],
    relatedTopics: [
      { name: "Cloud Computing", slug: "cloud-computing" },
      { name: "Backend Development", slug: "backend-development" },
      { name: "DevOps & Docker", slug: "docker" },
    ],
  },
  "machine-learning": {
    slug: "machine-learning",
    name: "Machine Learning & AI Engineering",
    category: "Artificial Intelligence",
    description: "Explore Deep Learning, Neural Networks, Natural Language Processing (NLP), Large Language Models (LLMs), PyTorch, and TensorFlow.",
    learningObjectives: [
      "Understand Supervised and Unsupervised Learning algorithms",
      "Train Neural Networks with PyTorch and PyTorch Lightning",
      "Fine-tune LLMs and build RAG (Retrieval-Augmented Generation) systems",
      "Deploy AI models into production environments",
    ],
    recommendedTypes: ["Video Lectures", "Jupyter Notebooks", "Research Papers", "Audio Podcasts"],
    faq: [
      {
        question: "What prerequisites do I need for Machine Learning?",
        answer: "Linear Algebra, Calculus, Statistics, and intermediate Python programming with NumPy and Pandas.",
      },
    ],
    relatedTopics: [
      { name: "Python", slug: "python" },
      { name: "System Design", slug: "system-design" },
      { name: "AI Engineering", slug: "ai-engineering" },
    ],
  },
};

export default function TopicDetail({ slug = "react" }: { slug?: string }) {
  const normalizedSlug = slug.toLowerCase();
  const topic = TOPICS[normalizedSlug] || {
    slug: normalizedSlug,
    name: `${normalizedSlug.toUpperCase()} Learning Path`,
    category: "General Technology",
    description: `Discover top handpicked resources, videos, documentation, and tutorials to master ${normalizedSlug}.`,
    learningObjectives: [
      `Master core fundamentals of ${normalizedSlug}`,
      "Build production-quality hands-on projects",
      "Follow industry best practices and architecture patterns",
    ],
    recommendedTypes: ["Video Tutorials", "Documentation", "Podcasts", "Courses"],
    faq: [
      {
        question: `How does LearnOpto curate ${normalizedSlug} resources?`,
        answer: `LearnOpto uses AI analysis and live reachability checks to discover the highest quality tutorials and documentation for ${normalizedSlug}.`,
      },
    ],
    relatedTopics: [
      { name: "React", slug: "react" },
      { name: "Python", slug: "python" },
      { name: "System Design", slug: "system-design" },
    ],
  };

  const courseSchema = buildCourseSchema({
    name: topic.name,
    description: topic.description,
    provider: "LearnOpto",
    category: topic.category,
    url: `https://learnopto.site/topics/${topic.slug}`,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics/react" },
    { name: "React & Modern Frontend Engineering", url: `/topics/${topic.slug}` },
  ]);

  const faqSchema = buildFAQSchema(topic.faq);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title={`${topic.name} — AI-Curated Learning Path`}
        description={topic.description}
        canonicalUrl={`https://learnopto.site/topics/${topic.slug}`}
      />
      <JsonLd data={[courseSchema, breadcrumbSchema, faqSchema]} />

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
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-2">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <span className="text-muted-foreground">Topics</span>
            <span>/</span>
            <span className="text-foreground font-medium">{topic.name}</span>
          </nav>

          {/* Hero Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold border border-primary/20">
              <BookOpen className="w-3.5 h-3.5 text-primary" /> {topic.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins">
              {topic.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {topic.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => navigateTo(`/dashboard?q=${encodeURIComponent(topic.name)}`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
              >
                <span>Search {topic.name} Resources</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-poppins text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Key Learning Objectives
            </h2>
            <ul className="space-y-2.5 pl-2">
              {topic.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Resource Formats */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-poppins">Curated Media Formats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Play, label: "Video Tutorials", desc: "Step-by-step videos and full project walk-throughs." },
                { icon: FileText, label: "Official Documentation", desc: "In-depth API guides and core reference material." },
                { icon: Headphones, label: "Tech Podcasts", desc: "Expert interviews and architectural discussions." },
                { icon: BookOpen, label: "Structured Courses", desc: "Guided syllabus and hands-on exercises." },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="bg-card border border-border/80 rounded-2xl p-5 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold font-poppins text-foreground">{label}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Topics */}
          <div className="space-y-3">
            <h2 className="text-base font-bold font-poppins">Related Learning Topics</h2>
            <div className="flex flex-wrap gap-2.5">
              {topic.relatedTopics.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/topics/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/topics/${rel.slug}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-semibold text-foreground hover:text-primary transition-all shadow-sm"
                >
                  {rel.name} →
                </a>
              ))}
            </div>
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
