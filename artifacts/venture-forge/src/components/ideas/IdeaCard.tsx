import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowUpCircle, Users, MessageSquare, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

function getStageProgress(stage: string) {
  const index = MATURITY_STAGES.indexOf(stage);
  if (index === -1) return 0;
  return Math.max(5, ((index + 1) / MATURITY_STAGES.length) * 100);
}

export function IdeaCard({ idea }: { idea: Idea }) {
  const progress = getStageProgress(idea.maturityStage);

  return (
    <Link href={`/ideas/${idea.id}`}>
      <Card className="h-full flex flex-col hover-elevate transition-all duration-200 cursor-pointer border-border/50 group overflow-hidden bg-card">
        <CardHeader className="p-5 pb-4">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent rounded-sm px-2">
              {idea.industry}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs font-medium">
              <Target className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{idea.targetRegion}</span>
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
              <span>Stage: {idea.maturityStage}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {idea.tags && (
            <div className="flex flex-wrap gap-1 mt-4">
              {idea.tags.split(',').map((tag) => (
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
          <div className="flex items-center gap-1.5 text-accent-foreground font-medium bg-accent/10 px-2 py-1 rounded text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>{idea.contributorsNeeded} needed</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
