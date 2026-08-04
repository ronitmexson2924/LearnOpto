import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Database, Lock, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateBack } from "@/lib/navigation";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
          className="space-y-10"
        >
          {/* Page Title */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Data Transparency & Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: August 2026 · Effective for all LearnOpto users
            </p>
          </div>

          {/* Section 1: Data We Collect */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <Database className="w-5 h-5 text-primary" /> 1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              When you interact with LearnOpto, we collect specific data to provide and refine our AI-curated learning service:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-2 pl-2">
              <li><strong>Account Identification:</strong> Email address, display name, and avatar image provided during Google or GitHub OAuth authentication.</li>
              <li><strong>Search History:</strong> Topics, keywords, and dates of learning requests submitted to our Gemini curation engine.</li>
              <li><strong>Library & Preferences:</strong> Resources you bookmark/save to your personal library and format preferences (videos, podcasts, docs, courses).</li>
              <li><strong>Interaction Telemetry:</strong> Anonymized interaction logs when you click or open curated resource links.</li>
            </ul>
          </div>

          {/* Section 2: How We Use Your Data (Future AI Model Deployment) */}
          <div className="bg-accent/30 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <Eye className="w-5 h-5 text-primary" /> 2. Purpose & Future Model Deployment
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The primary purpose of collecting your search history, saved items, and interaction data is to power our core platform features and train future intelligence systems:
            </p>
            <div className="bg-card border border-border/80 rounded-2xl p-5 text-xs sm:text-sm text-foreground font-medium leading-relaxed shadow-sm">
              "We store search histories, format preferences, and resource interaction logs specifically for the future deployment of an adaptive machine learning model. This model will analyze user progress patterns to suggest optimal 'what to study next' learning pathways."
            </div>
          </div>

          {/* Section 3: Data Security & Cookies */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <Lock className="w-5 h-5 text-primary" /> 3. Data Security & Cookies
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We employ strict security practices to safeguard your session and data:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-2 pl-2">
              <li>Authentication tokens are stored strictly in HTTP-only, encrypted JWT cookies to prevent XSS vulnerability.</li>
              <li>All API communication is transmitted over TLS/HTTPS encrypted connections.</li>
              <li>We strictly do <strong>NOT</strong> sell, rent, or trade your personal data to advertising networks or third-party brokers.</li>
            </ul>
          </div>

          {/* Section 4: Contact */}
          <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            For questions or requests regarding your data, contact privacy@learnopto.dev.
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center border-t border-border/40 bg-background">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LearnOpto. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
