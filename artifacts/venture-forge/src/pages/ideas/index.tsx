import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { useListIdeas, useGetIndustryBreakdown, ListIdeasSort } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, SlidersHorizontal, ChevronRight, Compass } from "lucide-react";
import { useLocation } from "wouter";

const MATURITY_STAGES = [
  "Raw concept",
  "Problem validated",
  "Solution defined",
  "Market research completed",
  "Business model drafted",
  "MVP in development",
  "MVP launched",
  "Early traction",
  "Revenue generating",
  "Scaling",
  "Investment ready",
  "Acquisition or IPO path"
];

export default function BrowseIdeas() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [industry, setIndustry] = useState<string>(searchParams.get("industry") || "all");
  const [maturityStage, setMaturityStage] = useState<string>(searchParams.get("maturityStage") || "all");
  const [sort, setSort] = useState<ListIdeasSort>((searchParams.get("sort") as ListIdeasSort) || "newest");
  const [page, setPage] = useState(1);

  // Debounced search for API call
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // We'll update debounced search when user stops typing (or presses enter)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
    updateUrlParams();
  };

  const { data, isLoading } = useListIdeas({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    industry: industry !== "all" ? industry : undefined,
    maturityStage: maturityStage !== "all" ? maturityStage : undefined,
    sort,
  });

  const { data: industries } = useGetIndustryBreakdown();

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (industry !== "all") params.set("industry", industry);
    if (maturityStage !== "all") params.set("maturityStage", maturityStage);
    if (sort !== "newest") params.set("sort", sort);
    
    // Replace URL without triggering a full reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setPage(1);
    setTimeout(updateUrlParams, 0); // let state update first
  };

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Compass className="h-8 w-8 text-primary" />
              Browse Concepts
            </h1>
            <p className="text-xl text-muted-foreground mt-4">
              Discover raw ideas, emerging startups, and opportunities to contribute.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 shrink-0 space-y-6 bg-card border rounded-lg p-5 sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-lg border-b pb-4">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <Select value={sort} onValueChange={(v) => handleFilterChange(setSort, v as ListIdeasSort)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="most_voted">Most Upvoted</SelectItem>
                    <SelectItem value="most_active">Most Active</SelectItem>
                    <SelectItem value="most_commented">Most Discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry</label>
                <Select value={industry} onValueChange={(v) => handleFilterChange(setIndustry, v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries?.map((ind) => (
                      <SelectItem key={ind.industry} value={ind.industry}>
                        {ind.industry} ({ind.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Maturity Stage</label>
                <Select value={maturityStage} onValueChange={(v) => handleFilterChange(setMaturityStage, v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {MATURITY_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(industry !== "all" || maturityStage !== "all" || sort !== "newest" || debouncedSearch) && (
              <Button 
                variant="outline" 
                className="w-full mt-4 text-xs" 
                size="sm"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setIndustry("all");
                  setMaturityStage("all");
                  setSort("newest");
                  setPage(1);
                  window.history.replaceState({}, '', window.location.pathname);
                }}
              >
                Clear Filters
              </Button>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full space-y-6">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search ideas, problems, tags..."
                className="pl-10 pr-24 h-12 text-base rounded-full shadow-sm"
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 rounded-full px-6"
              >
                Search
              </Button>
            </form>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                <p>Loading concepts...</p>
              </div>
            ) : data?.ideas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-xl bg-card border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No concepts found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We couldn't find any ideas matching your current filters. Try broadening your search or adjusting the filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    setIndustry("all");
                    setMaturityStage("all");
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>

                {data && data.totalPages > 1 && (
                  <div className="flex justify-center pt-10 pb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => {
                          setPage(p => p - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Previous
                      </Button>
                      <div className="text-sm font-medium px-4">
                        Page {page} of {data.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        disabled={page === data.totalPages}
                        onClick={() => {
                          setPage(p => p + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
