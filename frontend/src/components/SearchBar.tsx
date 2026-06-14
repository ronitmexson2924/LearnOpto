import { useState } from "react";
import { Search, Loader2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-scale-in">
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <div 
          className="relative flex items-center w-full bg-card border border-border shadow-lg rounded-full overflow-hidden p-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <Search className="h-6 w-6 text-muted-foreground ml-4 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="What do you want to learn today? (e.g., Machine Learning)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:outline-none text-foreground text-lg placeholder:text-muted-foreground h-14 px-2"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !topic.trim()}
            className="h-12 px-8 font-bold uppercase tracking-widest text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                DISCOVER <Zap className="h-4 w-4" fill="currentColor" />
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground text-center mt-6">
          POWERED BY AI • GET INSTANT ACCESS TO TOP-RATED LEARNING RESOURCES
        </p>
      </form>
    </div>
  );
};
