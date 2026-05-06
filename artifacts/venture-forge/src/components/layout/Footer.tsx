import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                VF
              </div>
              <span className="inline-block font-bold text-xl tracking-tight">VentureForge</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Where ambitious people come to find their next big thing.
              A marketplace for business ideas and early-stage venture development.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/ideas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Ideas</Link></li>
              <li><Link href="/ideas/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit an Idea</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join the Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer:</span> VentureForge does not provide financial, legal, or investment advice. Users must do their own due diligence before entering into any commercial, legal, or investment arrangement.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} VentureForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
