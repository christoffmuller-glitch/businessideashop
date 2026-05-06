import { useGetMe, useGetUserIdeas, useDeleteIdea, getGetMeQueryKey, getGetUserIdeasQueryKey } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Lightbulb, Plus, Edit, Trash2, ArrowUpCircle, MessageSquare, Users,
  Eye, EyeOff, Zap, Star, Loader2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function getQualityColor(score: number) {
  if (score >= 75) return "text-emerald-600 bg-emerald-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  if (score >= 25) return "text-orange-600 bg-orange-50";
  return "text-muted-foreground bg-muted";
}

function visibilityLabel(v: string) {
  if (v === "private") return { label: "Private", icon: EyeOff, color: "text-muted-foreground" };
  if (v === "contributors_only") return { label: "Contributors", icon: Eye, color: "text-blue-600" };
  return { label: "Public", icon: Eye, color: "text-emerald-600" };
}

export default function MyIdeas() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const { data: ideas, isLoading: isIdeasLoading } = useGetUserIdeas(
    user?.id ?? 0,
    { query: { queryKey: getGetUserIdeasQueryKey(user?.id ?? 0), enabled: !!user } }
  );
  const deleteIdea = useDeleteIdea();

  useEffect(() => {
    if (!isUserLoading && !user) {
      setLocation("/login");
    }
  }, [user, isUserLoading, setLocation]);

  if (isUserLoading || !user) return null;

  function handleDelete(id: number) {
    deleteIdea.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Idea deleted", description: "Your idea has been removed." });
          queryClient.invalidateQueries();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Could not delete idea." });
        },
      }
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-primary" />
                My Ideas
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Manage your submitted concepts and track their progress.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/ideas/new">
                <Plus className="h-5 w-5 mr-2" />
                New Idea
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isIdeasLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !ideas || ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Lightbulb className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No ideas yet</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              You haven't submitted any ideas yet. Share your first concept with the VentureForge community and find collaborators.
            </p>
            <Button asChild size="lg">
              <Link href="/ideas/new">
                <Plus className="h-5 w-5 mr-2" />
                Submit Your First Idea
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{ideas.length} idea{ideas.length !== 1 ? "s" : ""} submitted</p>
            {ideas.map((idea) => {
              const vis = visibilityLabel(idea.visibility ?? "public");
              const VisIcon = vis.icon;
              return (
                <Card key={idea.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent">
                            {idea.industry}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {idea.maturityStage}
                          </Badge>
                          {idea.featured && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-transparent gap-1">
                              <Star className="h-3 w-3 fill-amber-500" /> Featured
                            </Badge>
                          )}
                          {idea.status === "removed" && (
                            <Badge variant="destructive" className="text-xs">Removed</Badge>
                          )}
                        </div>
                        <Link href={`/ideas/${idea.id}`}>
                          <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">{idea.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">{idea.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/ideas/${idea.id}?edit=true`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete idea?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{idea.title}" and all its comments, votes, and contributions. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(idea.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-3 border-t bg-muted/20 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpCircle className="h-4 w-4" />
                      <span>{idea.score} votes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" />
                      <span>{idea.commentsCount} comments</span>
                    </div>
                    {idea.contributorsNeeded > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{idea.contributorsNeeded} contributors needed</span>
                      </div>
                    )}
                    {idea.qualityScore > 0 && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${getQualityColor(idea.qualityScore)}`}>
                        <Zap className="h-3 w-3" />
                        Quality: {idea.qualityScore}/100
                      </div>
                    )}
                    <div className={`flex items-center gap-1 ml-auto text-xs font-medium ${vis.color}`}>
                      <VisIcon className="h-3.5 w-3.5" />
                      {vis.label}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
