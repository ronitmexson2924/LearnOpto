import { useState } from "react";
import { navigateTo, reloadCurrentPage } from "@/lib/navigation";
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
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebSiteSchema, buildOrganizationSchema, buildSoftwareApplicationSchema } from "@/components/seo/schemaHelpers";

export default function Index() {
  const featuresAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const demoAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  const [activeDemoTab, setActiveDemoTab] = useState<"all" | "video" | "docs">("all");

  const websiteSchema = buildWebSiteSchema();
  const orgSchema = buildOrganizationSchema();
  const softwareSchema = buildSoftwareApplicationSchema();

  const sampleDemoItems = [
    {
      title: "Quantum Computing for Beginners",
      desc: "Comprehensive intro to qubits, quantum gates, and algorithm basics with visual diagrams.",
      badge: "Video Course",
      source: "YouTube • IBM Quantum",
      type: "video",
      icon: Play,
    },
    {
      title: "Machine Learning Concepts Whitepaper",
      desc: "Key principles of neural networks, gradient descent, and deep learning architectures summarized.",
      badge: "PDF / Paper",
      source: "Documentation • arXiv",
      type: "docs",
      icon: FileText,
    },
    {
      title: "Clean Architecture Audio Summary",
      desc: "A concise 15-minute key takeaway guide on designing resilient software systems.",
      badge: "Audio Guide",
      source: "Audiobook • TechTalks",
      type: "video",
      icon: Headphones,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-hidden font-inter">
      <SEOHead
        title="LearnOpto — Fast, Smart & Focused Learning Engine"
        description="LearnOpto is the ultimate personal learning operating system. Aggregate, summarize, roadmap, and master knowledge faster with AI."
        canonicalUrl="https://learnopto.com"
      />
      <JsonLd data={[websiteSchema, orgSchema, softwareSchema]} />
      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[15%] w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[140px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
              <span>✨ Built for curious minds & fast learners</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] font-poppins"
            >
              Stop drowning in tabs.{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">Start actually learning.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Tell LearnOpto what you're trying to master today. We cut through the search noise to handpick the best YouTube videos, podcasts, technical docs, and courses — guaranteed live with zero dead links.
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
                className="w-full sm:w-auto h-12 px-6 text-sm font-medium border-border/80 text-foreground hover:bg-foreground hover:text-background hover:border-foreground rounded-xl transition-all duration-300"
              >
                Meet the Creator
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
              { icon: Play, label: "YouTube Tutorials" },
              { icon: Headphones, label: "Podcasts & Audio" },
              { icon: FileText, label: "Hand-Picked Docs" },
              { icon: BookOpen, label: "Structured Courses" },
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
                { number: "100%", label: "Live & Verified Links" },
                { number: "4 Formats", label: "Video, Audio, Docs & Courses" },
                { number: "Instant", label: "AI Smart Curation" },
                { number: "Free Forever", label: "No Paywalls or Ad Noise" },
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
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Why LearnOpto</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-poppins">
              Everything you need to master anything, stress-free
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Say goodbye to 45-minute search rabbit holes. LearnOpto does the heavy lifting so you can focus on building.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "Smart Multi-Source Curation",
                desc: "We bring together the best YouTube tutorials, technical documentation, podcast episodes, and structured courses into one clean view.",
              },
              {
                icon: ShieldCheck,
                title: "Zero Dead Links",
                desc: "Nothing ruins your study flow like a broken tutorial from 2014. Every link is verified live before it reaches your screen.",
              },
              {
                icon: Bookmark,
                title: "Your Personal Study Desk",
                desc: "Save the gems you discover with one click. Build an organized library of your favorite learning materials to revisit anytime.",
              },
              {
                icon: Sliders,
                title: "Learns How You Learn Best",
                desc: "Prefer watching a quick video over reading dense documentation? Fine-tune your format preferences so AI prioritizes your favorite media.",
              },
              {
                icon: BarChart3,
                title: "Track Your Momentum",
                desc: "Watch your curiosity turn into real progress. Keep track of your search history, saved items, and learning milestones over time.",
              },
              {
                icon: Lock,
                title: "Hassle-Free & Secure",
                desc: "Sign in seamlessly with 1-click Google, GitHub, or passwordless Passkeys. Your personal library stays synced across all your devices.",
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
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Simple Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-poppins">
              How LearnOpto works for you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Type your topic",
                desc: "Search whatever you're curious about — from System Design and Quantum Physics to React or French Grammar.",
              },
              {
                step: "02",
                title: "We filter the noise",
                desc: "Our AI scans top platforms, checks every URL for live reachability, and handpicks the most relevant resources.",
              },
              {
                step: "03",
                title: "Learn & Level Up",
                desc: "Dive right in without distractions. Save your favorite videos, docs, and courses to your library whenever you want.",
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
                  "I built LearnOpto because I got tired of wasting 45 minutes searching YouTube and Reddit just to find one good 10-minute tutorial. LearnOpto is designed to get you straight to the good stuff so you can spend less time searching and more time creating."
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
                    className="rounded-xl border-border text-xs sm:text-sm font-medium text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  >
                    Read Full Story
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
              Ready to supercharge your learning?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto relative z-10">
              Join thousands of self-directed learners skipping search fatigue. Jump straight into the best resources for your next goal.
            </p>
            <Button
              onClick={() => navigateTo("/login")}
              size="lg"
              className="h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-xl transition-all relative z-10"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-muted-foreground">
            <div>
              <h4 className="font-bold text-foreground font-poppins mb-3">Popular Topics</h4>
              <ul className="space-y-2">
                <li><a href="/topics/react" className="hover:text-primary transition-colors">React 18 & Next.js</a></li>
                <li><a href="/topics/python" className="hover:text-primary transition-colors">Python & Data Science</a></li>
                <li><a href="/topics/system-design" className="hover:text-primary transition-colors">System Design</a></li>
                <li><a href="/topics/machine-learning" className="hover:text-primary transition-colors">Machine Learning & AI</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground font-poppins mb-3">Learning Roadmaps</h4>
              <ul className="space-y-2">
                <li><a href="/roadmaps/frontend-development" className="hover:text-primary transition-colors">Frontend Developer</a></li>
                <li><a href="/roadmaps/backend-development" className="hover:text-primary transition-colors">Backend Architecture</a></li>
                <li><a href="/roadmaps/ai-engineering" className="hover:text-primary transition-colors">AI Engineer Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground font-poppins mb-3">Core Features</h4>
              <ul className="space-y-2">
                <li><a href="/features/ai-search" className="hover:text-primary transition-colors">AI Educational Search</a></li>
                <li><a href="/features/personal-library" className="hover:text-primary transition-colors">Personal Library</a></li>
                <li><a href="/features/roadmaps" className="hover:text-primary transition-colors">Interactive Roadmaps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground font-poppins mb-3">Platform & Legal</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="hover:text-primary transition-colors font-semibold text-primary">Frequently Asked Questions (FAQ)</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">About Creator</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground font-poppins">LearnOpto</span>
            </div>
            <p>© {new Date().getFullYear()} LearnOpto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
