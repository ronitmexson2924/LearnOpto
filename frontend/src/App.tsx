import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Code-split page components for fast initial mobile paint
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AboutCreator = lazy(() => import("./pages/AboutCreator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[50dvh] flex flex-col items-center justify-center p-6 text-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
    <span className="text-xs font-medium text-muted-foreground">Loading LearnOpto...</span>
  </div>
);

const normalizePath = (path: string) => {
  let cleaned = path.replace(/\/+/g, "/");
  if (cleaned !== "/" && cleaned.endsWith("/")) {
    return cleaned.slice(0, -1);
  }
  return cleaned;
};

const renderPage = (path: string) => {
  switch (normalizePath(path)) {
    case "/":
      return <Index />;
    case "/dashboard":
      return <Dashboard />;
    case "/login":
    case "/signup":
      return <Login />;
    case "/about":
      return <AboutCreator />;
    case "/privacy":
      return <PrivacyPolicy />;
    case "/terms":
      return <TermsOfService />;
    default:
      return <NotFound />;
  }
};

const AnimatedRoutes = () => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a[href]");
      if (!anchor) return;

      const target = anchor.getAttribute("target");
      const href = anchor.getAttribute("href");
      if (!href || target || href.startsWith("#")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      syncPath();
    };

    window.addEventListener("popstate", syncPath);
    document.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener("popstate", syncPath);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);
  
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <div key={normalizePath(path)}>{renderPage(path)}</div>
      </AnimatePresence>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedRoutes />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
