import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      toast({ title: "Success", description: "Account created successfully!" });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern p-4 font-inter">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="absolute top-20 right-[-10%] w-[30vw] h-[30vw] bg-primary rounded-full border-[6px] border-black dark:border-white shadow-brutalist-lg dark:shadow-brutalist-lg-dark translate-x-12" />
        <div className="absolute top-[40%] left-[20%] w-[10vw] h-[10vw] bg-accent border-[6px] border-black dark:border-white shadow-brutalist dark:shadow-brutalist-dark rotate-45" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-card border-4 border-black dark:border-white rounded-2xl shadow-brutalist-lg dark:shadow-brutalist-lg-dark">
        <CardHeader>
          <CardTitle className="text-3xl font-black uppercase tracking-tight text-center">Sign Up</CardTitle>
          <CardDescription className="text-center font-bold text-muted-foreground">Join LearnOpto today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 px-6 text-lg rounded-2xl border-4 border-black dark:border-white bg-card shadow-clay focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors font-bold placeholder:font-normal"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 px-6 text-lg rounded-2xl border-4 border-black dark:border-white bg-card shadow-clay focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors font-bold placeholder:font-normal"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-xl font-black uppercase tracking-wide border-4 border-black dark:border-white shadow-brutalist dark:shadow-brutalist-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none dark:hover:shadow-none transition-all rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center font-bold">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="font-black text-secondary p-0" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
