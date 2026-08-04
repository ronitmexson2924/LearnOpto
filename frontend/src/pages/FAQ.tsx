import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, HelpCircle, CheckCircle2, Search, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, navigateBack, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFAQSchema, buildBreadcrumbSchema } from "@/components/seo/schemaHelpers";

const FAQS = [
  {
    question: "What is LearnOpto and how does it work?",
    answer:
      "LearnOpto is an AI-powered educational search and curation engine. When you search for any skill or topic, LearnOpto queries top learning databases, extracts verified tutorials, technical documentation, podcasts, and structured courses, checks every URL in real-time to guarantee live reachability, and organizes them into a clean, distraction-free study feed.",
  },
  {
    question: "How is LearnOpto different from searching YouTube or Google directly?",
    answer:
      "Generic search engines prioritize ad revenue, clickbait thumbnails, and engagement algorithms. LearnOpto eliminates search noise by evaluating content specifically for educational depth, reachability, and format variety (videos, podcasts, docs, courses), saving learners up to 45 minutes of search fatigue per session.",
  },
  {
    question: "How does LearnOpto rank and curate learning resources?",
    answer:
      "LearnOpto evaluates content using Gemini 2.5 AI algorithms combined with automated network reachability validation. Resources are scored based on topic relevance, domain authority, format clarity, and user format preferences.",
  },
  {
    question: "Is LearnOpto free to use?",
    answer:
      "Yes! LearnOpto offers free access to AI resource curation, search history, format weighting, and personal library bookmarking.",
  },
  {
    question: "How does LearnOpto verify zero dead links?",
    answer:
      "Before presenting any resource in your learning feed, LearnOpto's backend performs automated HTTP HEAD requests and DNS safety checks to verify that every URL is active, reachable, and free from malware or broken redirections.",
  },
  {
    question: "Can I customize which media formats I receive?",
    answer:
      "Absolutely. In your dashboard, you can toggle format preferences between Videos, Podcasts, Technical Documentation, and Courses. LearnOpto adjusts its AI weighting to match your preferred style.",
  },
  {
    question: "How does the Personal Library bookmarking feature work?",
    answer:
      "When logged in, clicking the bookmark icon on any card instantly saves the resource to your private library. Your saved items remain synced across all your desktop, tablet, and mobile devices.",
  },
  {
    question: "What login methods does LearnOpto support?",
    answer:
      "LearnOpto supports 1-click Google OAuth 2.0, GitHub OAuth 2.0, and passwordless FIDO2 / WebAuthn Passkey authentication with HTTP-Only cookie security.",
  },
];

export default function FAQ() {
  const faqSchema = buildFAQSchema(FAQS);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title="Frequently Asked Questions (FAQ) — LearnOpto AI Platform"
        description="Find answers to common questions about LearnOpto's AI search engine, zero dead link verification, resource ranking algorithms, personal library bookmarking, and security."
      />
      <JsonLd data={[faqSchema, breadcrumbSchema]} />

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
            <span className="text-foreground font-medium">FAQ</span>
          </nav>

          {/* Page Hero */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
              <HelpCircle className="w-3.5 h-3.5 text-primary" /> Comprehensive FAQ
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Everything you need to know about LearnOpto's AI search, resource validation, security, and learning roadmaps.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all space-y-2"
              >
                <h3 className="text-base font-bold font-poppins text-foreground flex items-start gap-2.5">
                  <span className="text-primary font-mono text-sm mt-0.5">{index + 1}.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="bg-card border border-border/80 rounded-3xl p-8 text-center space-y-4 shadow-md">
            <h3 className="text-xl font-bold font-poppins">Ready to experience AI-powered learning?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Start searching top videos, podcasts, docs, and courses without search noise.
            </p>
            <Button
              onClick={() => navigateTo("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
            >
              Start Searching Free
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-border/40 bg-background">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnOpto. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/about" className="hover:text-foreground transition-colors">About Creator</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
