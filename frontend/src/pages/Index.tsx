import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const featuresAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }} 
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden font-inter bg-background"
    >

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 p-4 md:p-6 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="container mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase">
                LearnOpto
              </span>
            </a>
            
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
              <a href="#" className="text-primary border-b-2 border-primary pb-1">Discover</a>
              <a href="#" className="hover:text-foreground transition-colors pb-1">Platform</a>
              <a href="#" className="hover:text-foreground transition-colors pb-1">Research</a>
              <a href="#" className="hover:text-foreground transition-colors pb-1">API</a>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16 pt-24">
          {/* Hero Section */}
          <section className="relative flex flex-col items-center justify-center min-h-[75vh] md:min-h-[70vh] space-y-8 md:space-y-10">
            <div className="text-center space-y-6 animate-fade-in max-w-5xl relative z-10">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 mb-4 bg-primary/10 border border-primary/20 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary font-bold">Intellectual Command Center</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter font-inter text-foreground leading-none">
                LearnOpto
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-bold max-w-4xl mx-auto px-4 uppercase tracking-wide leading-tight">
                The AI Agent Designed to Resolve All Your Study Needs
              </p>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 pb-8 leading-relaxed">
                Discover curated learning resources from YouTube, podcasts, documentation, and courses—all ranked by quality, precision, and relevance to your unique learning path.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Button 
                  onClick={() => navigate('/login')}
                  className="h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-none hover:bg-primary/90 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  className="h-14 px-8 border-border bg-transparent text-foreground font-bold uppercase tracking-widest rounded-none hover:bg-foreground/5 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  Explore Features
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
              <section 
                ref={featuresAnimation.ref}
                className={`mt-20 md:mt-32 mb-16 md:mb-20 transition-all duration-1000 ${
                  featuresAnimation.isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold mb-4 block">Core Infrastructure</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
                      Why Choose<br />LearnOpto?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Your intelligent companion for discovering the best learning resources across the digital landscape.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-none border-border hover:bg-border bg-transparent w-12 h-12">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-none border-border hover:bg-border bg-transparent w-12 h-12">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-card border border-border p-8 hover:border-primary/50 transition-colors flex flex-col justify-between min-h-[300px]">
                    <div>
                      <div className="w-12 h-12 border border-primary flex items-center justify-center mb-8">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wide text-card-foreground mb-3">Curated Sources</h3>
                      <p className="text-card-foreground/70">
                        We filter through the noise to provide only the highest quality content from verified educators and technical experts.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-card border border-border p-8 hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-6 justify-between min-h-[300px] relative overflow-hidden group">
                    <div className="flex-1 z-10">
                      <div className="w-12 h-12 border border-primary flex items-center justify-center mb-8 bg-card">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wide text-card-foreground mb-3">AI-Powered Insights</h3>
                      <p className="text-card-foreground/70 mb-6">
                        Our proprietary AI analyze curriculum depth, creator reputation, and community feedback to rank resources with surgical precision.
                      </p>
                      <a href="#" className="text-primary text-xs font-mono font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:opacity-80">
                        Explore Methodology <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                    </div>
                    <div className="sm:w-[200px] h-[200px] sm:h-auto shrink-0 relative opacity-50 group-hover:opacity-100 transition-opacity">
                      <img src="/features/chip.jpg" alt="AI Chip" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-card border border-border p-8 hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-6 justify-between min-h-[300px] relative overflow-hidden group">
                    <div className="sm:w-[250px] h-[200px] sm:h-auto shrink-0 relative opacity-40 group-hover:opacity-80 transition-opacity">
                      <img src="/features/globe.jpg" alt="Globe" className="absolute inset-0 w-full h-full object-cover mix-blend-screen grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1 z-10 flex flex-col justify-end">
                      <div className="w-12 h-12 border border-primary flex items-center justify-center mb-8 bg-card">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wide text-card-foreground mb-3">Multi-Source Sync</h3>
                      <p className="text-card-foreground/70 mb-6">
                        One interface for YouTube, Podcasts, Substack, and GitHub. Build a holistic learning path across fragmented platforms.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white/5 text-white/70 text-[10px] font-mono uppercase tracking-widest">Video</span>
                        <span className="px-2 py-1 bg-white/5 text-white/70 text-[10px] font-mono uppercase tracking-widest">Audio</span>
                        <span className="px-2 py-1 bg-white/5 text-white/70 text-[10px] font-mono uppercase tracking-widest">Code</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-card border border-border p-8 hover:border-primary/50 transition-colors flex flex-col justify-between min-h-[300px]">
                    <div>
                      <div className="w-12 h-12 border border-primary flex items-center justify-center mb-8">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wide text-card-foreground mb-3">Skill Verification</h3>
                      <p className="text-card-foreground/70">
                        Track your progress across sources and validate your learning with AI-generated assessments and peer reviews.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="py-20 border-y border-border/50 my-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div>
                    <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-2">500K+</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">Resources Index</div>
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-2">98%</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">Precision Rate</div>
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-2">12M</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">Study Hours</div>
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-2">24/7</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">Agent Support</div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="mb-32">
                <div className="border border-primary bg-gradient-to-br from-primary/10 to-transparent p-12 md:p-20 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px]" />
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-12 relative z-10">
                    Ready to Master Your Field?
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                    <Button className="h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-none hover:bg-primary/90">
                      Build My Curriculum
                    </Button>
                    <Button variant="outline" className="h-14 px-8 border-border bg-transparent text-foreground font-bold uppercase tracking-widest rounded-none hover:bg-foreground/5">
                      See Platform Demo
                    </Button>
                  </div>
                </div>
              </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8">
              <div className="md:col-span-2">
                <a href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                  <h3 className="text-2xl font-black tracking-tighter uppercase text-foreground">LearnOpto</h3>
                </a>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground max-w-xs leading-relaxed">
                  The elite standard for artificial intelligence in academic resource discovery.
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground font-bold">Protocol</h4>
                <div className="flex flex-col space-y-4 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                  <a href="#" className="hover:text-primary transition-colors">Security</a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground font-bold">Platform</h4>
                <div className="flex flex-col space-y-4 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">Status</a>
                  <a href="#" className="hover:text-primary transition-colors">API Docs</a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground font-bold">Network</h4>
                <div className="flex flex-col space-y-4 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">X / Twitter</a>
                  <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground font-bold">Legal</h4>
                <div className="flex flex-col space-y-4 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">Terms</a>
                  <a href="#" className="hover:text-primary transition-colors">Liability</a>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                © 2024 LearnOpto Core. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary font-bold">Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Index;
