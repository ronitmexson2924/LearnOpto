import { useEffect } from "react";
import { Sparkles, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title="Page Not Found (404) — LearnOpto"
        description="The page you are looking for does not exist. Return to LearnOpto to discover AI-curated learning resources."
        noindex={true}
      />

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
        <ThemeToggle />
      </header>

      {/* 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
          <SearchX className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-primary/30 font-poppins mb-2">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold font-poppins text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Head back to LearnOpto and discover AI-curated learning resources.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigateTo("/")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigateTo("/faq")}
            variant="outline"
            className="rounded-xl border-border text-sm font-medium text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
          >
            Visit FAQ
          </Button>
        </div>
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
};

export default NotFound;
