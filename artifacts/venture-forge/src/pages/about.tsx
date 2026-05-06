import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, Target, Users, Zap, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">About VentureForge</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              VentureForge is a marketplace for business ideas and early-stage venture development.
              We believe that great ideas shouldn't die for lack of the right people to execute them.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-20">

        {/* Mission */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg">
            To democratise early-stage venture building by connecting people with ideas to the skills, knowledge,
            and partners they need — regardless of where they are in the world.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Too many great business ideas never become businesses. The barriers aren't just capital — they're access:
            access to co-founders with complementary skills, access to domain expertise in a specific market,
            access to people who've solved the regulatory or infrastructure challenges you're facing.
            VentureForge is built to close those gaps.
          </p>
        </section>

        {/* What makes us different */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Quality over quantity",
                desc: "Our quality score system rewards structured thinking. Ideas with clear problems, defined customers, and thought-through revenue models attract better collaborators.",
              },
              {
                title: "Market-specific depth",
                desc: "We ask about local constraints, local competitors, regulatory considerations, and infrastructure dependencies — because context matters enormously in early-stage ventures.",
              },
              {
                title: "Flexible collaboration",
                desc: "Contributors can offer equity partnerships, paid arrangements, investor interest, or free community support. You choose what works for your situation.",
              },
              {
                title: "Honest and transparent",
                desc: "We're not a funding platform and we don't take a cut. We're a marketplace. We display ideas, facilitate connections, and get out of the way.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-6">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global perspective */}
        <section className="bg-muted/40 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">A Global Perspective</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Entrepreneurship is global, but most idea-sharing platforms are skewed toward a small number of markets.
            VentureForge explicitly asks idea owners about their target market's specific challenges — regulatory environment,
            infrastructure constraints, local competitors, cultural factors. This makes ideas legible to contributors
            who understand those markets, wherever they are in the world.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether you have an idea to share or skills to offer, there's a place for you on VentureForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Create an account <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ideas">Browse Ideas</Link>
            </Button>
          </div>
        </section>

      </div>
    </Layout>
  );
}
