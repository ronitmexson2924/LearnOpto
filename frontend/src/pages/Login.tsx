import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, TrendingUp, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, reloadCurrentPage } from "@/lib/navigation";
import { SEOHead } from "@/components/seo/SEOHead";

type AuthState = "IDLE" | "AUTHENTICATING" | "GRANTED" | "DENIED";

const Login = () => {
  const [authState, setAuthState] = useState<AuthState>("IDLE");
  const { toast } = useToast();

  // Check for success or error from backend OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");

    if (success) {
      navigateTo("/login", { replace: true });
      setAuthState("GRANTED");
    } else if (error) {
      navigateTo("/login", { replace: true });
      setAuthState("DENIED");
    }
  }, []);

  // Check if user is already authenticated
  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (userProfile && authState === "IDLE") {
      setAuthState("GRANTED");
    }
  }, [userProfile, authState]);

  // Handle DENIED redirect timeout
  useEffect(() => {
    if (authState === "DENIED") {
      const timeout = setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Login failed or was cancelled. Please try again.",
        });
        setAuthState("IDLE");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [authState, toast]);

  const handleGoogleLogin = () => {
    setAuthState("AUTHENTICATING");
    setTimeout(() => {
      window.location.href = "http://localhost:3000/api/auth/google/login";
    }, 300);
  };

  const handleGithubLogin = () => {
    setAuthState("AUTHENTICATING");
    setTimeout(() => {
      window.location.href = "http://localhost:3000/api/auth/github/login";
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      <SEOHead
        title="Sign In & Authentication — LearnOpto"
        description="Sign in to LearnOpto with Google OAuth 2.0, GitHub OAuth, or WebAuthn Passkeys to access your personalized library, saved resources, and search history."
        canonicalUrl="https://learnopto.com/login"
      />
      {/* Ambient gradient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between z-10 border-b border-border/40">
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

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Split-Screen Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* Left Column: Branding & Feature List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-6 sm:space-y-8"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-poppins tracking-tight">LearnOpto</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-3 sm:mb-4 font-poppins">
                Master anything,<br />
                <span className="text-primary">faster.</span>
              </h1>

              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                Join the next generation of learners using AI to curate perfect study paths.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-accent flex items-center justify-center text-primary shrink-0 shadow-sm mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground font-poppins">AI-Curated Resources</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Get personalized reading lists and courses tailored to your exact goal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-accent flex items-center justify-center text-primary shrink-0 shadow-sm mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground font-poppins">Personal Library</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Organize your materials, highlight key insights, and build a second brain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-accent flex items-center justify-center text-primary shrink-0 shadow-sm mt-0.5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground font-poppins">Track Progress</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Visualize your learning journey and stay motivated with adaptive milestones.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {authState === "IDLE" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center text-center"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-poppins mb-2">
                      Join LearnOpto
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed">
                      Build your personalized learning curriculum in seconds.
                    </p>

                    {/* OAuth Action Buttons (Google & GitHub strictly) */}
                    <div className="w-full space-y-3.5 mb-6">
                      <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-12 bg-background border border-border text-foreground hover:bg-muted font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>

                      <Button
                        type="button"
                        onClick={handleGithubLogin}
                        variant="outline"
                        className="w-full h-12 border-border text-foreground hover:bg-muted font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Continue with GitHub
                      </Button>
                    </div>

                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-4">
                      By signing in, you agree to our Terms of Service & Privacy Policy.
                    </p>
                  </motion.div>
                )}

                {authState === "AUTHENTICATING" && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                      <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 font-poppins">Authenticating</h3>
                    <p className="text-xs text-muted-foreground">Redirecting to secure authorization...</p>
                  </motion.div>
                )}

                {authState === "GRANTED" && (
                  <motion.div
                    key="granted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onAnimationComplete={() => navigateTo("/dashboard")}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 font-poppins">Access Granted</h3>
                    <p className="text-xs text-muted-foreground">Taking you to your dashboard...</p>
                  </motion.div>
                )}

                {authState === "DENIED" && (
                  <motion.div
                    key="denied"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 font-poppins">Authentication Failed</h3>
                    <p className="text-xs text-muted-foreground">Returning to login...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-border/40 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
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
};

export default Login;
