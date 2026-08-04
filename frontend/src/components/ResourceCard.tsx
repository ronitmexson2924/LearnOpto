import { ExternalLink, Eye, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ResourceCardProps {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: "youtube" | "podcast" | "documentation" | "course";
  source?: string;
  index: number;
  views?: string;
  isSaved?: boolean;
  savedId?: string;
  onToggleSave?: (data: {
    title: string;
    description: string;
    url: string;
    source: string;
    type: string;
    isSaved?: boolean;
    savedId?: string;
  }) => void;
}

const typeColors = {
  youtube: "bg-red-500/10 text-red-600 dark:text-red-400",
  podcast: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  documentation: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  course: "bg-green-500/10 text-green-600 dark:text-green-400",
};

const typeLabels = {
  youtube: "YouTube",
  podcast: "Podcast",
  documentation: "Documentation",
  course: "Course",
};

export const ResourceCard = ({
  title,
  description,
  url,
  type,
  source,
  index,
  views,
  isSaved = false,
  savedId,
  onToggleSave,
}: ResourceCardProps) => {
  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!url || url === "#" || url === "") return;

    // Fire non-blocking tracking call in background
    fetch("http://localhost:3000/api/resources/interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ url }),
    }).catch(() => {
      // Fail silently on tracking errors — never show error toast
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className="group hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 bg-card border border-border/80 overflow-hidden rounded-2xl flex flex-col min-w-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-3 space-y-3 p-5">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center min-w-0">
            <Badge
              className={`${typeColors[type] || "bg-primary/10 text-primary"} font-inter text-[11px] px-2.5 py-0.5 rounded-lg border border-primary/20 font-semibold`}
            >
              {typeLabels[type] || type}
            </Badge>
            {views && (
              <Badge
                variant="secondary"
                className="gap-1 text-[11px] px-2.5 py-0.5 rounded-lg font-inter font-medium"
              >
                <Eye className="h-3 w-3" />
                {views}
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSave) {
                onToggleSave({
                  title,
                  description,
                  url,
                  source: source || type,
                  type,
                  isSaved,
                  savedId,
                });
              }
            }}
            title={isSaved ? "Remove from saved" : "Save resource"}
            className="text-muted-foreground hover:text-primary active:scale-95 transition-all min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-xl hover:bg-accent -mr-1"
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <CardTitle
          onClick={handleOpenLink}
          className="text-base sm:text-lg group-hover:text-primary transition-colors font-bold tracking-tight font-poppins leading-snug line-clamp-2 cursor-pointer break-words min-w-0"
        >
          {title}
        </CardTitle>

        <CardDescription className="line-clamp-3 text-xs sm:text-sm mt-1.5 font-inter leading-relaxed break-words min-w-0">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 p-5 mt-auto">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenLink}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-xs sm:text-sm font-inter group/link min-h-[44px] py-1 break-words min-w-0"
        >
          <span className="line-clamp-1">Visit Resource</span>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 group-hover/link:translate-x-1 transition-all" />
        </a>
      </CardContent>
    </Card>
  );
};

