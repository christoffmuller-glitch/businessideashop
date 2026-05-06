import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  useGetMe, 
  useGetUserIdeas,
  useUpdateProfile,
  getGetMeQueryKey
} from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings, User as UserIcon, Lightbulb, Activity, ArrowRight } from "lucide-react";
import { IdeaCard } from "@/components/ideas/IdeaCard";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  location: z.string().max(100).optional(),
  skills: z.string().max(200).optional(),
  areasOfInterest: z.string().max(200).optional(),
  willingRoles: z.string().max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading: isUserLoading } = useGetMe({
    query: { retry: false }
  });

  const { data: ideasData, isLoading: isIdeasLoading } = useGetUserIdeas(user?.id || 0, {
    query: { enabled: !!user?.id }
  });

  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      skills: user?.skills || "",
      areasOfInterest: user?.areasOfInterest || "",
      willingRoles: user?.willingRoles || "",
    },
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
    setLocation("/login");
    return null;
  }

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Profile updated successfully" });
          setIsEditing(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update profile" });
        }
      }
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start max-w-4xl mx-auto">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.location && (
                <p className="text-sm font-medium text-foreground">{user.location}</p>
              )}
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information and skills.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea className="resize-y" placeholder="Tell us about yourself..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Input placeholder="React, Node.js, Marketing, Sales" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areasOfInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormControl>
                          <Input placeholder="FinTech, AI, Climate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="willingRoles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Willing Roles</FormLabel>
                        <FormControl>
                          <Input placeholder="CTO, Advisor, Angel Investor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-8">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="ideas" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4">
                My Ideas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-primary" /> About
                    </h3>
                    <div className="bg-card border rounded-lg p-6">
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {user.bio || "No bio provided yet."}
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
                  
                  <Card>
                    <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-base">Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Ideas</span>
                         <span className="font-bold">{(user as any).ideasCount || 0}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> Contributions</span>
                         <span className="font-bold">{(user as any).contributionsCount || 0}</span>
                       </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ideas" className="mt-0">
              {isIdeasLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : !ideasData || ideasData.length === 0 ? (
                <div className="text-center py-16 border border-dashed rounded-xl bg-muted/20">
                  <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't submitted any concepts to the forge.</p>
                  <Button asChild><Link href="/ideas/new">Submit an Idea</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ideasData.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
