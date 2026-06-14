import { ResourceCard } from "./ResourceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Resource {
  title: string;
  description: string;
  url: string;
  type: "youtube" | "podcast" | "documentation" | "course";
  views?: string;
}

interface ResultsSectionProps {
  resources: Resource[];
  topic: string;
}

export const ResultsSection = ({ resources, topic }: ResultsSectionProps) => {
  const youtubeResources = resources.filter((r) => r.type === "youtube");
  const podcastResources = resources.filter((r) => r.type === "podcast");
  const documentationResources = resources.filter((r) => r.type === "documentation");
  const courseResources = resources.filter((r) => r.type === "course");

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center text-foreground px-4 font-poppins animate-fade-in">
        Learning Resources for <span className="text-primary">"{topic}"</span>
      </h2>
      <p className="text-center text-muted-foreground mb-10 md:mb-12 text-base md:text-lg lg:text-xl font-inter animate-fade-in">
        🤖 Curated by AI • {resources.length} high-quality resources found
      </p>

      <Tabs defaultValue="all" className="w-full animate-fade-in">
        <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8 md:mb-10 h-14 md:h-16 text-xs md:text-base rounded-2xl bg-card border-4 border-black dark:border-white shadow-clay dark:shadow-clay-dark font-poppins font-bold p-1">
          <TabsTrigger value="all" className="rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-black dark:data-[state=active]:border-white h-full">All</TabsTrigger>
          <TabsTrigger value="youtube" className="rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-black dark:data-[state=active]:border-white h-full">YouTube</TabsTrigger>
          <TabsTrigger value="podcast" className="rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-black dark:data-[state=active]:border-white h-full">Podcasts</TabsTrigger>
          <TabsTrigger value="docs" className="rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-black dark:data-[state=active]:border-white h-full">Docs</TabsTrigger>
          <TabsTrigger value="courses" className="rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-black dark:data-[state=active]:border-white h-full">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {youtubeResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="podcast" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {podcastResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {documentationResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {courseResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} index={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
