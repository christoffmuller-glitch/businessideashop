import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateIdea, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Target, BookOpen, AlertCircle, Globe, Users, Eye, Info } from "lucide-react";
import { useEffect } from "react";

const MATURITY_STAGES = [
  "Raw concept",
  "Researching",
  "Validating",
  "Prototype",
  "Pilot",
  "Launch-ready",
];

const INDUSTRIES = [
  "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML",
  "Web3/Crypto", "ClimateTech", "Marketplace", "Consumer Social",
  "DeepTech", "Hardware", "BioTech", "PropTech", "AgriTech",
  "LegalTech", "InsurTech", "FoodTech", "TravelTech", "Other"
];

const CONTRIBUTOR_SKILLS = [
  "Market research",
  "Technical development",
  "Finance modelling",
  "Sales / customer discovery",
  "Operations",
  "Legal / regulatory",
  "Design / UX",
  "Domain expert",
];

const submitSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  summary: z.string().min(20, "Summary must be at least 20 characters").max(250),
  description: z.string().min(100, "Description must be at least 100 characters"),
  industry: z.string().min(1, "Please select an industry"),
  targetRegion: z.string().min(2, "Primary market / country is required"),
  whyThisMarket: z.string().optional(),
  problemStatement: z.string().min(50, "Please describe the problem in more detail (min 50 chars)"),
  proposedSolution: z.string().min(50, "Please describe your solution in more detail (min 50 chars)"),
  targetCustomer: z.string().min(20, "Please describe your target customer"),
  maturityStage: z.string().min(1, "Please select a maturity stage"),
  revenueModel: z.string().optional(),
  pmfAssumptions: z.string().optional(),
  knownCompetitors: z.string().optional(),
  legalConsiderations: z.string().optional(),
  regulatoryConsiderations: z.string().optional(),
  infrastructureDependencies: z.string().optional(),
  localCompetitors: z.string().optional(),
  localLaunchChannels: z.string().optional(),
  localConstraints: z.string().optional(),
  requiredRoles: z.string().optional(),
  contributorSkills: z.array(z.string()).optional(),
  contributorsNeeded: z.coerce.number().min(0).default(0),
  tags: z.string().optional(),
  visibility: z.enum(["public", "private", "contributors_only"]).default("public"),
  disclaimer: z.boolean().refine((v) => v === true, { message: "You must acknowledge the disclaimer." }),
});

type SubmitFormValues = z.infer<typeof submitSchema>;

