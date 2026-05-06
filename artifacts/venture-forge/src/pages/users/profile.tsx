import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUser, useGetUserIdeas } from "@workspace/api-client-react";
import { Loader2, User as UserIcon, Lightbulb } from "lucide-react";
import { IdeaCard } from "@/components/ideas/IdeaCard";

export default function PublicProfile() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: user, isLoading: isUserLoading } = useGetUser(id, {
    query: { enabled: !!id }
  });

  const { data: ideasData, isLoading: isIdeasLoading } = useGetUserIdeas(id, {
    query: { enabled: !!id }
  });

  if (isUserLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">This user does not exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start max-w-4xl mx-auto">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {user.location && (
                <p className="text-sm font-medium text-foreground">{user.location}</p>
              )}
              <p className="text-sm text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" /> About
              </h3>
              <div className="bg-card border rounded-lg p-6">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {user.bio || "This user hasn't added a bio yet."}
                </p>
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base">Builder Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-foreground block mb-1">Skills</span>
                  <p className="text-muted-foreground">{user.skills || "Not specified"}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block mb-1">Interests</span>
                  <p className="text-muted-foreground">{user.areasOfInterest || "Not specified"}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block mb-1">Willing to act as</span>
                  <p className="text-muted-foreground">{user.willingRoles || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-accent" /> Concepts by {user.name}
          </h3>
          
          {isIdeasLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : !ideasData || ideasData.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-xl bg-muted/20">
              <p className="text-muted-foreground">This user hasn't submitted any concepts yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideasData.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
