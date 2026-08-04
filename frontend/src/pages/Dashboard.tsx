import { useState, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { ResourceCard } from "@/components/ResourceCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, ShieldCheck, Trash2, BookmarkCheck, Sparkles, LogOut, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { navigateTo } from "@/lib/navigation";

type ResourceType = "youtube" | "podcast" | "documentation" | "course" | "video" | "article" | "audio" | "docs";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
}

interface SavedResource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string;
  type: string;
  createdAt: string;
}

interface SearchQuery {
  id: string;
  query: string;
  createdAt: string;
  resources: Resource[];
}

// Animation Variants
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 24 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15 } },
};

const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 22,
      delay: 0.2 + i * 0.06,
    },
  }),
};

const getApiErrorMessage = async (res: Response, fallback: string) => {
  const data = await res.json().catch(() => null);
  if (data?.error === "Daily search quota reached" && data.resetAt) {
    return `Daily search quota reached. Try again after ${new Date(data.resetAt).toLocaleString()}.`;
  }
  return data?.error || fallback;
};

const resourceTypes = new Set<ResourceType>([
  "youtube",
  "podcast",
  "documentation",
  "course",
  "video",
  "article",
  "audio",
  "docs",
]);

const normalizeResourceType = (type: string): ResourceType => {
  return resourceTypes.has(type as ResourceType) ? (type as ResourceType) : "documentation";
};

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activeFeedId, setActiveFeedId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Resource[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"results" | "saved">("results");

  // Auth Check - verify session
  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) {
        navigateTo("/login");
        throw new Error("Unauthorized");
      }
      return res.json();
    },
    retry: false,
  });

  // Fetch History
  const { data: historyData, isLoading: isLoadingHistory } = useQuery<{ history: SearchQuery[] }>({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/search/history", {
        credentials: "include",
      });
      if (res.status === 401) {
        navigateTo("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!userProfile,
  });

  const history = historyData?.history || [];

  // Fetch Saved Resources
  const { data: savedResourcesData } = useQuery<{ resources: SavedResource[] }>({
    queryKey: ["savedResources"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/resources/saved", {
        credentials: "include",
      });
      if (res.status === 401) {
        navigateTo("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch saved resources");
      return res.json();
    },
    enabled: !!userProfile,
  });

  const savedMap = new Map<string, string>();
  (savedResourcesData?.resources || []).forEach((r) => {
    savedMap.set(r.url, r.id);
  });

  // Toggle Save Mutation
  const toggleSaveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      url: string;
      source: string;
      type: string;
      isSaved?: boolean;
      savedId?: string;
    }) => {
      if (data.isSaved && data.savedId) {
        const res = await fetch(`http://localhost:3000/api/resources/save/${data.savedId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to remove saved resource"));
        return res.json();
      } else {
        const res = await fetch("http://localhost:3000/api/resources/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            url: data.url,
            source: data.source,
            type: data.type,
          }),
        });
        if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to save resource"));
        return res.json();
      }
    },
    onSuccess: (_resData, variables) => {
      toast({
        title: variables.isSaved ? "Removed from Saved" : "Resource Saved",
        description: variables.isSaved
          ? "Resource removed from your saved library."
          : "Resource added to your saved library.",
      });
      queryClient.invalidateQueries({ queryKey: ["savedResources"] });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch User Analytics
  const { data: analyticsData } = useQuery<{ analytics: { totalSearches: number; totalResourcesSaved: number; totalResourcesViewed: number } }>({
    queryKey: ["userAnalytics"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/user/analytics", { credentials: "include" });
      if (!res.ok) return { analytics: { totalSearches: 0, totalResourcesSaved: 0, totalResourcesViewed: 0 } };
      return res.json();
    },
    enabled: !!userProfile,
  });

  // Fetch User Format Preferences
  const { data: preferencesData } = useQuery<{ preferences: { preferredSources: string[] } }>({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/user/preferences", { credentials: "include" });
      if (!res.ok) return { preferences: { preferredSources: ["video", "podcast", "documentation", "course"] } };
      return res.json();
    },
    enabled: !!userProfile,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferredSources: string[]) => {
      const res = await fetch("http://localhost:3000/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ preferredSources }),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      toast({ title: "Preferences Updated", description: "Search format weighting updated for future searches." });
    },
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
        navigateTo("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Search failed"));
      return res.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.resources);
      setActiveFeedId(null);
      setViewMode("results");
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
      queryClient.invalidateQueries({ queryKey: ["userAnalytics"] });
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete History Item Mutation
  const deleteHistoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3000/api/search/history/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        navigateTo("/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to delete history item"));
      return res.json();
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["searchHistory"] });
      const previousHistory = queryClient.getQueryData<{ history: SearchQuery[] }>(["searchHistory"]);

      queryClient.setQueryData<{ history: SearchQuery[] }>(["searchHistory"], (old) => {
        if (!old) return { history: [] };
        return {
          ...old,
          history: old.history.filter((item) => item.id !== deletedId),
        };
      });

      if (activeFeedId === deletedId) {
        setActiveFeedId(null);
        setSearchResults(null);
      }

      return { previousHistory };
    },
    onError: (error, _deletedId, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(["searchHistory"], context.previousHistory);
      }
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
    },
  });

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      navigateTo("/login");
    } catch {
      navigateTo("/login");
    }
  };

  const handleSearch = (topic: string) => {
    searchMutation.mutate(topic);
  };

  const handleCreateNewEntry = () => {
    setSearchResults(null);
    setActiveFeedId(null);
    setViewMode("results");
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
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
    { key: "all", label: "All" },
    { key: "video", label: "Video" },
    { key: "audio", label: "Audio" },
    { key: "docs", label: "Docs" },
    { key: "course", label: "Course" },
  ];

  // Determine resources to show in feed
  let rawResources: Resource[] = [];
  if (viewMode === "saved") {
    rawResources = (savedResourcesData?.resources || []).map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description || "",
      url: r.url,
      type: normalizeResourceType(r.type),
      source: r.source,
    }));
  } else {
    if (searchResults) {
      rawResources = searchResults;
    } else if (activeFeedId) {
      const activeQuery = history.find((q) => q.id === activeFeedId);
      if (activeQuery) rawResources = activeQuery.resources;
    } else if (history.length > 0) {
      rawResources = history[0].resources;
    }
  }

  // Filter resources by type
  const filteredResources =
    activeFilter === "all"
      ? rawResources
      : rawResources.filter((r) => {
          if (activeFilter === "video") return r.type === "youtube";
          if (activeFilter === "audio") return r.type === "podcast";
          if (activeFilter === "docs") return r.type === "documentation";
          if (activeFilter === "course") return r.type === "course";
          return true;
        });

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[100dvh] font-inter bg-background text-foreground flex flex-col"
    >

      {/* Top Header */}
      <motion.header
        variants={headerVariants}
        className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between"
      >
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight font-poppins">LearnOpto</span>
        </a>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </Button>
        </div>
      </motion.header>

      {/* Hero / Search Section */}
      <div className="flex flex-col items-center pt-10 pb-8 px-4 text-center">
        <motion.div variants={sectionVariants} className="mb-6 flex flex-col items-center max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> AI-Powered Resource Curation
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-poppins mb-3">
            Discover top learning resources
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Type any topic to generate hand-picked YouTube videos, podcasts, documentation, and courses.
          </p>
        </motion.div>

        <motion.div variants={sectionVariants} className="w-full max-w-2xl mb-2">
          <SearchBar ref={searchInputRef} onSearch={handleSearch} isLoading={searchMutation.isPending} />
        </motion.div>
      </div>

      {/* Main Grid Layout (Responsive Flex/Grid: stacked on mobile, 2 columns on desktop) */}
      <div className="flex-1 border-t border-border max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Left Feed Panel */}
        <div className="p-6 sm:p-8 lg:border-r border-border">
          {/* Feed Header / View Mode Controls */}
          <motion.div variants={sectionVariants} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                {/* Mode toggle */}
                <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/80">
                  <button
                    onClick={() => setViewMode("results")}
                    className={`px-3.5 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-medium transition-all ${
                      viewMode === "results"
                        ? "bg-card text-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Results
                  </button>
                  <button
                    onClick={() => setViewMode("saved")}
                    className={`px-3.5 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      viewMode === "saved"
                        ? "bg-card text-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
                    Saved ({savedResourcesData?.resources?.length || 0})
                  </button>
                </div>

                <span className="hidden sm:flex text-xs font-medium text-muted-foreground items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {viewMode === "saved" ? "Saved Library" : "Learning Feed"}
                </span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 touch-pan-x">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3.5 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      activeFilter === f.key
                        ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading / Grid / Empty State */}
            {searchMutation.isPending ? (
              <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
                <Loader2 className="w-7 h-7 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Searching for top learning resources...</p>
                <p className="text-xs text-muted-foreground mt-1">Curating YouTube videos, podcasts, docs, and courses</p>
              </div>
            ) : filteredResources.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + viewMode + (activeFeedId ?? "new")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {filteredResources.map((resource, i) => (
                    <motion.div
                      key={resource.id || i}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <ResourceCard
                        {...resource}
                        index={i}
                        isSaved={savedMap.has(resource.url)}
                        savedId={savedMap.get(resource.url)}
                        onToggleSave={(data) => toggleSaveMutation.mutate(data)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
                <p className="text-sm font-medium text-muted-foreground">
                  {viewMode === "saved"
                    ? (savedResourcesData?.resources?.length || 0) === 0
                      ? "Nothing saved yet — click the bookmark icon on any resource to save it here."
                      : `No ${activeFilter} saved resources found.`
                    : activeFilter === "all"
                    ? "Enter a topic above to generate a curated learning feed."
                    : `No ${activeFilter} resources found.`}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar Column */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 bg-muted/20">
          {/* Create New Entry Button */}
          <motion.div custom={0} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <Button
              onClick={handleCreateNewEntry}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Entry
            </Button>
          </motion.div>

          {/* Search History */}
          <motion.div custom={1} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 font-poppins">
              <Clock className="w-3.5 h-3.5 text-primary" /> Search History
            </h3>

            <div className="flex flex-col gap-2">
              {isLoadingHistory ? (
                <p className="text-xs text-muted-foreground">Loading history...</p>
              ) : history.length > 0 ? (
                history.map((query, i) => (
                  <motion.div
                    key={query.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    onClick={() => {
                      setSearchResults(null);
                      setActiveFeedId(query.id);
                      setViewMode("results");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-start group ${
                      activeFeedId === query.id || (!activeFeedId && !searchResults && i === 0 && viewMode === "results")
                        ? "bg-card border-primary shadow-sm"
                        : "bg-card/60 border-border hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-medium text-foreground truncate">
                        {query.query}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(query.createdAt)} · {query.resources?.length || 0} items
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryMutation.mutate(query.id);
                      }}
                      title="Delete search entry"
                      className="text-muted-foreground hover:text-destructive transition-colors min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-xl hover:bg-destructive/10 shrink-0 -mr-1"
                    >
                      <Trash2 className="w-4 h-4 text-destructive/70 group-hover:text-destructive" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No recent search history</p>
              )}
            </div>
          </motion.div>

          {/* User Analytics Summary */}
          <motion.div custom={2} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 font-poppins">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Your Activity Analytics
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-card border border-border p-2.5 rounded-xl">
                <span className="text-lg font-bold text-foreground block font-poppins">
                  {analyticsData?.analytics?.totalSearches || 0}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Searches</span>
              </div>
              <div className="bg-card border border-border p-2.5 rounded-xl">
                <span className="text-lg font-bold text-foreground block font-poppins">
                  {analyticsData?.analytics?.totalResourcesSaved || 0}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Saved</span>
              </div>
              <div className="bg-card border border-border p-2.5 rounded-xl">
                <span className="text-lg font-bold text-foreground block font-poppins">
                  {analyticsData?.analytics?.totalResourcesViewed || 0}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Viewed</span>
              </div>
            </div>
          </motion.div>

          {/* Format Preferences Selector */}
          <motion.div custom={3} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2 font-poppins">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Format Preferences
            </h3>
            <p className="text-[11px] text-muted-foreground mb-3">
              Weight resource types during AI curation:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "video", label: "Videos" },
                { id: "podcast", label: "Podcasts" },
                { id: "documentation", label: "Docs" },
                { id: "course", label: "Courses" },
              ].map((fmt) => {
                const currentPrefs = preferencesData?.preferences?.preferredSources || ["video", "podcast", "documentation", "course"];
                const isSelected = currentPrefs.includes(fmt.id);

                const toggleFormat = () => {
                  let updated = isSelected
                    ? currentPrefs.filter((p) => p !== fmt.id)
                    : [...currentPrefs, fmt.id];
                  if (updated.length === 0) updated = ["video", "podcast", "documentation", "course"];
                  updatePreferencesMutation.mutate(updated);
                };

                return (
                  <button
                    key={fmt.id}
                    onClick={toggleFormat}
                    className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Account & Session Security */}
          <motion.div custom={4} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 font-poppins">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Session Security
            </h3>

            <div className="bg-card border border-border p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auth Provider:</span>
                <span className="font-semibold text-foreground uppercase text-[11px] bg-accent px-2 py-0.5 rounded-md">OAuth 2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Session Token:</span>
                <span className="font-mono text-[11px] text-primary">HTTP-Only Cookie</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-border/40 bg-background mt-auto">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnOpto. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}
