import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useFollowIdea,
  useDeleteIdea,
  getGetMeQueryKey,
  getGetIdeaQueryKey,
  getListCommentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpCircle, ArrowDownCircle, Users, MessageSquare,
  Target, AlertTriangle, Lightbulb, CheckCircle2,
  Clock, ShieldAlert, Heart, Share2, Loader2, Star,
  Edit, Trash2, Globe, DollarSign, Zap, Eye, EyeOff,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MATURITY_STAGES = [
  "Raw concept", "Researching", "Validating", "Prototype", "Pilot", "Launch-ready",
  "Problem validated", "Solution defined", "Market research completed", "Business model drafted",
  "MVP in development", "MVP launched", "Early traction", "Revenue generating",
  "Scaling", "Investment ready", "Acquisition or IPO path",
];

function getStageProgress(stage: string) {
  const index = MATURITY_STAGES.indexOf(stage);
  if (index === -1) return 5;
  if (index < 6) return Math.max(5, ((index + 1) / 6) * 100);
  return Math.max(5, ((index - 5) / 11) * 100);
}

function getQualityColor(score: number) {
  if (score >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  if (score >= 25) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-muted-foreground bg-muted border-border";
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "in_progress": return <Clock className="h-5 w-5 text-accent" />;
    case "needs_expert_review": return <ShieldAlert className="h-5 w-5 text-chart-4" />;
    default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
  }
}

