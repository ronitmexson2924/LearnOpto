import { useState, forwardRef } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, isLoading }, ref) => {
    const [topic, setTopic] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (topic.trim()) {
        onSearch(topic.trim());
      }
    };

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="relative flex items-center w-full bg-card border border-border/80 shadow-md rounded-2xl overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-5 w-5 text-muted-foreground ml-2.5 mr-1.5 shrink-0" />
            <input
              ref={ref}
              type="text"
              placeholder="What do you want to learn today?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={200}
              className="flex-1 min-w-0 bg-transparent border-0 focus:outline-none text-foreground text-base placeholder:text-muted-foreground/80 h-11 sm:h-12 px-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="h-11 min-h-[44px] px-4 sm:px-6 font-semibold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Search</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            AI-driven curation across videos, podcasts, documentation & courses
          </p>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