export default function SubmitIdea() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const createIdea = useCreateIdea();

  const { data: user, isLoading: isUserLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false },
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
      whyThisMarket: "",
      problemStatement: "",
      proposedSolution: "",
      targetCustomer: "",
      maturityStage: "Raw concept",
      revenueModel: "",
      pmfAssumptions: "",
      knownCompetitors: "",
      legalConsiderations: "",
      regulatoryConsiderations: "",
      infrastructureDependencies: "",
      localCompetitors: "",
      localLaunchChannels: "",
      localConstraints: "",
      requiredRoles: "",
      contributorSkills: [],
      contributorsNeeded: 0,
      tags: "",
      visibility: "public",
      disclaimer: false,
    },
  });

  if (isUserLoading || !user) return null;

  function onSubmit(data: SubmitFormValues) {
    const { disclaimer: _d, contributorSkills, ...rest } = data;
    createIdea.mutate(
      {
        data: {
          ...rest,
          contributorSkills: contributorSkills?.join(",") || undefined,
        },
      },
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
            A higher-quality submission attracts better collaborators.
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
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corp" className="text-lg h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="summary" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">One-line Summary</FormLabel>
                    <FormDescription>A catchy, concise pitch. (Max 250 chars)</FormDescription>
                    <FormControl>
                      <Input placeholder="We're building the GitHub for physical architecture." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="maturityStage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Maturity Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MATURITY_STAGES.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="visibility" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        Visibility
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public — visible to everyone</SelectItem>
                          <SelectItem value="contributors_only">Contributors only — visible to logged-in users</SelectItem>
                          <SelectItem value="private">Private — only you can see it</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="tags" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>Comma-separated (e.g. b2b, mobile)</FormDescription>
                      <FormControl>
                        <Input placeholder="b2b, ai, marketplace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* The Proposition */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  The Proposition
                </CardTitle>
                <CardDescription>Explain the why, who, and how. The more specific, the higher your quality score.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <FormField control={form.control} name="problemStatement" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Problem Statement *</FormLabel>
                    <FormDescription>What specific pain point are you solving? Who feels it most acutely?</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-24 resize-y" placeholder="Describe the problem clearly..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="proposedSolution" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Proposed Solution *</FormLabel>
                    <FormDescription>How does your product uniquely solve this problem?</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-24 resize-y" placeholder="Describe the solution..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="targetCustomer" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Target Customer *</FormLabel>
                    <FormDescription>Be specific: industry, company size, role, geography, or behaviour.</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-20 resize-y" placeholder="e.g. Small e-commerce merchants in Southeast Asia who process 50-500 orders/day..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="revenueModel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Revenue Model</FormLabel>
                    <FormDescription>How will you make money? Subscription, transaction fee, freemium, etc.</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-20 resize-y" placeholder="e.g. SaaS subscription $49/month per seat, plus 0.5% transaction fee..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Full Description / Vision *</FormLabel>
                    <FormDescription>Any additional details, backstory, or long-term vision.</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-32 resize-y" placeholder="Full details, context, and vision..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="knownCompetitors" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Competitors / Alternatives</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="Who else is doing this? How are you different?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="pmfAssumptions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Assumptions to Test</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="What needs to be true for this to work?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="h-5 w-5 text-chart-2" />
                  Market & Localisation
                </CardTitle>
                <CardDescription>Help contributors understand your specific market context.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="targetRegion" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Market / Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Nigeria, Southeast Asia, UK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="whyThisMarket" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why This Market?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Fastest growing middle class, regulatory gap..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="localCompetitors" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local / Regional Competitors</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="Who specifically is doing this in your target market?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="localLaunchChannels" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Launch Channels</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="How will you reach customers in this market?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="regulatoryConsiderations" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regulatory Considerations</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="Licences, permits, local law requirements..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="infrastructureDependencies" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Infrastructure Dependencies</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-20" placeholder="Logistics, payments, connectivity requirements..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="localConstraints" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local Constraints / Challenges</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20" placeholder="Cultural, linguistic, political, or economic constraints specific to this market..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Contributors */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-chart-4" />
                  Contributor Needs
                </CardTitle>
                <CardDescription>Tell the community what kind of help you're looking for.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <FormField control={form.control} name="contributorSkills" render={() => (
                  <FormItem>
                    <FormLabel>Skills Needed (select all that apply)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {CONTRIBUTOR_SKILLS.map((skill) => (
                        <Controller
                          key={skill}
                          control={form.control}
                          name="contributorSkills"
                          render={({ field }) => (
                            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors text-sm">
                              <Checkbox
                                checked={field.value?.includes(skill)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked ? [...current, skill] : current.filter((s) => s !== skill)
                                  );
                                }}
                              />
                              {skill}
                            </label>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="requiredRoles" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Co-founders / Roles</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Technical Cofounder, CMO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="contributorsNeeded" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Contributors Needed</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="legalConsiderations" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Legal / IP Considerations</FormLabel>
                    <FormDescription>Any existing patents, NDAs, or agreements contributors should know about.</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-20" placeholder="e.g. Provisional patent filed, contributor agreement required..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-3 mb-4">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      By submitting this idea, you confirm that you own or have rights to the content you are sharing.
                      VentureForge does not provide financial, legal, or investment advice. Any collaboration, investment,
                      or commercial arrangement made through this platform is entirely between the parties involved.
                      VentureForge accepts no liability for outcomes arising from interactions on this platform.
                      Your idea will be visible to other users according to the visibility setting you selected.
                    </p>
                  </div>
                </div>
                <FormField control={form.control} name="disclaimer" render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        I understand and agree to the above disclaimer
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
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
