import { ExternalLink, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  type: "youtube" | "podcast" | "documentation" | "course";
  index: number;
  views?: string;
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

export const ResourceCard = ({ title, description, url, type, index, views }: ResourceCardProps) => {
  return (
    <Card 
      className="group hover:shadow-brutalist-lg dark:hover:shadow-brutalist-lg-dark shadow-brutalist dark:shadow-brutalist-dark transition-all duration-300 hover:-translate-y-1 bg-card border-4 border-black dark:border-white overflow-hidden rounded-2xl flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-3 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={`${typeColors[type]} font-inter text-xs px-3 py-1 rounded-xl shadow-clay dark:shadow-clay-dark border-2 border-black dark:border-white font-bold`}>
            {typeLabels[type]}
          </Badge>
          {views && (
            <Badge variant="secondary" className="gap-1 text-xs px-3 py-1 rounded-xl font-inter shadow-clay dark:shadow-clay-dark border-2 border-black dark:border-white font-bold">
              <Eye className="h-3 w-3" />
              {views}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors font-black uppercase tracking-tight font-poppins leading-snug line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-xs md:text-sm mt-2 font-inter leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-accent transition-all hover:gap-3 duration-300 font-medium text-sm md:text-base font-inter group/link break-words"
          onClick={(e) => {
            // Ensure URL is properly formatted
            if (!url || url === '#' || url === '') {
              e.preventDefault();
              console.error('Invalid URL:', url);
            }
          }}
        >
          <span className="line-clamp-1">Visit Resource</span>
          <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover/link:translate-x-1 group-hover/link:scale-110 transition-all" />
        </a>
      </CardContent>
    </Card>
  );
};
