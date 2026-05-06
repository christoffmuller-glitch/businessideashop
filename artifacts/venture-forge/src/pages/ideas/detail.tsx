import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetIdea, 
  useGetMe, 
  useVoteOnIdea,
  useListComments,
  useCreateComment,
  useGetVentureElements,
  useGetMarketFit,
  useFollowIdea,
  getGetIdeaQueryKey,
  getListCommentsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  ArrowUpCircle, ArrowDownCircle, Users, MessageSquare, 
  Target, AlertTriangle, Lightbulb, CheckCircle2, 
  Clock, ShieldAlert, Heart, Share2, Loader2, Star
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Re-using same logic
const MATURITY_STAGES = [
  "Raw concept", "Problem validated", "Solution defined", 
  "Market research completed", "Business model drafted", 
  "MVP in development", "MVP launched", "Early traction", 
  "Revenue generating", "Scaling", "Investment ready", "Acquisition or IPO path"
];

function getStageProgress(stage: string) {
  const index = MATURITY_STAGES.indexOf(stage);
  if (index === -1) return 0;
  return Math.max(5, ((index + 1) / MATURITY_STAGES.length) * 100);
}

function StatusIcon({ status }: { status: string }) {
  switch(status) {
    case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'in_progress': return <Clock className="h-5 w-5 text-accent" />;
    case 'needs_expert_review': return <ShieldAlert className="h-5 w-5 text-chart-4" />;
    default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function IdeaDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: user } = useGetMe({ query: { retry: false } });
  
  const { data: idea, isLoading } = useGetIdea(id, {
    query: { enabled: !!id, queryKey: getGetIdeaQueryKey(id) }
  });

  const { data: comments, isLoading: isLoadingComments } = useListComments(id, {
    query: { enabled: !!id, queryKey: getListCommentsQueryKey(id) }
  });

  const { data: elements } = useGetVentureElements(id, {
    query: { enabled: !!id }
  });

  const { data: markets } = useGetMarketFit(id, {
    query: { enabled: !!id }
  });

  const voteMutation = useVoteOnIdea();
  const commentMutation = useCreateComment();
  const followMutation = useFollowIdea();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!idea) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold">Concept not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">The idea you're looking for doesn't exist or has been removed.</p>
          <Button asChild><Link href="/ideas">Browse Ideas</Link></Button>
        </div>
      </Layout>
    );
  }

  const progress = getStageProgress(idea.maturityStage);

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      toast({ title: "Please login to vote" });
      return;
    }
    
    // Optimistic update
    const currentVote = idea.userVote;
    let newScore = idea.score;
    let newUpvotes = idea.upvotes;
    let newDownvotes = idea.downvotes;
    
    if (currentVote === voteType) {
      // Removing vote
      if (voteType === 'up') { newScore--; newUpvotes--; }
      else { newScore++; newDownvotes--; }
    } else {
      // Changing or adding vote
      if (voteType === 'up') { 
        newScore++; newUpvotes++; 
        if (currentVote === 'down') { newScore++; newDownvotes--; }
      } else {
        newScore--; newDownvotes++;
        if (currentVote === 'up') { newScore--; newUpvotes--; }
      }
    }
    
    queryClient.setQueryData(getGetIdeaQueryKey(id), {
      ...idea,
      score: newScore,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: currentVote === voteType ? null : voteType
    });

    voteMutation.mutate(
      { id, data: { vote: voteType } },
      {
        onError: () => {
          // Rollback on error
          queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) });
          toast({ variant: "destructive", title: "Voting failed" });
        }
      }
    );
  };

  const handleFollow = () => {
    if (!user) {
      toast({ title: "Please login to follow" });
      return;
    }

    const newIsFollowing = !idea.isFollowing;
    
    queryClient.setQueryData(getGetIdeaQueryKey(id), {
      ...idea,
      isFollowing: newIsFollowing
    });

    followMutation.mutate({ id }, {
      onSuccess: (res) => {
        toast({ title: res.isFollowing ? "Following concept" : "Unfollowed concept" });
      },
      onError: () => {
        queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) });
      }
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    commentMutation.mutate(
      { id, data: { content: commentText } },
      {
        onSuccess: () => {
          setCommentText("");
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) });
          toast({ title: "Comment posted" });
        }
      }
    );
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Main Title Area */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-sm">
                  {idea.industry}
                </Badge>
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
                  <Target className="h-4 w-4" />
                  {idea.targetRegion}
                </div>
                {idea.tags && idea.tags.split(',').map(tag => (
                  <span key={tag} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground border px-2 py-1 rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {idea.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl">
                {idea.summary}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                    {idea.ownerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Initiated by {idea.ownerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="w-full lg:w-80 shrink-0">
              <Card className="border-primary/20 shadow-md bg-card">
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stage</span>
                    <span className="font-medium text-foreground">{idea.maturityStage}</span>
                    <Progress value={progress} className="h-2 mt-1" />
                  </div>

                  <div className="flex items-center justify-between border-y border-border py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`rounded-full ${idea.userVote === 'up' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                        onClick={() => handleVote('up')}
                      >
                        <ArrowUpCircle className="h-6 w-6" />
                      </Button>
                      <span className="text-2xl font-bold min-w-8 text-center">{idea.score}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`rounded-full ${idea.userVote === 'down' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'}`}
                        onClick={() => handleVote('down')}
                      >
                        <ArrowDownCircle className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Net Score
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12 text-base font-medium">
                      Offer Contribution
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        variant={idea.isFollowing ? "secondary" : "outline"} 
                        className="flex-1"
                        onClick={handleFollow}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${idea.isFollowing ? 'fill-current text-destructive' : ''}`} />
                        {idea.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {idea.contributorsNeeded > 0 && (
                    <div className="bg-accent/10 text-accent-foreground text-sm font-medium p-3 rounded-lg flex items-center justify-center gap-2 border border-accent/20">
                      <Users className="h-4 w-4" />
                      Looking for {idea.contributorsNeeded} contributors
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pitch" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent p-0 mb-8 space-x-8 overflow-x-auto">
            <TabsTrigger 
              value="pitch" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium text-base text-muted-foreground data-[state=active]:text-foreground"
            >
              The Pitch
            </TabsTrigger>
            <TabsTrigger 
              value="execution" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium text-base text-muted-foreground data-[state=active]:text-foreground"
            >
              Execution Plan
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium text-base text-muted-foreground data-[state=active]:text-foreground"
            >
              Market Fit
            </TabsTrigger>
            <TabsTrigger 
              value="discussion" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium text-base text-muted-foreground data-[state=active]:text-foreground flex items-center gap-2"
            >
              Discussion <Badge variant="secondary" className="ml-1">{idea.commentsCount}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pitch" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" /> Overview
                  </h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    {idea.description.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-2xl font-bold mb-4">The Problem</h3>
                  <Card className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-6 text-foreground">
                      {idea.problemStatement}
                    </CardContent>
                  </Card>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-foreground">
                      {idea.proposedSolution}
                    </CardContent>
                  </Card>
                </section>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {idea.targetCustomer}
                  </CardContent>
                </Card>

                {idea.knownCompetitors && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Known Competitors</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {idea.knownCompetitors}
                    </CardContent>
                  </Card>
                )}

                {idea.pmfAssumptions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Core Assumptions</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {idea.pmfAssumptions}
                    </CardContent>
                  </Card>
                )}

                {idea.requiredRoles && (
                  <Card>
                    <CardHeader className="bg-accent/10 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-accent" />
                        Roles Needed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm font-medium">
                      {idea.requiredRoles}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl">
              <h3 className="text-2xl font-bold mb-6">Venture Elements Checklist</h3>
              <p className="text-muted-foreground mb-8">Tracking the fundamental building blocks of the venture.</p>
              
              {!elements || elements.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No execution elements defined yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {elements.map((element) => (
                    <div key={element.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center gap-4">
                        <StatusIcon status={element.status} />
                        <span className="font-medium text-foreground">{element.element}</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {element.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="market" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl">
              <h3 className="text-2xl font-bold mb-6">Market Fit by Region</h3>
              
              {!markets || markets.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  No market analysis added yet.
                </div>
              ) : (
                <div className="grid gap-6">
                  {markets.map((market) => (
                    <Card key={market.id}>
                      <CardHeader className="pb-3 border-b">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" /> {market.region}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < market.confidenceScore ? 'fill-current' : 'text-muted/30'}`} />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        {market.marketOpportunity && (
                          <div>
                            <span className="font-semibold block mb-1">Opportunity</span>
                            <p className="text-muted-foreground">{market.marketOpportunity}</p>
                          </div>
                        )}
                        {market.keyCustomerSegment && (
                          <div>
                            <span className="font-semibold block mb-1">Customer Segment</span>
                            <p className="text-muted-foreground">{market.keyCustomerSegment}</p>
                          </div>
                        )}
                        {market.localCompetitors && (
                          <div>
                            <span className="font-semibold block mb-1">Local Competitors</span>
                            <p className="text-muted-foreground">{market.localCompetitors}</p>
                          </div>
                        )}
                        {market.barriersToEntry && (
                          <div>
                            <span className="font-semibold block mb-1">Barriers to Entry</span>
                            <p className="text-muted-foreground">{market.barriersToEntry}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold mb-6">Discussion</h3>
              
              {user ? (
                <form onSubmit={handlePostComment} className="mb-10 space-y-4">
                  <Textarea 
                    placeholder="Leave a constructive comment, question, or feedback..."
                    className="min-h-24 bg-card"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!commentText.trim() || commentMutation.isPending}>
                      {commentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Post Comment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mb-10 p-6 bg-muted/30 rounded-lg text-center border">
                  <p className="text-muted-foreground mb-4">Please log in to join the discussion.</p>
                  <Button asChild variant="outline"><Link href="/login">Log in</Link></Button>
                </div>
              )}

              <div className="space-y-6">
                {isLoadingComments ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : !comments || comments.length === 0 ? (
                  <p className="text-center text-muted-foreground italic py-8">No comments yet. Be the first to start the discussion!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-card border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
