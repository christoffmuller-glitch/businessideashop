import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useGetMe,
  useAdminListIdeas,
  useAdminListUsers,
  useAdminUpdateIdeaStatus,
  useAdminUpdateUserRole,
  useAdminToggleFeatured,
  getGetMeQueryKey,
  getAdminListIdeasQueryKey,
  getAdminListUsersQueryKey,
} from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldAlert, Trash2, RotateCcw, Shield, Star, StarOff, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const { data: ideasData, isLoading: isIdeasLoading } = useAdminListIdeas({ limit: 50 }, {
    query: { queryKey: getAdminListIdeasQueryKey({ limit: 50 }), enabled: user?.role === "admin" },
  });

  const { data: usersData, isLoading: isUsersLoading } = useAdminListUsers({ limit: 50 }, {
    query: { queryKey: getAdminListUsersQueryKey({ limit: 50 }), enabled: user?.role === "admin" },
  });

  const updateIdeaStatus = useAdminUpdateIdeaStatus();
  const toggleFeatured = useAdminToggleFeatured();
  const updateUserRole = useAdminUpdateUserRole();

  if (isUserLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleIdeaStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "removed" : "active";
    updateIdeaStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListIdeasQueryKey({ limit: 50 }) });
          toast({ title: `Idea ${newStatus === "active" ? "restored" : "removed"}` });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update status" }),
      }
    );
  };

  const handleToggleFeatured = (id: number, currentFeatured: boolean) => {
    toggleFeatured.mutate(
      { id, data: { featured: !currentFeatured } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListIdeasQueryKey({ limit: 50 }) });
          toast({ title: !currentFeatured ? "Idea featured on home page" : "Idea removed from featured" });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update featured status" }),
      }
    );
  };

  const handleUserRoleChange = (id: number, currentRole: string) => {
    const newRole = currentRole === "user" ? "admin" : "user";
    updateUserRole.mutate(
      { id, data: { role: newRole } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey({ limit: 50 }) });
          toast({ title: `User role updated to ${newRole}` });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update role" }),
      }
    );
  };

  const totalIdeas = ideasData?.total ?? 0;
  const activeIdeas = ideasData?.ideas.filter((i) => i.status === "active").length ?? 0;
  const featuredIdeas = ideasData?.ideas.filter((i) => i.featured).length ?? 0;

  return (
    <Layout>
      <div className="bg-destructive/10 border-b border-destructive/20">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-destructive">
            <ShieldAlert className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage the platform, users, and content moderation.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{totalIdeas}</div>
              <div className="text-sm text-muted-foreground">Total Ideas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{activeIdeas}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-500">{featuredIdeas}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{usersData?.total ?? 0}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ideas">Ideas Moderation</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <Card>
              <CardHeader>
                <CardTitle>All Submitted Ideas</CardTitle>
                <CardDescription>Review, moderate, and feature platform content.</CardDescription>
              </CardHeader>
              <CardContent>
                {isIdeasLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : ideasData?.ideas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">No ideas submitted yet.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Quality</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ideasData?.ideas.map((idea) => (
                          <TableRow key={idea.id}>
                            <TableCell className="font-medium text-muted-foreground">{idea.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {idea.featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />}
                                <Link href={`/ideas/${idea.id}`} className="hover:underline text-primary font-medium line-clamp-1 max-w-[220px]">
                                  {idea.title}
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{idea.ownerName}</TableCell>
                            <TableCell>
                              {idea.qualityScore > 0 ? (
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                  <Zap className="h-3 w-3 text-amber-500" />
                                  {idea.qualityScore}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(idea.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={idea.status === "active" ? "default" : "destructive"}>
                                {idea.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={idea.featured ? "Remove from featured" : "Feature on home page"}
                                  onClick={() => handleToggleFeatured(idea.id, idea.featured)}
                                  disabled={toggleFeatured.isPending}
                                  className={idea.featured ? "text-amber-600 hover:text-amber-700" : "text-muted-foreground hover:text-amber-600"}
                                >
                                  {idea.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleIdeaStatusChange(idea.id, idea.status)}
                                  disabled={updateIdeaStatus.isPending}
                                  className={idea.status === "active"
                                    ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                    : "text-emerald-600 hover:text-emerald-600 hover:bg-emerald-100"
                                  }
                                >
                                  {idea.status === "active"
                                    ? <><Trash2 className="h-4 w-4 mr-1" /> Remove</>
                                    : <><RotateCcw className="h-4 w-4 mr-1" /> Restore</>
                                  }
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and access levels.</CardDescription>
              </CardHeader>
              <CardContent>
                {isUsersLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : usersData?.users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">No users yet.</p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersData?.users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium text-muted-foreground">{u.id}</TableCell>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.role === "admin" ? "destructive" : "secondary"}>
                                {u.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {u.id !== user.id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUserRoleChange(u.id, u.role)}
                                  disabled={updateUserRole.isPending}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make {u.role === "user" ? "Admin" : "User"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
