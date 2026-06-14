import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterPasskey } from "@/hooks/usePasskey";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, X, Fingerprint, Loader2 } from "lucide-react";

export function PasskeySetupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: registerPasskey, isPending } = useRegisterPasskey();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has already dismissed the prompt
    const dismissed = localStorage.getItem("passkeyPromptDismissed");
    if (!dismissed) {
      // Small delay so it doesn't pop up immediately on dashboard load
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("passkeyPromptDismissed", "true");
    setIsOpen(false);
  };

  const handleCreatePasskey = async () => {
    try {
      await registerPasskey();
      toast({
        title: "Passkey Created!",
        description: "Your account is now secured with a Passkey.",
      });
      localStorage.setItem("passkeyPromptDismissed", "true"); // Prevent showing again
      setIsOpen(false);
      // You could also optionally trigger a query invalidation if the dashboard lists passkeys
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Could not register your passkey.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative"
            >
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isPending}
              >
                <X size={20} />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Fingerprint className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Secure your account</h2>
                <p className="text-muted-foreground mb-8">
                  Add a Passkey for seamless, passwordless login using Face ID, Touch ID, or Windows Hello.
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={handleCreatePasskey}
                    disabled={isPending}
                    className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Create Passkey
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDismiss}
                    disabled={isPending}
                    className="w-full h-12 bg-transparent text-foreground font-bold rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
