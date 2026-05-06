import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateIdea, useGetMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Target, BookOpen, AlertCircle } from "lucide-react";
import { useEffect } from "react";

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

const INDUSTRIES = [
  "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", 
  "Web3/Crypto", "ClimateTech", "Marketplace", "Consumer Social", 
  "DeepTech", "Hardware", "BioTech", "PropTech", "Other"
];

const submitSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  summary: z.string().min(20, "Summary must be at least 20 characters").max(250),
  description: z.string().min(100, "Description must be at least 100 characters"),
  industry: z.string().min(1, "Please select an industry"),
  targetRegion: z.string().min(2, "Target region is required"),
  problemStatement: z.string().min(50, "Please describe the problem in more detail"),
  proposedSolution: z.string().min(50, "Please describe your solution in more detail"),
  targetCustomer: z.string().min(20, "Please describe your target customer"),
  maturityStage: z.string().min(1, "Please select a maturity stage"),
  pmfAssumptions: z.string().optional(),
  knownCompetitors: z.string().optional(),
  legalConsiderations: z.string().optional(),
  requiredRoles: z.string().optional(),
  contributorsNeeded: z.coerce.number().min(0).default(0),
  tags: z.string().optional(),
});

type SubmitFormValues = z.infer<typeof submitSchema>;

export default function SubmitIdea() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const createIdea = useCreateIdea();
  
  const { data: user, isLoading: isUserLoading } = useGetMe({
    query: { retry: false }
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit an idea.",
      });
      setLocation("/login");
    }
  }, [user, isUserLoading, setLocation, toast]);

  const form = useForm<SubmitFormValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      title: "",
      summary: "",
      description: "",
      industry: "",
      targetRegion: "",
      problemStatement: "",
      proposedSolution: "",
      targetCustomer: "",
      maturityStage: "Raw concept",
      pmfAssumptions: "",
      knownCompetitors: "",
      legalConsiderations: "",
      requiredRoles: "",
      contributorsNeeded: 1,
      tags: "",
    },
  });

  if (isUserLoading || !user) return null;

  function onSubmit(data: SubmitFormValues) {
    createIdea.mutate(
      { data },
      {
        onSuccess: (idea) => {
          toast({
            title: "Idea Submitted!",
            description: "Your concept is now live on VentureForge.",
          });
          setLocation(`/ideas/${idea.id}`);
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.error || "An unexpected error occurred.",
          });
        },
      }
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-accent" />
            Forge a New Venture
          </h1>
          <p className="text-xl text-muted-foreground">
            Submit your concept to the community. Be specific about the problem, who it affects, and what help you need.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* The Basics */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  The Basics
                </CardTitle>
                <CardDescription>Core information about your concept.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" className="text-lg h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">One-line Summary</FormLabel>
                      <FormDescription>A catchy, concise pitch. (Max 250 chars)</FormDescription>
                      <FormControl>
                        <Input placeholder="We're building the GitHub for physical architecture." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetRegion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Market / Region</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., North America, Global, EMEA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maturityStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Maturity Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MATURITY_STAGES.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* The Meat */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  The Proposition
                </CardTitle>
                <CardDescription>Explain the why, who, and how.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Problem Statement</FormLabel>
                      <FormDescription>What specific pain point are you solving?</FormDescription>
                      <FormControl>
                        <Textarea className="min-h-24 resize-y" placeholder="Describe the problem..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proposedSolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Proposed Solution</FormLabel>
                      <FormDescription>How does your product uniquely solve this problem?</FormDescription>
                      <FormControl>
                        <Textarea className="min-h-24 resize-y" placeholder="Describe the solution..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetCustomer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Target Customer</FormLabel>
                      <FormDescription>Who desperately needs this right now?</FormDescription>
                      <FormControl>
                        <Textarea className="min-h-20 resize-y" placeholder="Describe the ideal customer profile..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Full Description / Context</FormLabel>
                      <FormDescription>Any additional details, backstory, or vision.</FormDescription>
                      <FormControl>
                        <Textarea className="min-h-32 resize-y" placeholder="Full details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* The Nitty Gritty */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-chart-4" />
                  Strategy & Needs
                </CardTitle>
                <CardDescription>Market dynamics and what you're looking for.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="knownCompetitors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Known Competitors</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20" placeholder="Who else is doing this?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pmfAssumptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Core Assumptions to Test</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20" placeholder="What needs to be true for this to work?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="requiredRoles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Co-founders / Roles</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Technical Cofounder, CMO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contributorsNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Contributors Needed</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>Comma-separated list (e.g. b2b, mobile, hardware)</FormDescription>
                      <FormControl>
                        <Input placeholder="b2b, ai, marketplace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setLocation("/")}>
                Cancel
              </Button>
              <Button type="submit" size="lg" className="min-w-40" disabled={createIdea.isPending}>
                {createIdea.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Launch Concept"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
