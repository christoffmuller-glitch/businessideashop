import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Compass, Plus, User, LogOut, Settings, ShieldAlert, Lightbulb, HelpCircle } from "lucide-react";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false },
  });
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      }
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              VF
            </div>
            <span className="inline-block font-bold text-xl tracking-tight">VentureForge</span>
          </Link>
          
          <div className="hidden md:flex gap-5">
            <Link href="/ideas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5">
              <Compass className="h-4 w-4" />
              Browse
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              How It Works
            </Link>
            <Link href="/ideas/new" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Submit Idea
            </Link>
            {user && (
              <Link href="/ideas/my-ideas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" />
                My Ideas
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search ideas..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setLocation(`/ideas?search=${encodeURIComponent(e.currentTarget.value)}`);
                }
              }}
            />
          </div>

          {!isLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/ideas/my-ideas" className="flex items-center cursor-pointer">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <span>My Ideas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
