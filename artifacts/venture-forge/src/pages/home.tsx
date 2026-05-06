import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetFeaturedIdeas, useGetStatsOverview, useGetIndustryBreakdown } from "@workspace/api-client-react";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { ArrowRight, TrendingUp, Lightbulb, Users, Activity, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredData, isLoading: isLoadingFeatured } = useGetFeaturedIdeas();
  const { data: stats, isLoading: isLoadingStats } = useGetStatsOverview();
  const { data: industries, isLoading: isLoadingIndustries } = useGetIndustryBreakdown();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Where ventures begin
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Build the next big thing, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">together.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              VentureForge is the marketplace for raw business concepts. Submit your idea, find co-founders, advisors, and get validated before writing a single line of code.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto" asChild>
                <Link href="/ideas/new">
                  Submit an Idea
                  <Lightbulb className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto bg-background/50 backdrop-blur-sm" asChild>
                <Link href="/ideas">
                  Explore Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50 text-center">
            <div className="space-y-2">
              <div className="flex justify-center text-primary mb-2"><Lightbulb className="h-6 w-6" /></div>
              <h4 className="text-3xl font-bold">
                {isLoadingStats ? <Skeleton className="h-9 w-16 mx-auto" /> : stats?.totalIdeas || 0}
              </h4>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Ideas Pitched</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center text-accent mb-2"><Users className="h-6 w-6" /></div>
              <h4 className="text-3xl font-bold">
                {isLoadingStats ? <Skeleton className="h-9 w-16 mx-auto" /> : stats?.totalUsers || 0}
              </h4>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Builders</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center text-chart-3 mb-2"><TrendingUp className="h-6 w-6" /></div>
              <h4 className="text-3xl font-bold">
                {isLoadingStats ? <Skeleton className="h-9 w-16 mx-auto" /> : stats?.totalVotes || 0}
              </h4>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Market Signals</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center text-chart-4 mb-2"><Activity className="h-6 w-6" /></div>
              <h4 className="text-3xl font-bold">
                {isLoadingStats ? <Skeleton className="h-9 w-16 mx-auto" /> : stats?.totalContributions || 0}
              </h4>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Ideas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-accent" />
                Trending Concepts
              </h2>
              <p className="text-muted-foreground mt-2">Ideas gaining the most traction this week.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/ideas?sort=most_voted">View all trending <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[280px] rounded-xl bg-muted/40 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData?.trending.slice(0, 3).map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured/Recent Ideas */}
      <section className="py-20 bg-muted/20 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Latest Submissions</h2>
              <p className="text-muted-foreground mt-2">Fresh concepts looking for validation and team members.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/ideas?sort=newest">Browse directory <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[280px] rounded-xl bg-muted/40 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredData?.recent.slice(0, 8).map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/ideas?sort=newest">Browse directory <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Industries */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Explore by Industry</h2>
          
          {isLoadingIndustries ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {industries?.map((ind) => (
                <Link 
                  key={ind.industry} 
                  href={`/ideas?industry=${encodeURIComponent(ind.industry)}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  <span className="font-medium">{ind.industry}</span>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">{ind.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
