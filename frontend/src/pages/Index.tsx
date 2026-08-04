import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Search,
  BookOpen,
  Bookmark,
  ArrowRight,
  Sparkles,
  Play,
  FileText,
  Headphones,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sliders,
  BarChart3,
  Lock,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { navigateTo } from "@/lib/navigation";

export default function Index() {
  const featuresAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const demoAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  const [activeDemoTab, setActiveDemoTab] = useState<"all" | "video" | "docs">("all");

  const sampleDemoItems = [
    {
      title: "Quantum Computing for Beginners",
      source: "YouTube • IBM Quantum",
      type: "video",
      icon: Play,
      badge: "Video Tutorial",
      desc: "Comprehensive intro covering qubits, superposition, and quantum gates.",
    },
    {
      title: "Qiskit Official Documentation & Guides",
      source: "Qiskit.org",
      type: "docs",
      icon: FileText,
      badge: "Documentation",
      desc: "Interactive Python notebook guides and quantum algorithm references.",
    },
    {
      title: "The Quantum Hardware Revolution",
      source: "Podcast • Physics World",
      type: "audio",
      icon: Headphones,
      badge: "Podcast Episode",
      desc: "Deep dive into superconducting chips, ion traps, and error correction.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden font-inter bg-background text-foreground"
    >
      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[15%] w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[140px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight font-poppins">
              LearnOpto
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Button
              onClick={() => navigateTo("/login")}
              size="sm"
              className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-9 px-4 rounded-xl transition-all"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <main>
        <section className="container mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20 text-xs font-semibold text-accent-foreground shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Gemini 2.5 AI & Real-Time Link Validation</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] font-poppins"
            >
              Master any subject,{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">faster.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Tell LearnOpto what you want to learn. Our AI curates high-density YouTube videos, podcasts, documentation, and courses — automatically verified to eliminate broken links.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2"
            >
              <Button
                onClick={() => navigateTo("/login")}
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg rounded-xl transition-all flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => navigateTo("/about")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 text-sm font-medium border-border/80 text-foreground hover:bg-muted rounded-xl transition-all"
              >
                About the Vision
              </Button>
            </motion.div>
          </div>

          {/* Platform Source Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 sm:mt-16 text-muted-foreground/80"
          >
            {[
              { icon: Play, label: "YouTube Videos" },
              { icon: Headphones, label: "Podcasts & Audio" },
              { icon: FileText, label: "Official Docs" },
              { icon: BookOpen, label: "Online Courses" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Icon className="w-4 h-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── LIVE PLATFORM INTERACTIVE PREVIEW ─── */}
        <section
          ref={demoAnimation.ref}
          className={`container mx-auto px-4 sm:px-6 pb-20 transition-all duration-700 ${
            demoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-4xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-2 truncate">
                  query: "Quantum Computing Fundamentals"
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {(["all", "video", "docs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDemoTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      activeDemoTab === tab
                        ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {sampleDemoItems
                .filter((item) => activeDemoTab === "all" || item.type === activeDemoTab)
                .map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-background border border-border/70 rounded-2xl p-4 flex flex-col justify-between hover:border-primary/40 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary uppercase tracking-wider bg-accent px-2 py-0.5 rounded-md">
                            <Icon className="w-3 h-3" /> {item.badge}
                          </span>
                          <Bookmark className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground font-poppins mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/80 mt-4 block">
                        {item.source}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ─── METRICS BANNER ─── */}
        <section className="border-y border-border/50 bg-accent/20 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
              {[
                { number: "99.4%", label: "Link Validity Rate" },
                { number: "4 Formats", label: "Video, Audio, Docs & Courses" },
                { number: "< 1s", label: "Gemini 2.5 Flash Curation" },
                { number: "100% Free", label: "No Ad Noise or Paywalls" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-poppins text-primary">{stat.number}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section
          ref={featuresAnimation.ref}
          className={`container mx-auto px-4 sm:px-6 py-20 lg:py-28 transition-all duration-700 ${
            featuresAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-poppins">
              Everything you need to study effectively
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Designed to eliminate search overload and surface high-density educational content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "Multi-Source AI Curation",
                desc: "Gemini 2.5 Flash evaluates topic relevance to recommend YouTube videos, podcasts, official docs, and courses.",
              },
              {
                icon: ShieldCheck,
                title: "Parallel URL Verification",
                desc: "Automated HEAD & GET requests verify links in real-time, filtering out 404s and hallucinated URLs before you click.",
              },
              {
                icon: Bookmark,
                title: "Personal Library",
                desc: "Bookmark your favorite resources with one click to build a structured, permanent knowledge base.",
              },
              {
                icon: Sliders,
                title: "Format Weighting & Preferences",
                desc: "Tailor AI results to match your learning style — prioritize video tutorials, audio podcasts, or technical docs.",
              },
              {
                icon: BarChart3,
                title: "Activity & Search Analytics",
                desc: "Track total searches, saved items, and viewed resources over time to stay motivated.",
              },
              {
                icon: Lock,
                title: "Seamless OAuth Security",
                desc: "1-click authentication with Google & GitHub. HTTP-only secure cookies keep your session safe.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="bg-card border border-border/80 rounded-3xl p-7 hover:border-primary/40 hover:shadow-soft transition-all space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground font-poppins">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section
          ref={howItWorksAnimation.ref}
          className={`container mx-auto px-4 sm:px-6 py-20 border-t border-border/50 transition-all duration-700 ${
            howItWorksAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-14 space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-poppins">
              Three steps to curated knowledge
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Enter Topic",
                desc: "Search any subject — from System Design and Quantum Physics to React and French Grammar.",
              },
              {
                step: "02",
                title: "AI Curation & Validation",
                desc: "Gemini finds top resources while our backend verifies live URLs in parallel to guarantee reachability.",
              },
              {
                step: "03",
                title: "Learn & Save",
                desc: "Explore ranked videos, podcasts, docs, and courses. Bookmark items to your personal library anytime.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-card border border-border/80 rounded-3xl p-7 space-y-3">
                <span className="text-3xl font-extrabold text-primary/30 font-poppins">{step}</span>
                <h3 className="text-lg font-bold text-foreground font-poppins">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CREATOR HIGHLIGHT SECTION ─── */}
        <section className="container mx-auto px-4 sm:px-6 py-16 border-t border-border/50">
          <div className="max-w-4xl mx-auto bg-card border border-border/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-primary/10 blur-sm group-hover:opacity-100 transition-opacity" />
                <img
                  src="/creator.jpg"
                  alt="Ronit Mexson - Creator of LearnOpto"
                  className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
                />
              </div>

              <div className="space-y-3.5 text-center sm:text-left flex-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Meet the Creator
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins text-foreground">
                  Ronit Mexson
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Passionate developer and lead architect behind LearnOpto. Built with a vision to eliminate learning search fatigue by curating high-density AI-verified content.
                </p>

                <div className="pt-2 flex flex-wrap justify-center sm:justify-start items-center gap-3">
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

                  <Button
                    onClick={() => navigateTo("/about")}
                    variant="outline"
                    className="rounded-xl border-border text-xs sm:text-sm font-medium"
                  >
                    Read Full Vision
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section
          ref={ctaAnimation.ref}
          className={`container mx-auto px-4 sm:px-6 pb-24 transition-all duration-700 ${
            ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative bg-card border border-border/80 rounded-3xl p-10 sm:p-16 text-center overflow-hidden shadow-xl max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 relative z-10 font-poppins">
              Ready to learn smarter?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto relative z-10">
              Sign in with Google or GitHub and let AI find the best study resources for your exact goals.
            </p>
            <Button
              onClick={() => navigateTo("/login")}
              size="lg"
              className="h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-xl transition-all relative z-10"
            >
              Sign In to Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground font-poppins">LearnOpto</span>
          </div>

          <p>© {new Date().getFullYear()} LearnOpto. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="/about" className="hover:text-foreground transition-colors">About Creator</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Use</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
