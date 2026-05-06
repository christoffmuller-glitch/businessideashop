import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import BrowseIdeas from "@/pages/ideas/index";
import SubmitIdea from "@/pages/ideas/new";
import IdeaDetail from "@/pages/ideas/detail";
import MyIdeas from "@/pages/ideas/my-ideas";
import Profile from "@/pages/profile";
import PublicProfile from "@/pages/users/profile";
import AdminDashboard from "@/pages/admin/index";
import HowItWorks from "@/pages/how-it-works";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Ideas routes */}
      <Route path="/ideas" component={BrowseIdeas} />
      <Route path="/ideas/new" component={SubmitIdea} />
      <Route path="/ideas/my-ideas" component={MyIdeas} />
      <Route path="/ideas/:id" component={IdeaDetail} />
      
      {/* User routes */}
      <Route path="/profile" component={Profile} />
      <Route path="/users/:id" component={PublicProfile} />
      
      {/* Admin route */}
      <Route path="/admin" component={AdminDashboard} />

      {/* Static pages */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
