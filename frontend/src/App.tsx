import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ProtectedRoute, GuestRoute } from "@/components/auth/ProtectedRoute";

// Code-split page components for fast initial mobile paint
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AboutCreator = lazy(() => import("./pages/AboutCreator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const RoadmapDetail = lazy(() => import("./pages/RoadmapDetail"));
const FeatureDetail = lazy(() => import("./pages/FeatureDetail"));
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

const sanitizeSlug = (slug: string) => slug.replace(/[^a-zA-Z0-9_.-]/g, "");

const renderPage = (path: string) => {
  const normalized = normalizePath(path);

  if (normalized === "/") return <Index />;
  if (normalized === "/dashboard") {
    return (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    );
  }
  if (normalized === "/login" || normalized === "/signup") {
    return (
      <GuestRoute>
        <Login />
      </GuestRoute>
    );
  }
  if (normalized === "/about") return <AboutCreator />;
  if (normalized === "/faq") return <FAQ />;
  if (normalized === "/privacy") return <PrivacyPolicy />;
  if (normalized === "/terms") return <TermsOfService />;

  // Dynamic parameterized routes with sanitization
  if (normalized.startsWith("/topics/")) {
    const rawSlug = normalized.replace("/topics/", "");
    const slug = sanitizeSlug(rawSlug);
    return <TopicDetail slug={slug} />;
  }

  if (normalized.startsWith("/roadmaps/")) {
    const rawSlug = normalized.replace("/roadmaps/", "");
    const slug = sanitizeSlug(rawSlug);
    return <RoadmapDetail slug={slug} />;
  }

  if (normalized.startsWith("/features/")) {
    const rawSlug = normalized.replace("/features/", "");
    const slug = sanitizeSlug(rawSlug);
    return <FeatureDetail slug={slug} />;
  }

  return <NotFound />;
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

      // Prevent security vulnerabilities like javascript: or data: URIs
      if (href.trim().toLowerCase().startsWith("javascript:") || href.trim().toLowerCase().startsWith("data:")) {
        event.preventDefault();
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        event.preventDefault();
        window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
        syncPath();
      } catch {
        // Invalid URL ignore
      }
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
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatedRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
