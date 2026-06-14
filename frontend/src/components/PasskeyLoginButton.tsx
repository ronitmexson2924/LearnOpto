import { useAuthenticatePasskey } from "@/hooks/usePasskey";
import { useToast } from "@/hooks/use-toast";
import { Fingerprint, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PasskeyLoginButton() {
  const { mutateAsync: loginWithPasskey, isPending } = useAuthenticatePasskey();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithPasskey();
      toast({
        title: "Authenticated",
        description: "Successfully logged in with Passkey.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not authenticate with your passkey.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isPending}
      className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-border rounded-lg text-foreground bg-card hover:bg-muted transition-colors font-medium relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
      ) : (
        <Fingerprint className="w-5 h-5 text-primary relative z-10" />
      )}
      <span className="relative z-10">Continue with Passkey</span>
    </button>
  );
}