function InfoSection({ title, content }: { title: string; content: string | null | undefined }) {
  if (!content) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export default function IdeaDetail() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const { data: idea, isLoading } = useGetIdea(id, {
    query: { enabled: !!id, queryKey: getGetIdeaQueryKey(id) },
  });

  const { data: comments, isLoading: isLoadingComments } = useListComments(id, {
    query: { enabled: !!id, queryKey: getListCommentsQueryKey(id) },
  });

  const voteMutation = useVoteOnIdea();
  const commentMutation = useCreateComment();
  const followMutation = useFollowIdea();
  const deleteMutation = useDeleteIdea();

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
  const isOwner = user && idea.ownerId === user.id;
  const isAdmin = user?.role === "admin";
  const canEdit = isOwner || isAdmin;

  const handleVote = (voteType: "up" | "down") => {
    if (!user) { toast({ title: "Please login to vote" }); return; }
    const currentVote = idea.userVote;
    let newScore = idea.score, newUpvotes = idea.upvotes, newDownvotes = idea.downvotes;
    if (currentVote === voteType) {
      if (voteType === "up") { newScore--; newUpvotes--; }
      else { newScore++; newDownvotes--; }
    } else {
      if (voteType === "up") { newScore++; newUpvotes++; if (currentVote === "down") { newScore++; newDownvotes--; } }
      else { newScore--; newDownvotes++; if (currentVote === "up") { newScore--; newUpvotes--; } }
    }
    queryClient.setQueryData(getGetIdeaQueryKey(id), {
      ...idea, score: newScore, upvotes: newUpvotes, downvotes: newDownvotes,
      userVote: currentVote === voteType ? null : voteType,
    });
    voteMutation.mutate({ id, data: { vote: voteType } }, {
      onError: () => {
        queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) });
        toast({ variant: "destructive", title: "Voting failed" });
      },
    });
  };

  const handleFollow = () => {
    if (!user) { toast({ title: "Please login to follow" }); return; }
    queryClient.setQueryData(getGetIdeaQueryKey(id), { ...idea, isFollowing: !idea.isFollowing });
    followMutation.mutate({ id }, {
      onSuccess: (res) => toast({ title: res.isFollowing ? "Following concept" : "Unfollowed concept" }),
      onError: () => queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) }),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Idea deleted" });
        setLocation("/ideas/my-ideas");
      },
      onError: () => toast({ variant: "destructive", title: "Failed to delete idea" }),
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    commentMutation.mutate({ id, data: { content: commentText } }, {
      onSuccess: () => {
        setCommentText("");
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getGetIdeaQueryKey(id) });
        toast({ title: "Comment posted" });
      },
    });
  };

  const visibilityIcon = idea.visibility === "private"
    ? <EyeOff className="h-3.5 w-3.5" />
    : <Eye className="h-3.5 w-3.5" />;

  const contributorSkillsArr = idea.contributorSkills
    ? idea.contributorSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Title Area */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-sm">
                  {idea.industry}
                </Badge>
                {idea.featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-transparent gap-1">
                    <Star className="h-3 w-3 fill-amber-500" /> Featured
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
                  <Target className="h-4 w-4" />
                  {idea.targetRegion}
                </div>
                {idea.visibility !== "public" && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-1">
                    {visibilityIcon}
                    {idea.visibility === "private" ? "Private" : "Contributors only"}
                  </div>
                )}
                {idea.tags && idea.tags.split(",").map((tag) => (
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
                    {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Owner/Admin actions */}
              {canEdit && (
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ideas/${idea.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1.5" />
                      Edit Idea
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30">
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{idea.title}" along with all its comments, votes, and contributions. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Action Card */}
            <div className="w-full lg:w-80 shrink-0">
              <Card className="border-primary/20 shadow-md bg-card">
                <CardContent className="p-6 space-y-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stage</span>
                    <span className="font-medium text-foreground">{idea.maturityStage}</span>
                    <Progress value={progress} className="h-2 mt-1" />
                  </div>

                  {idea.qualityScore > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold ${getQualityColor(idea.qualityScore)}`}>
                      <Zap className="h-4 w-4" />
                      Quality Score: {idea.qualityScore}/100
                    </div>
                  )}

                  <div className="flex items-center justify-between border-y border-border py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className={`rounded-full ${idea.userVote === "up" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                        onClick={() => handleVote("up")}
                      >
                        <ArrowUpCircle className="h-6 w-6" />
                      </Button>
                      <span className="text-2xl font-bold min-w-8 text-center">{idea.score}</span>
                      <Button
                        variant="ghost" size="icon"
                        className={`rounded-full ${idea.userVote === "down" ? "text-destructive bg-destructive/10" : "text-muted-foreground"}`}
                        onClick={() => handleVote("down")}
                      >
                        <ArrowDownCircle className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Net Score</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button
                        variant={idea.isFollowing ? "secondary" : "outline"}
                        className="flex-1"
                        onClick={handleFollow}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${idea.isFollowing ? "fill-current text-destructive" : ""}`} />
                        {idea.isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="icon" className="shrink-0"
                        onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}
                      >
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

                  {contributorSkillsArr.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills Needed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {contributorSkillsArr.map((skill) => (
                          <span key={skill} className="text-xs bg-muted px-2 py-1 rounded font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pitch" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent p-0 mb-8 space-x-8 overflow-x-auto">
            {["pitch", "localisation", "execution", "market", "discussion"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium text-base text-muted-foreground data-[state=active]:text-foreground capitalize flex items-center gap-2"
              >
                {tab === "discussion" ? (
                  <>{tab} <Badge variant="secondary" className="ml-1">{idea.commentsCount}</Badge></>
                ) : tab === "pitch" ? "The Pitch" : tab === "execution" ? "Execution" : tab === "market" ? "Market Fit" : "Localisation"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* The Pitch Tab */}
          <TabsContent value="pitch" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <section>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" /> Overview
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-3">
                    {idea.description.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-2xl font-bold mb-4">The Problem</h3>
                  <Card className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-6 text-foreground">{idea.problemStatement}</CardContent>
                  </Card>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-foreground">{idea.proposedSolution}</CardContent>
                  </Card>
                </section>

                {(idea as any).revenueModel && (
                  <section>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-emerald-500" /> Revenue Model
                    </h3>
                    <Card className="bg-emerald-50/50 border-emerald-200/60">
                      <CardContent className="p-6 text-foreground">{(idea as any).revenueModel}</CardContent>
                    </Card>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Target Customer</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground pt-0">{idea.targetCustomer}</CardContent>
                </Card>

                {(idea as any).knownCompetitors && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Known Competitors</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground pt-0">{(idea as any).knownCompetitors}</CardContent>
                  </Card>
                )}

                {(idea as any).pmfAssumptions && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Key Assumptions</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground pt-0">{(idea as any).pmfAssumptions}</CardContent>
                  </Card>
                )}

                {(idea as any).requiredRoles && (
                  <Card className="bg-accent/5 border-accent/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" /> Roles Needed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-medium pt-0">{(idea as any).requiredRoles}</CardContent>
                  </Card>
                )}

                {(idea as any).legalConsiderations && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Legal / IP Notes</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground pt-0">{(idea as any).legalConsiderations}</CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Localisation Tab */}
          <TabsContent value="localisation" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-6 w-6 text-chart-2" />
                <h3 className="text-2xl font-bold">Market & Localisation Context</h3>
              </div>

              {!(idea as any).whyThisMarket && !(idea as any).localConstraints && !(idea as any).regulatoryConsiderations &&
               !(idea as any).infrastructureDependencies && !(idea as any).localCompetitors && !(idea as any).localLaunchChannels ? (
                <div className="p-12 text-center border border-dashed rounded-xl text-muted-foreground">
                  <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No localisation details have been added for this idea yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(idea as any).whyThisMarket && (
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2"><CardTitle className="text-base">Why This Market</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).whyThisMarket}</CardContent>
                    </Card>
                  )}
                  {(idea as any).localCompetitors && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Local / Regional Competitors</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).localCompetitors}</CardContent>
                    </Card>
                  )}
                  {(idea as any).localLaunchChannels && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Local Launch Channels</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).localLaunchChannels}</CardContent>
                    </Card>
                  )}
                  {(idea as any).regulatoryConsiderations && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Regulatory Considerations</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).regulatoryConsiderations}</CardContent>
                    </Card>
                  )}
                  {(idea as any).infrastructureDependencies && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Infrastructure Dependencies</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).infrastructureDependencies}</CardContent>
                    </Card>
                  )}
                  {(idea as any).localConstraints && (
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2"><CardTitle className="text-base">Local Constraints & Challenges</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{(idea as any).localConstraints}</CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl">
              <h3 className="text-2xl font-bold mb-2">Venture Elements Checklist</h3>
              <p className="text-muted-foreground mb-8">Tracking the fundamental building blocks of the venture.</p>

              {!idea.ventureElements || idea.ventureElements.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-xl text-muted-foreground">
                  No execution elements defined yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {idea.ventureElements.map((element) => (
                    <div key={element.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <StatusIcon status={element.status} />
                        <span className="font-medium text-foreground">{element.element}</span>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {element.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Market Fit Tab */}
          <TabsContent value="market" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl">
              <h3 className="text-2xl font-bold mb-6">Market Fit by Region</h3>

              {!idea.marketFitRegions || idea.marketFitRegions.length === 0 ? (
                <div className="p-12 text-center border border-dashed rounded-xl text-muted-foreground">
                  <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No market analysis added yet.</p>
                  {isOwner && (
                    <p className="text-sm mt-2">As the owner, you can add market fit analysis by editing this idea.</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-6">
                  {idea.marketFitRegions.map((market) => (
                    <Card key={market.id}>
                      <CardHeader className="pb-3 border-b">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" /> {market.region}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < market.confidenceScore ? "fill-current" : "text-muted/30"}`} />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <InfoSection title="Market Opportunity" content={market.marketOpportunity} />
                        <InfoSection title="Customer Segment" content={market.keyCustomerSegment} />
                        <InfoSection title="Local Competitors" content={market.localCompetitors} />
                        <InfoSection title="Barriers to Entry" content={market.barriersToEntry} />
                        <InfoSection title="Pricing Assumptions" content={market.pricingAssumptions} />
                        <InfoSection title="Product Adaptations" content={market.productChanges} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Discussion Tab */}
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
                      {commentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                          <span className="text-sm font-semibold">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
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
