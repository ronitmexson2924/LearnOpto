import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigateTo, reloadCurrentPage } from "@/lib/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { API_BASE_URL } from "@/lib/api";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refetchUser } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      await refetchUser();
      toast({ title: "Account Created", description: "Welcome to LearnOpto!" });
      navigateTo("/dashboard");
    } catch (error: unknown) {
      toast({
        title: "Signup Error",
        description: getErrorMessage(error, "Signup failed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground font-inter relative overflow-hidden">
      {/* Ambient gradient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-10 border-b border-border/40">
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
            onClick={() => navigateTo("/login")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Log in
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-md bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight font-poppins">Create an account</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Start discovering AI-curated learning resources
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 rounded-xl border-border bg-background focus-visible:ring-primary/20 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 rounded-xl border-border bg-background focus-visible:ring-primary/20 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigateTo("/login")}
                className="text-primary font-medium hover:underline"
              >
                Log in
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LearnOpto. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Signup;
