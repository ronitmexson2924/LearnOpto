import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatePasskey } from "@/hooks/usePasskey";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MatrixRain } from "@/components/MatrixRain";
import { EnergyBurst } from "@/components/EnergyBurst";

type AuthState = "IDLE" | "AUTHENTICATING" | "GRANTED" | "DENIED";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

const Login = () => {
  const [authState, setAuthState] = useState<AuthState>("IDLE");
  const [blink, setBlink] = useState(true);
  const [fakeTokens, setFakeTokens] = useState({ auth: "NULL", session: "0X882A_FF01" });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { mutateAsync: loginWithPasskey, isPending: isPasskeyPending } = useAuthenticatePasskey();

  const isAnimating = authState !== "IDLE";

  // Check for success or error from backend redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const error = params.get("error");

    if (success) {
      // Backend authenticated successfully via HttpOnly cookie
      
      // Clean up the URL so it looks nice
      navigate("/login", { replace: true });
      
      // Jump straight to the GRANTED animation
      setAuthState("GRANTED");
    } else if (error) {
      // Clean up the URL
      navigate("/login", { replace: true });
      
      // Show the DENIED animation instead of just a toast
      setAuthState("DENIED");
    }
  }, [location, toast, navigate]);

  // Check if already authenticated
  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    // If the backend /me endpoint confirms we are already logged in, show the animation and redirect
    if (userProfile && authState === "IDLE") {
      setAuthState("GRANTED");
    }
  }, [userProfile, authState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle GRANTED token tick animation
  useEffect(() => {
    if (authState === "GRANTED") {
      let ticks = 0;
      const interval = setInterval(() => {
        setFakeTokens({
          auth: Math.random().toString(16).substr(2, 16).toUpperCase(),
          session: Math.random().toString(16).substr(2, 16).toUpperCase(),
        });
        ticks++;
        // Speed up the tick animation by finishing after only 5 ticks (200ms)
        if (ticks > 5) clearInterval(interval);
      }, 40);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [authState]);

  // Handle DENIED → show error animation, then redirect to landing page
  useEffect(() => {
    if (authState === "DENIED") {
      // Show the error animation for 2.5 seconds, then redirect to landing page
      const timeout = setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Google authentication failed or was cancelled.",
        });
        navigate("/");
      }, 2500);
      
      return () => clearTimeout(timeout);
    }
  }, [authState, navigate, toast]);

  const handleGoogleLogin = () => {
    // Redirect directly to backend to start the OAuth Authorization Code flow
    setAuthState("AUTHENTICATING");
    // Small delay to let the animation start before we navigate away
    setTimeout(() => {
      window.location.href = "http://localhost:3000/api/auth/google/login";
    }, 300);
  };

  const handlePasskeyLogin = async () => {
    setAuthState("AUTHENTICATING");
    try {
      await loginWithPasskey();
      setAuthState("GRANTED");
    } catch (error: any) {
      setAuthState("DENIED");
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`min-h-screen flex flex-col bg-[#0a0a0a] bg-grid-pattern font-inter overflow-hidden transition-colors duration-1000 ${isAnimating ? 'cursor-none' : ''}`}
    >
      <MatrixRain active={isAnimating} />
      <EnergyBurst active={authState === "GRANTED"} />

      {/* Top Header */}
      <motion.header variants={itemVariants} className={`w-full p-6 flex justify-between items-center z-10 relative transition-opacity duration-1000 ${isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100 border-b border-white/10'}`}>
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">LearnOpto</h1>
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
          System Status: <span className="text-primary font-bold">Operational</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-4 z-10">
        
        {/* Glow behind card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ 
            opacity: 1, 
            scale: 1,
            backgroundColor: authState === "DENIED" ? 'rgba(255, 0, 0, 0.1)' : undefined
          }} 
          transition={{ duration: 1.5, delay: 0.5 }} 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] blur-[120px] pointer-events-none ${authState === "DENIED" ? 'bg-red-500/10' : 'bg-primary/10'}`}
        />

        {/* Central Auth Container */}
        <motion.div 
          animate={{ 
            width: authState === "IDLE" ? 450 : 300,
            height: authState === "IDLE" ? 'auto' : 300,
            padding: authState === "IDLE" ? 48 : 0,
            borderColor: authState === "GRANTED" ? '#00ff66' : authState === "DENIED" ? '#ff3333' : '#ffffff',
            boxShadow: authState === "GRANTED" 
              ? '0 0 40px rgba(0, 255, 102, 0.4)' 
              : authState === "DENIED"
              ? '0 0 40px rgba(255, 51, 51, 0.4)'
              : authState === "IDLE" 
              ? '8px 8px 0px #00ff66' 
              : '0px 0px 0px #00ff66'
          }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          className={`bg-[#111111] border relative flex flex-col justify-center items-center overflow-hidden ${authState === "IDLE" ? 'p-8 md:p-12 shadow-[8px_8px_0px_#00ff66]' : 'p-0 shadow-none'}`}
        >
          {/* Corner Brackets (Only visible when animating) */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Top Left */}
                <div className={`absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 ${authState === "DENIED" ? 'border-red-500/80' : 'border-primary/80'}`} />
                {/* Top Right */}
                <div className={`absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 ${authState === "DENIED" ? 'border-red-500/80' : 'border-primary/80'}`} />
                {/* Bottom Left */}
                <div className={`absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 ${authState === "DENIED" ? 'border-red-500/80' : 'border-primary/80'}`} />
                {/* Bottom Right */}
                <div className={`absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 ${authState === "DENIED" ? 'border-red-500/80' : 'border-primary/80'}`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* IDLE STATE CONTENT */}
          <AnimatePresence mode="wait">
            {authState === "IDLE" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                className="w-full flex flex-col"
              >
                <div className="mb-8 self-start">
                  <span className="bg-primary text-black font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                    Access Protocol
                  </span>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4 font-inter">
                  System<br />Entrance.
                </h2>
                
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground leading-relaxed mb-12">
                  Initialize session for optical intelligence platform v4.0.2
                  <span className={`inline-block w-2 h-4 bg-primary align-middle ml-2 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
                </p>

                <div className="flex flex-col gap-4 mb-16 w-full">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isPasskeyPending}
                    className="w-full h-14 bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Log in with Google
                  </button>

                  <button
                    onClick={handlePasskeyLogin}
                    disabled={isPasskeyPending}
                    className="w-full h-14 bg-transparent border border-primary text-primary font-bold text-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      <path d="M12 15v2"></path>
                    </svg>
                    Continue with Passkey
                  </button>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                    AES-256 Encrypted Gateway
                  </span>
                </div>
              </motion.div>
            )}

            {/* AUTHENTICATING STATE CONTENT */}
            {authState === "AUTHENTICATING" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 mb-6 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent flex items-center justify-center relative shadow-[0_0_20px_#00ff66]"
                >
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <span className="text-4xl font-bold font-inter text-white">G</span>
                </motion.div>
                <span className="text-primary font-mono tracking-widest uppercase text-sm">Authenticating...</span>
              </motion.div>
            )}

            {/* GRANTED STATE CONTENT */}
            {authState === "GRANTED" && (
              <motion.div
                key="granted"
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onAnimationComplete={() => navigate("/dashboard")}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 mb-6 flex items-center justify-center bg-primary/20 rounded-full shadow-[0_0_30px_#00ff66]">
                  <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary font-mono tracking-widest uppercase text-sm">Access Granted</span>
              </motion.div>
            )}

            {/* DENIED STATE CONTENT */}
            {authState === "DENIED" && (
              <motion.div
                key="denied"
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(255, 51, 51, 0.3)',
                      '0 0 40px rgba(255, 51, 51, 0.6)',
                      '0 0 20px rgba(255, 51, 51, 0.3)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-24 h-24 mb-6 flex items-center justify-center bg-red-500/20 rounded-full"
                >
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.div>
                <span className="text-red-500 font-mono tracking-widest uppercase text-sm">Authentication Failed</span>
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.5 }}
                  className="text-red-400/60 font-mono tracking-widest uppercase text-[10px] mt-2"
                >
                  Redirecting...
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          
        {/* Below Card Meta Info */}
        <motion.div variants={itemVariants} className="flex justify-between w-full max-w-md mt-6 px-2">
          <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${authState === "GRANTED" ? 'text-primary' : authState === "DENIED" ? 'text-red-500/50' : 'text-white/20'}`}>
            Auth_Token: {fakeTokens.auth}
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${authState === "GRANTED" ? 'text-primary' : authState === "DENIED" ? 'text-red-500/50' : 'text-white/20'}`}>
            Session_ID: {fakeTokens.session}
          </span>
        </motion.div>

      </main>

      {/* Bottom Footer */}
      <motion.footer variants={itemVariants} className={`w-full p-6 flex flex-col md:flex-row justify-between items-center z-10 gap-4 transition-opacity duration-1000 ${isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100 border-t border-white/10'}`}>
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
          © 2024 LearnOpto Core. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Status</a>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Login;
