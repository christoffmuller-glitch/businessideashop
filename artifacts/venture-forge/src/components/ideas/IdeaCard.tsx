import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowUpCircle, Users, MessageSquare, Target, Star, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MATURITY_STAGES = [
  "Raw concept",
  "Researching",
  "Validating",
  "Prototype",
  "Pilot",
  "Launch-ready",
  // legacy stages (keep for backward compat)
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

function getStageProgress(stage: string) {
  const index = MATURITY_STAGES.indexOf(stage);
  if (index === -1) return 8;
  // New 6-stage scale maps 0-5 → ~8%-100%; legacy stages map higher
  if (index < 6) return Math.max(8, ((index + 1) / 6) * 100);
  return Math.max(8, ((index - 5) / 11) * 100);
}

function getQualityColor(score: number) {
  if (score >= 75) return "text-emerald-600 bg-emerald-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  if (score >= 25) return "text-orange-600 bg-orange-50";
  return "text-muted-foreground bg-muted";
}

export function IdeaCard({ idea }: { idea: Idea }) {
  const progress = getStageProgress(idea.maturityStage);

  return (
    <Link href={`/ideas/${idea.id}`}>
      <Card className="h-full flex flex-col hover-elevate transition-all duration-200 cursor-pointer border-border/50 group overflow-hidden bg-card">
        <CardHeader className="p-5 pb-4">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent rounded-sm px-2 shrink-0">
                {idea.industry}
              </Badge>
              {idea.featured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-transparent rounded-sm px-2 shrink-0 gap-1">
                  <Star className="h-2.5 w-2.5 fill-amber-500" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs font-medium shrink-0">
              <Target className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{idea.targetRegion}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {idea.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {idea.summary}
          </p>
        </CardHeader>
        
        <CardContent className="p-5 pt-0 flex-grow">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>{idea.maturityStage}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {idea.qualityScore > 0 && (
            <div className={`mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getQualityColor(idea.qualityScore)}`}>
              <Zap className="h-3 w-3" />
              Quality: {idea.qualityScore}/100
            </div>
          )}

          {idea.tags && (
            <div className="flex flex-wrap gap-1 mt-3">
              {idea.tags.split(',').slice(0, 4).map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 px-5 border-t bg-muted/20 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-medium ${idea.userVote === 'up' ? 'text-primary' : ''}`}>
              <ArrowUpCircle className="h-4 w-4" />
              <span>{idea.score}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>{idea.commentsCount}</span>
            </div>
          </div>
          {idea.contributorsNeeded > 0 && (
            <div className="flex items-center gap-1.5 text-accent-foreground font-medium bg-accent/10 px-2 py-1 rounded text-xs">
              <Users className="h-3.5 w-3.5" />
              <span>{idea.contributorsNeeded} needed</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
