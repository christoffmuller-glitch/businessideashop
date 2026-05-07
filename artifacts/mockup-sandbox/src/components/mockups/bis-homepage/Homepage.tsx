import React from 'react';
import { 
  ArrowRight, 
  Search, 
  Lightbulb, 
  BarChart, 
  Globe2, 
  Users, 
  CheckCircle2, 
  Rocket, 
  Zap,
  TrendingUp,
  MapPin,
  Target,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Menu
} from 'lucide-react';

const COLORS = {
  bg: '#F7F3EA',
  surface: '#FFFDF7',
  text: '#24241F',
  textSecondary: '#6E6A5F',
  primary: '#2F4A3D',
  primaryHover: '#243D32',
  border: '#DED6C8',
  accent: '#B8A98E',
  badgeBg: '#EAE6DC',
};

const TYPOGRAPHY = {
  heading: "'Playfair Display', serif",
  body: "'Inter', sans-serif"
};

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const isPrimary = variant === 'primary';
  return (
    <button
      className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md ${className}`}
      style={{
        backgroundColor: isPrimary ? COLORS.primary : 'transparent',
        color: isPrimary ? '#FFF' : COLORS.primary,
        border: `1px solid ${isPrimary ? COLORS.primary : COLORS.border}`,
      }}
      onMouseEnter={(e) => {
        if (isPrimary) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
        else e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
      }}
      onMouseLeave={(e) => {
        if (isPrimary) e.currentTarget.style.backgroundColor = COLORS.primary;
        else e.currentTarget.style.backgroundColor = 'transparent';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = '' }: any) => (
  <span 
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    style={{ backgroundColor: COLORS.badgeBg, color: COLORS.text }}
  >
    {children}
  </span>
);

export function Homepage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: TYPOGRAPHY.body }}>
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 w-full backdrop-blur-md"
        style={{ 
          backgroundColor: 'rgba(255, 253, 247, 0.9)', 
          borderBottom: `1px solid ${COLORS.border}` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm tracking-wider"
                style={{ backgroundColor: COLORS.primary }}
              >
                BIS
              </div>
              <span className="font-semibold text-lg" style={{ fontFamily: TYPOGRAPHY.heading, color: COLORS.text }}>
                Business Idea Shop
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium transition-colors" style={{ color: COLORS.textSecondary }}>Explore Ideas</a>
              <a href="#" className="text-sm font-medium transition-colors" style={{ color: COLORS.textSecondary }}>How It Works</a>
              <a href="#" className="text-sm font-medium transition-colors" style={{ color: COLORS.textSecondary }}>Submit Idea</a>
              <div className="h-4 w-px" style={{ backgroundColor: COLORS.border }}></div>
              <a href="#" className="text-sm font-medium" style={{ color: COLORS.text }}>Log in</a>
              <Button variant="primary" className="!px-4 !py-2 !text-xs">Sign up</Button>
            </div>
            <div className="md:hidden flex items-center">
              <Menu size={24} color={COLORS.text} />
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8 max-w-2xl">
              <Badge className="mb-4">
                <Sparkles size={12} className="mr-1.5" />
                Private beta — structured idea development
              </Badge>
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight"
                style={{ fontFamily: TYPOGRAPHY.heading, color: COLORS.text }}
              >
                Turn promising business ideas into launchable opportunities.
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed max-w-xl" style={{ color: COLORS.textSecondary }}>
                Business Idea Shop helps founders, operators and contributors submit, structure, rank, localise and develop business ideas — then match them with the people needed to move from concept to launch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button>
                  Submit an Idea <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button variant="ghost">
                  <Search size={16} className="mr-2" /> Explore Ideas
                </Button>
              </div>
            </div>

            {/* Decorative Visual */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-xl border border-dashed" style={{ borderColor: COLORS.accent }}></div>
              <div className="grid gap-4 relative z-10">
                {/* Mock Card 1 */}
                <div 
                  className="p-6 rounded-xl shadow-sm transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge>Validation Phase</Badge>
                    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.primary }}>
                      <TrendingUp size={14} /> 86/100
                    </div>
                  </div>
                  <h3 className="text-xl mb-2 font-medium" style={{ fontFamily: TYPOGRAPHY.heading }}>Automated Cold Chain Logistics Platform</h3>
                  <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.textSecondary }}>
                    <span className="flex items-center gap-1"><MapPin size={14} /> APAC</span>
                    <span className="flex items-center gap-1"><Target size={14} /> B2B SaaS</span>
                  </div>
                </div>

                {/* Mock Card 2 */}
                <div 
                  className="p-6 rounded-xl shadow-sm translate-x-8 transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge>Prototype Ready</Badge>
                    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.primary }}>
                      <TrendingUp size={14} /> 92/100
                    </div>
                  </div>
                  <h3 className="text-xl mb-2 font-medium" style={{ fontFamily: TYPOGRAPHY.heading }}>AI-Driven Legal Discovery for Small Firms</h3>
                  <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.textSecondary }}>
                    <span className="flex items-center gap-1"><MapPin size={14} /> North America</span>
                    <span className="flex items-center gap-1"><Target size={14} /> LegalTech</span>
                  </div>
                </div>

                {/* Mock Card 3 */}
                <div 
                  className="p-6 rounded-xl shadow-sm transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge>Concept</Badge>
                    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.primary }}>
                      <TrendingUp size={14} /> 74/100
                    </div>
                  </div>
                  <h3 className="text-xl mb-2 font-medium" style={{ fontFamily: TYPOGRAPHY.heading }}>Decentralised Energy Trading for Residential</h3>
                  <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.textSecondary }}>
                    <span className="flex items-center gap-1"><MapPin size={14} /> Europe</span>
                    <span className="flex items-center gap-1"><Target size={14} /> ClimateTech</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 border-t" style={{ borderColor: COLORS.border, backgroundColor: 'rgba(255, 253, 247, 0.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.accent }}>The Process</h2>
              <p className="text-3xl md:text-4xl" style={{ fontFamily: TYPOGRAPHY.heading }}>How ideas become ventures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {[
                { title: 'Submit an idea', desc: 'Detail the problem, solution, and market context.' },
                { title: 'Structure the opportunity', desc: 'Standardise the thesis into a comparable format.' },
                { title: 'Score & rank', desc: 'Objective evaluation across 10 key viability dimensions.' },
                { title: 'Localise by market', desc: 'Adapt the core idea for specific regional dynamics.' },
                { title: 'Match contributors', desc: 'Find the technical and operational talent to build it.' },
                { title: 'Move toward launch', desc: 'Track progress from concept through to prototype.' },
              ].map((step, i) => (
                <div key={i} className="relative p-6 rounded-lg" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-4"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {i + 1}
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>{step.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built Different */}
        <section className="py-24 border-t" style={{ borderColor: COLORS.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.accent }}>Built different</h2>
              <p className="text-3xl md:text-4xl leading-tight" style={{ fontFamily: TYPOGRAPHY.heading }}>
                A systematic approach to ideation, not just a message board.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {[
                { icon: Layers, title: 'Structured submissions', desc: 'No vague pitches. Every idea follows a rigorous template to ensure comparability.' },
                { icon: BarChart, title: 'Transparent scoring (0-100)', desc: 'Ideas are scored automatically and by experts across viability, market size, and timing.' },
                { icon: Globe2, title: 'Market localisation', desc: 'What works in the US might need tweaking for SEA. Ideas are forked and adapted by region.' },
                { icon: Users, title: 'Contributor matching', desc: 'Ideas need execution. We pair promising concepts with builders who have the right skills.' },
                { icon: ShieldCheck, title: 'Evidence-based development', desc: 'Move ideas through phases based on actual validation, not just gut feeling.' },
                { icon: Rocket, title: 'Launch pathway', desc: 'Clear milestones from initial submission to gathering a founding team and spinning out.' },
              ].map((feature, i) => (
                <div key={i}>
                  <div className="mb-4 inline-flex p-3 rounded-lg" style={{ backgroundColor: COLORS.badgeBg }}>
                    <feature.icon size={24} style={{ color: COLORS.primary }} />
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ fontFamily: TYPOGRAPHY.heading }}>{feature.title}</h4>
                  <p className="text-base leading-relaxed" style={{ color: COLORS.textSecondary }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built For */}
        <section className="py-24 border-t" style={{ borderColor: COLORS.border, backgroundColor: 'rgba(255, 253, 247, 0.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-3xl md:text-4xl" style={{ fontFamily: TYPOGRAPHY.heading }}>Who it's for</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Aspiring founders', desc: 'Looking for validated ideas to build' },
                { title: 'Domain experts', desc: 'Have industry insights but need builders' },
                { title: 'Technical builders', desc: 'Want to code without searching for a problem' },
                { title: 'Operators', desc: 'Ready to bring execution chops to a concept' },
                { title: 'Investors & advisors', desc: 'Scouting early signals and talent' },
                { title: 'Incubators & innovation teams', desc: 'Sourcing structured dealflow' },
              ].map((audience, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-xl flex items-start gap-4 transition-colors hover:bg-white"
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  <div className="mt-1"><CheckCircle2 size={20} style={{ color: COLORS.primary }} /></div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1" style={{ color: COLORS.text }}>{audience.title}</h4>
                    <p className="text-sm" style={{ color: COLORS.textSecondary }}>{audience.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 border-t text-center px-4" style={{ borderColor: COLORS.border }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: TYPOGRAPHY.heading }}>Ready to submit your first idea?</h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
              Join a curated community of builders, operators, and experts structuring the next wave of businesses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="!px-8 !py-4 !text-base">Submit an Idea</Button>
              <Button variant="ghost" className="!px-8 !py-4 !text-base">Explore Ideas</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[10px] tracking-wider"
              style={{ backgroundColor: COLORS.primary }}
            >
              BIS
            </div>
            <span className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
              © 2025 Business Idea Shop
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: COLORS.textSecondary }}>
            <a href="#" className="hover:text-black transition-colors">Explore Ideas</a>
            <a href="#" className="hover:text-black transition-colors">How It Works</a>
            <a href="#" className="hover:text-black transition-colors">About</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
