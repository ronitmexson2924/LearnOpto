import { motion } from "framer-motion";
import { Sparkles, Code2, Cpu, Rocket, ArrowLeft, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateBack, reloadCurrentPage } from "@/lib/navigation";

import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationSchema } from "@/components/seo/schemaHelpers";

export default function AboutCreator() {
  const orgSchema = buildOrganizationSchema();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title="About Ronit Mexson — Creator & Architect of LearnOpto"
        description="Learn about Ronit Mexson, creator of LearnOpto. Built to solve search fatigue by organizing video courses, technical documentation, podcasts, and roadmaps with AI."
        canonicalUrl="https://learnopto.site/about"
      />
      <JsonLd data={orgSchema} />
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            reloadCurrentPage();
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Behind LearnOpto
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-poppins">
              About the Creator & Vision
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Empowering self-directed learners with AI-curated study paths, replacing search fatigue with structured knowledge.
            </p>
          </div>

          {/* Creator Profile Card */}
          <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Creator Photo */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-primary/10 blur-sm group-hover:opacity-100 transition-opacity" />
                <img
                  src="/creator.jpg"
                  alt="Ronit Mexson - Creator of LearnOpto"
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
                />
              </div>

              <div className="space-y-4 text-center sm:text-left flex-1">
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-foreground">Ronit Mexson</h2>
                  <p className="text-xs font-semibold text-primary mt-1">Creator & Lead Architect of LearnOpto</p>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  LearnOpto was conceived out of a personal pain point: spending more time looking for high-quality, relevant tutorial videos, podcasts, and documentation than actually learning. By leveraging Gemini 2.5 Flash and real-time URL validation, LearnOpto transforms raw curiosity into personalized learning roadmaps.
                </p>

                <div className="pt-2">
                  <a
                    href="https://ronitmexson.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Creator Portfolio
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-poppins text-foreground flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Core Technology Stack
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Frontend", desc: "React 18, Vite, TailwindCSS, Framer Motion, React Query" },
                { title: "Backend", desc: "Node.js, Express, TypeScript, Helmet security" },
                { title: "Database & ORM", desc: "PostgreSQL with Prisma Client & migrations" },
                { title: "AI Intelligence", desc: "Google Gemini 2.5 Flash & Parallel HEAD URL Verification" },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-poppins">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Roadmap / AI Model Training Vision */}
          <div className="bg-accent/40 border border-primary/20 rounded-3xl p-8 sm:p-10 space-y-4">
            <h3 className="text-lg font-bold font-poppins text-foreground flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" /> Future AI Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We are building toward an adaptive recommendation model. By safely analyzing anonymized search topics, resource interactions, and user format preferences, LearnOpto will soon predict what you should study next — creating an uninterrupted, personalized learning flow.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center border-t border-border/40 bg-background">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LearnOpto. Built with precision for continuous learners.
        </p>
      </footer>
    </div>
  );
}
