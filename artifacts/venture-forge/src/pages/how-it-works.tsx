import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Lightbulb, Search, Users, Star, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    number: "01",
    title: "Submit Your Idea",
    description:
      "Fill out our structured idea template. The more detail you provide — problem statement, target customer, market reasoning, revenue model — the higher your quality score and the better collaborators you attract.",
    tips: ["Be specific about the problem you're solving", "Define your target customer clearly", "Explain why this market, why now"],
  },
  {
    icon: Search,
    number: "02",
    title: "Get Discovered",
    description:
      "Your idea is listed in our marketplace where investors, co-founders, domain experts, and potential team members can browse, filter, and vote on concepts. Featured ideas appear prominently on the home page.",
    tips: ["Ideas are ranked by quality score, votes, and recency", "Add relevant tags and industry for better discovery", "Set the right visibility: public, contributors-only, or private"],
  },
  {
    icon: Users,
    number: "03",
    title: "Find Collaborators",
    description:
      "Interested contributors express their interest by selecting the skills they offer and how they'd like to be involved — from equity partnerships to paid roles to free community contributions.",
    tips: ["Specify which skills you need in your submission", "Review contributor profiles before accepting", "You control who gets to collaborate"],
  },
  {
    icon: Star,
    number: "04",
    title: "Build Together",
    description:
      "Use the Execution Plan checklist to track venture-building milestones. Add market fit regions to show how your idea translates across different geographies. Engage with community comments.",
    tips: ["Update your maturity stage as you progress", "Use the venture elements checklist to stay organised", "Comment threads help surface blind spots"],
  },
];

const qualityDimensions = [
  { label: "Problem clarity", pts: 15, desc: "How clearly you define the pain point" },
  { label: "Customer specificity", pts: 15, desc: "How precisely you define who has the problem" },
  { label: "Market reasoning", pts: 10, desc: "Why this market, why now" },
  { label: "Feasibility / stage", pts: 10, desc: "Current progress toward a working product" },
  { label: "Differentiation", pts: 10, desc: "Awareness of competitors and your edge" },
  { label: "Revenue model", pts: 10, desc: "How the business makes money" },
  { label: "Localisation", pts: 10, desc: "Market-specific context and constraints" },
  { label: "Contributor readiness", pts: 10, desc: "Skills needed are clearly specified" },
  { label: "Assumptions & evidence", pts: 10, desc: "What needs to be tested or proven" },
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">How VentureForge Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            VentureForge is a marketplace for early-stage business ideas. We connect idea owners with the skills,
            knowledge, and people they need to turn a concept into a venture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button size="lg" asChild>
              <Link href="/ideas/new">Submit an Idea <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ideas">Browse Ideas</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">The Process</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          From raw concept to active venture — here's how it works.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex gap-6">
                <div className="shrink-0">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">{step.number}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality Score */}
      <div className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-amber-500" />
              <h2 className="text-3xl font-bold">The Quality Score</h2>
            </div>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Every idea on VentureForge has a quality score from 0–100. It's not a judgment — it's a signal.
              A higher quality score means your submission has enough depth for contributors to evaluate it properly.
              The score is computed automatically based on how much you fill in:
            </p>
            <div className="space-y-3">
              {qualityDimensions.map((dim) => (
                <div key={dim.label} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                  <div className="w-16 text-right shrink-0">
                    <span className="text-lg font-bold text-primary">{dim.pts}</span>
                    <span className="text-xs text-muted-foreground"> pts</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{dim.label}</div>
                    <div className="text-xs text-muted-foreground">{dim.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Who Is This For?</h2>
        <p className="text-muted-foreground text-center mb-12">Everyone involved in early-stage ventures.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Idea Owners",
              icon: Lightbulb,
              points: [
                "Share a concept you can't execute alone",
                "Get community feedback and votes",
                "Find co-founders and domain experts",
                "Track your venture-building checklist",
              ],
            },
            {
              title: "Contributors",
              icon: Users,
              points: [
                "Find ideas matching your skills",
                "Offer specific help: research, tech, finance, ops",
                "Choose how you contribute: equity, payment, or free",
                "Build a portfolio of ventures you've helped",
              ],
            },
            {
              title: "Scouts & Investors",
              icon: Search,
              points: [
                "Discover early-stage opportunities",
                "Filter by industry, region, and maturity",
                "Sort by quality score to find well-researched ideas",
                "Follow ideas to stay updated",
              ],
            },
          ].map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="bg-card border rounded-xl p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{role.title}</h3>
                <ul className="space-y-2">
                  {role.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Important Note</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                VentureForge is a marketplace and community platform. We do not provide financial, legal, or investment advice.
                Any collaboration, investment, or commercial arrangement made through this platform is entirely between the parties involved.
                Always conduct your own due diligence before entering into any agreement. Ideas shared on this platform
                remain the intellectual property of their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
