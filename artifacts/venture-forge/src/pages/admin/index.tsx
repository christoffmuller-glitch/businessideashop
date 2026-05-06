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
  getAdminListIdeasQueryKey,
  getAdminListUsersQueryKey
} from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldAlert, Trash2, RotateCcw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useGetMe({
    query: { retry: false }
  });

  const { data: ideasData, isLoading: isIdeasLoading } = useAdminListIdeas({ limit: 50 }, {
    query: { enabled: user?.role === 'admin' }
  });

  const { data: usersData, isLoading: isUsersLoading } = useAdminListUsers({ limit: 50 }, {
    query: { enabled: user?.role === 'admin' }
  });

  const updateIdeaStatus = useAdminUpdateIdeaStatus();
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

  if (!user || user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  const handleIdeaStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'removed' : 'active';
    updateIdeaStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListIdeasQueryKey({ limit: 50 }) });
          toast({ title: `Idea ${newStatus}` });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update status" })
      }
    );
  };

  const handleUserRoleChange = (id: number, currentRole: string) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    updateUserRole.mutate(
      { id, data: { role: newRole } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey({ limit: 50 }) });
          toast({ title: `User role updated to ${newRole}` });
        },
        onError: () => toast({ variant: "destructive", title: "Failed to update role" })
      }
    );
  };

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
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ideas">Ideas Moderation</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <Card>
              <CardHeader>
                <CardTitle>All Submitted Ideas</CardTitle>
                <CardDescription>Review and moderate platform content.</CardDescription>
              </CardHeader>
              <CardContent>
                {isIdeasLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ideasData?.ideas.map((idea) => (
                          <TableRow key={idea.id}>
                            <TableCell className="font-medium">{idea.id}</TableCell>
                            <TableCell>
                              <Link href={`/ideas/${idea.id}`} className="hover:underline text-primary font-medium line-clamp-1 max-w-[300px]">
                                {idea.title}
                              </Link>
                            </TableCell>
                            <TableCell>{idea.ownerName}</TableCell>
                            <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={idea.status === 'active' ? 'default' : 'destructive'}>
                                {idea.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleIdeaStatusChange(idea.id, idea.status)}
                                disabled={updateIdeaStatus.isPending}
                                className={idea.status === 'active' ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-green-600 hover:text-green-600 hover:bg-green-100'}
                              >
                                {idea.status === 'active' ? <Trash2 className="h-4 w-4 mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                                {idea.status === 'active' ? 'Remove' : 'Restore'}
                              </Button>
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
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
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
                            <TableCell className="font-medium">{u.id}</TableCell>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'}>
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
                                  Make {u.role === 'user' ? 'Admin' : 'User'}
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
