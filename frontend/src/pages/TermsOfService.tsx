import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateBack } from "@/lib/navigation";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      {/* Background ambient lighting */}
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
              <FileText className="w-3.5 h-3.5 text-primary" /> Legal Framework
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: August 2026 · Standard terms governing platform usage
            </p>
          </div>

          {/* Section 1: Acceptance & Service Description */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" /> 1. Platform Purpose & Acceptance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              By logging into or utilizing LearnOpto, you agree to these Terms of Service. LearnOpto is an AI-assisted search and curation engine designed to assist users in discovering high-quality educational videos, podcasts, articles, and documentation.
            </p>
          </div>

          {/* Section 2: AI Curation & Third-Party Content Disclaimer */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-primary" /> 2. AI Curation & External Links
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              LearnOpto utilizes Google Gemini 2.5 Flash and parallel automated URL verification to index and validate external learning materials. Please note:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-2 pl-2">
              <li>LearnOpto does not host or store external video, podcast, or document content on our servers. All resources belong to their respective creators and copyright owners.</li>
              <li>While our backend automatically validates URL availability, external sites may change content or availability independently.</li>
            </ul>
          </div>

          {/* Section 3: User Accounts & Acceptable Use */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold font-poppins flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" /> 3. Account Responsibilities
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Users authenticate via authorized Google or GitHub OAuth providers. You agree not to attempt to reverse engineer, bypass security controls, or flood API endpoints with malicious requests.
            </p>
          </div>

          {/* Section 4: Contact */}
          <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            For inquiries regarding our Terms of Service, contact support@learnopto.dev.
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
