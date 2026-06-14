import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { ResourceCard } from "@/components/ResourceCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Folder, Clock, Sparkles, Fingerprint } from "lucide-react";
import { PasskeySetupModal } from "@/components/PasskeySetupModal";
import { usePasskeys, useRemovePasskey } from "@/hooks/usePasskey";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "youtube" | "podcast" | "documentation" | "course";
}

interface SearchQuery {
  id: string;
  query: string;
  createdAt: string;
  resources: Resource[];
}

// --- Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 24 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      delay: i * 0.07,
    },
  }),
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.2 } },
};

const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 22,
      delay: 0.3 + i * 0.08,
    },
  }),
};

const TYPE_STYLES: Record<string, { label: string; accent: string; bg: string; text: string }> = {
  youtube:       { label: "YouTube",       accent: "#ef4444", bg: "rgba(239,68,68,0.08)",   text: "#f87171" },
  podcast:       { label: "Podcast",       accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)", text: "#a78bfa" },
  documentation: { label: "Docs",          accent: "#00ff88", bg: "rgba(0,255,136,0.08)",   text: "#00ff88" },
  course:        { label: "Course",        accent: "#f59e0b", bg: "rgba(245,158,11,0.08)",  text: "#fbbf24" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeFeedId, setActiveFeedId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Resource[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: passkeys } = usePasskeys();
  const { mutate: removePasskey } = useRemovePasskey();

  // Fetch History
  const { data: historyData, isLoading: isLoadingHistory } = useQuery<{ history: SearchQuery[] }>({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/search/history", {
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
  });

  const history = historyData?.history || [];

  // Determine what resources to show in the feed
  let displayResources: Resource[] = [];
  if (searchResults) {
    displayResources = searchResults;
  } else if (activeFeedId) {
    const activeQuery = history.find((q) => q.id === activeFeedId);
    if (activeQuery) displayResources = activeQuery.resources;
  } else if (history.length > 0) {
    displayResources = history[0].resources;
  }

  // Filter resources by type
  const filteredResources =
    activeFilter === "all"
      ? displayResources
      : displayResources.filter((r) => {
          if (activeFilter === "video") return r.type === "youtube";
          if (activeFilter === "audio") return r.type === "podcast";
          if (activeFilter === "docs") return r.type === "documentation";
          if (activeFilter === "course") return r.type === "course";
          return true;
        });

  // Search Mutation
  const searchMutation = useMutation({
    mutationFn: async (topic: string) => {
      const res = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ topic }),
      });
      if (res.status === 401) {
        navigate("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.resources);
      setActiveFeedId(null);
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (topic: string) => {
    searchMutation.mutate(topic);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const FILTERS = [
    { key: "all",    label: "All" },
    { key: "video",  label: "Video" },
    { key: "audio",  label: "Audio" },
    { key: "docs",   label: "Docs" },
    { key: "course", label: "Course" },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen font-inter overflow-x-hidden bg-background text-foreground"
    >
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <motion.header
        variants={headerVariants}
        className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8 h-16"
      >
        {/* Logo only */}
        <a
          href="/"
          style={{
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          <span className="text-foreground">Learn</span><span className="text-primary">Opto</span>
        </a>

        <ThemeToggle />
      </motion.header>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4rem", paddingBottom: "2rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
        {/* Hero */}
        <motion.div variants={sectionVariants} style={{ marginBottom: "2.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "hsl(var(--primary))",
              marginBottom: "1.5rem",
              background: "hsl(var(--primary) / 0.1)",
              padding: "6px 14px",
              border: "1px solid hsl(var(--primary) / 0.2)",
              borderRadius: "9999px",
              fontWeight: "bold",
            }}
          >
            [ COMMAND CENTER / 001 ]
          </p>
          <h1
            style={{
              fontSize: "clamp(32px,5vw,56px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "800px",
              marginBottom: "1rem",
            }}
            className="text-foreground"
          >
            Discover high-fidelity resources <br />
            <span className="text-muted-foreground">
              for your optimization flow.
            </span>
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div variants={sectionVariants} style={{ marginBottom: "1.5rem", width: "100%", maxWidth: "800px" }}>
          <SearchBar onSearch={handleSearch} isLoading={searchMutation.isPending} />
        </motion.div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          minHeight: "calc(100vh - 56px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
        className="border-t border-border"
      >
        {/* ── Left column ──────────────────────────────────────── */}
        <div
          style={{ padding: "2.5rem 2rem" }}
          className="border-r border-border"
        >

          {/* Feed header */}
          <motion.div variants={sectionVariants}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "1rem",
                marginBottom: "2rem",
              }}
              className="border-b border-border"
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  color: "hsl(var(--primary))",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "hsl(var(--primary) / 0.1)",
                  padding: "4px 8px",
                  border: "1px solid hsl(var(--primary) / 0.2)",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "hsl(var(--primary))",
                    display: "inline-block",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                CURATED_FEED.LOG
              </span>

              {/* Filters */}
              <div style={{ display: "flex", gap: "6px" }}>
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      border: `1px solid ${activeFilter === f.key ? "hsl(var(--primary))" : "transparent"}`,
                      color: activeFilter === f.key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      background: activeFilter === f.key ? "hsl(var(--primary) / 0.1)" : "transparent",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "all 0.15s",
                      fontWeight: "bold",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            {searchMutation.isPending ? (
              <div
                style={{
                  padding: "5rem",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "hsl(var(--primary))",
                  letterSpacing: "0.12em",
                  border: "1px dashed hsl(var(--primary) / 0.5)",
                  borderRadius: "12px",
                  background: "hsl(var(--primary) / 0.1)",
                  fontWeight: "bold"
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  INITIALIZING SEARCH SEQUENCE...
                </motion.span>
              </div>
            ) : filteredResources.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + (activeFeedId ?? "new")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {filteredResources.map((resource, i) => (
                    <motion.div
                      key={resource.id || i}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -3, transition: { duration: 0.18 } }}
                      style={{
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      className="bg-card border border-border rounded-xl hover:border-primary/50"
                      onHoverStart={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onHoverEnd={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      {/* Type accent bar */}
                      <div
                        style={{
                          height: "2px",
                          background: TYPE_STYLES[resource.type]?.accent ?? "#fff",
                        }}
                      />
                      <div style={{ padding: "1.1rem 1.25rem" }}>
                        {/* Badge */}
                        <span
                          style={{
                            display: "inline-block",
                            fontFamily: "monospace",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            letterSpacing: "0.05em",
                            marginBottom: "0.7rem",
                          }}
                          className="bg-card border border-border text-foreground"
                        >
                          {TYPE_STYLES[resource.type]?.label ?? resource.type.toUpperCase()}
                        </span>

                        <ResourceCard {...resource} index={i} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                style={{
                  padding: "5rem",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "hsl(var(--muted-foreground))",
                  letterSpacing: "0.1em",
                  border: "1px dashed hsl(var(--border))",
                  borderRadius: "12px",
                  background: "transparent",
                  fontWeight: "bold"
                }}
              >
                {activeFilter === "all" ? "AWAITING QUERY INPUT" : `NO ${activeFilter.toUpperCase()} RESOURCES FOUND`}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <div
          style={{
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {/* Recent Activity */}
          <motion.div custom={0} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.16em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Clock size={10} style={{ color: "#00ff88" }} />
              RECENT_ACTIVITY.LOG
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {isLoadingHistory ? (
                <p className="font-mono text-[11px] font-bold text-muted-foreground">
                  Loading...
                </p>
              ) : history.length > 0 ? (
                history.slice(0, 5).map((query, i) => (
                  <motion.div
                    key={query.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07, type: "spring", stiffness: 200, damping: 22 }}
                    onClick={() => {
                      setSearchResults(null);
                      setActiveFeedId(query.id);
                    }}
                    style={{
                      padding: "0.8rem",
                      marginBottom: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    className="bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <p className="font-mono text-[10px] text-primary mb-1 tracking-[0.06em] font-bold">
                      {formatDate(query.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                      Curriculum for{" "}
                      <span className="text-foreground">'{query.query}'</span>
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="font-mono text-[11px] font-bold text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-[1px] bg-border my-6" />

          {/* Saved Curriculums */}
          <motion.div custom={1} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <p
              className="font-mono text-[11px] tracking-[0.16em] text-foreground font-bold mb-4 flex items-center gap-2"
            >
              <Sparkles size={10} className="text-primary" />
              SAVED_CURRICULUMS
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "OPT-001", title: "Deep Learning Core", pct: 75 },
                { id: "OPT-042", title: "Systems Design Elite", pct: 12 },
              ].map((curr) => (
                <motion.div
                  key={curr.id}
                  style={{
                      padding: "1rem",
                      cursor: "pointer",
                  }}
                  className="bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground font-bold">
                      {curr.id}
                    </span>
                    <Folder size={14} className="text-foreground" />
                  </div>
                  <p className="text-sm font-bold mb-3 text-foreground">{curr.title}</p>
                  <div className="bg-background h-1 rounded-sm overflow-hidden border border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${curr.pct}%` }}
                      transition={{ delay: 1, duration: 1.1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-sm"
                    />
                  </div>
                  <p className="text-right font-mono text-[10px] text-primary mt-2 font-bold">
                    {curr.pct}%
                  </p>
                </motion.div>
              ))}

              <motion.button
                style={{
                  width: "100%",
                  padding: "12px",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "all 0.1s"
                }}
                className="border border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary font-mono text-xs tracking-[0.1em] rounded-lg font-bold"
              >
                + CREATE NEW ENTRY
              </motion.button>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-[1px] bg-border my-6" />

          {/* System Integrity */}
          <motion.div
            custom={2}
            variants={sidebarItemVariants}
            initial="hidden"
            animate="visible"
            style={{
              padding: "1rem",
            }}
            className="bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3"
          >
            <ShieldCheck size={18} className="text-primary mt-[1px] shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground mb-1">
                System integrity: optimal
              </p>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                All nodes operational · 14ms · Encrypted
              </p>
            </div>
          </motion.div>

          {/* Security (Passkeys) */}
          <motion.div custom={3} variants={sidebarItemVariants} initial="hidden" animate="visible" className="mt-2">
             <p className="font-mono text-[11px] tracking-[0.16em] text-foreground font-bold mb-4 flex items-center gap-2">
               <Fingerprint size={10} className="text-primary" />
               SECURITY_DEVICES
             </p>
             <div className="flex flex-col gap-2">
               {passkeys && passkeys.length > 0 ? (
                 passkeys.map((pk: any) => (
                   <div key={pk.id} className="bg-card border border-border p-3 rounded-lg flex justify-between items-center hover:border-primary/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-foreground">{pk.deviceType}</span>
                        <span className="text-[10px] font-mono text-muted-foreground mt-1">Added {new Date(pk.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => removePasskey(pk.id)} className="text-red-500 hover:text-red-400 text-[10px] font-mono border border-red-500/20 px-2 py-1 rounded">Remove</button>
                   </div>
                 ))
               ) : (
                 <p className="font-mono text-[10px] text-muted-foreground border border-dashed border-border p-3 rounded-lg text-center">No passkeys registered</p>
               )}
             </div>
          </motion.div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          padding: "1.5rem 2rem",
        }}
        className="border-t border-border bg-background flex justify-between items-center flex-wrap gap-4"
      >
        <div>
          <p className="text-sm font-bold tracking-tight mb-1 text-foreground">
            Learn<span className="text-primary">Opto</span>
          </p>
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
            © 2024 LearnOpto Core. All rights reserved.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Status", "Security"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-[9px] tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.toUpperCase()}
            </a>
          ))}
        </div>
      </motion.footer>

      <PasskeySetupModal />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </motion.div>
  );
}