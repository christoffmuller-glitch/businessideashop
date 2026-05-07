import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Share, 
  Flag, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User, 
  ChevronRight,
  TrendingUp,
  Award,
  Globe2
} from 'lucide-react';

export function Detail() {
  const [activeTab, setActiveTab] = useState('Pitch');
  const [upvotes, setUpvotes] = useState(342);
  const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (hasVoted === type) {
      setHasVoted(null);
      setUpvotes(type === 'up' ? upvotes - 1 : upvotes + 1);
    } else {
      let diff = 0;
      if (hasVoted === 'up' && type === 'down') diff = -2;
      else if (hasVoted === 'down' && type === 'up') diff = 2;
      else diff = type === 'up' ? 1 : -1;
      
      setHasVoted(type);
      setUpvotes(upvotes + diff);
    }
  };

  const tabs = ['Pitch', 'Localisation', 'Execution', 'Market Fit', 'Discussion'];

  return (
    <div className="min-h-screen font-['Inter']" style={{ backgroundColor: '#F7F3EA', color: '#24241F' }}>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 253, 247, 0.9)', borderColor: '#DED6C8' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold font-['Playfair_Display'] tracking-tight" style={{ color: '#2F4A3D' }}>
              Business Idea Shop
            </span>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: '#6E6A5F' }}>
              <a href="#" className="hover:text-[#2F4A3D] transition-colors">Explore Ideas</a>
              <a href="#" className="hover:text-[#2F4A3D] transition-colors">How It Works</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a href="#" className="hidden md:block hover:text-[#2F4A3D] transition-colors" style={{ color: '#6E6A5F' }}>Submit Idea</a>
            <div className="w-px h-4 bg-[#DED6C8] hidden md:block"></div>
            <a href="#" className="hover:text-[#2F4A3D] transition-colors" style={{ color: '#6E6A5F' }}>Login</a>
            <button className="px-5 py-2.5 rounded-full text-white transition-colors" style={{ backgroundColor: '#2F4A3D' }}>
              Sign up
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#6E6A5F' }}>
          <a href="#" className="hover:text-[#2F4A3D]">Ideas</a>
          <ChevronRight size={14} />
          <a href="#" className="hover:text-[#2F4A3D]">LegalTech</a>
          <ChevronRight size={14} />
          <span style={{ color: '#24241F' }}>AI Compliance Briefs</span>
        </div>

        {/* Header Area */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-8 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: '#EAE6DC', color: '#6E6A5F' }}>
                  Prototype
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: '#FDF8E1', color: '#B8A98E' }}>
                  <Star size={12} className="fill-current" /> Featured
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold leading-tight mb-4" style={{ color: '#24241F' }}>
                AI-powered regulatory compliance brief generator for SMEs
              </h1>
              <p className="text-xl leading-relaxed max-w-3xl" style={{ color: '#6E6A5F' }}>
                A tool that generates market-specific regulatory summaries for small businesses entering new markets, reducing legal discovery costs by 80%.
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="hidden lg:flex flex-col gap-3 min-w-[200px]">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:bg-[#243D32]" style={{ backgroundColor: '#2F4A3D' }}>
                <TrendingUp size={18} /> Offer to Contribute
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors border" style={{ backgroundColor: 'transparent', borderColor: '#DED6C8', color: '#2F4A3D' }}>
                Follow Idea
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pb-8 border-b" style={{ borderColor: '#DED6C8' }}>
            <div className="flex items-center gap-2 bg-white rounded-lg border px-2 py-1 shadow-sm" style={{ borderColor: '#DED6C8' }}>
              <button 
                onClick={() => handleVote('up')}
                className={`p-2 rounded hover:bg-[#F7F3EA] transition-colors ${hasVoted === 'up' ? 'text-[#2F4A3D]' : 'text-[#6E6A5F]'}`}
              >
                <ArrowUp size={20} />
              </button>
              <span className="font-bold text-lg min-w-[3ch] text-center">{upvotes}</span>
              <button 
                onClick={() => handleVote('down')}
                className={`p-2 rounded hover:bg-[#F7F3EA] transition-colors ${hasVoted === 'down' ? 'text-red-600' : 'text-[#6E6A5F]'}`}
              >
                <ArrowDown size={20} />
              </button>
            </div>

            <div className="h-10 w-px bg-[#DED6C8]"></div>

            <div className="flex items-center gap-3">
              <Globe2 size={20} style={{ color: '#6E6A5F' }} />
              <div className="flex gap-2 text-sm font-medium">
                <span className="px-3 py-1.5 rounded-md border bg-white" style={{ borderColor: '#DED6C8', color: '#24241F' }}>🇬🇧 UK</span>
                <span className="px-3 py-1.5 rounded-md border bg-white" style={{ borderColor: '#DED6C8', color: '#24241F' }}>🇸🇬 Singapore</span>
                <span className="px-3 py-1.5 rounded-md border bg-white" style={{ borderColor: '#DED6C8', color: '#24241F' }}>🇳🇬 Nigeria</span>
              </div>
            </div>

            <div className="h-10 w-px bg-[#DED6C8] hidden sm:block"></div>

            <div className="flex-1 max-w-xs hidden sm:block">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium" style={{ color: '#2F4A3D' }}><Award size={16} className="inline mr-1 pb-0.5" />Quality Score</span>
                <span className="font-bold">74 / 100</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#EAE6DC' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: '74%', backgroundColor: '#2F4A3D' }}></div>
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <button className="p-2.5 rounded-lg border hover:bg-white transition-colors text-[#6E6A5F]" style={{ borderColor: '#DED6C8' }}>
                <Share size={18} />
              </button>
              <button className="p-2.5 rounded-lg border hover:bg-white transition-colors text-[#6E6A5F]" style={{ borderColor: '#DED6C8' }}>
                <Flag size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content (Left, ~65%) */}
          <div className="flex-1 lg:w-[65%]">
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar border-b mb-8" style={{ borderColor: '#DED6C8' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-[#2F4A3D] text-[#2F4A3D]' 
                      : 'border-transparent text-[#6E6A5F] hover:text-[#24241F] hover:border-[#DED6C8]'
                  }`}
                >
                  {tab} {tab === 'Discussion' && <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#EAE6DC' }}>24</span>}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border p-8 shadow-sm" style={{ borderColor: '#DED6C8', backgroundColor: '#FFFDF7' }}>
              {activeTab === 'Pitch' && (
                <div className="space-y-10">
                  <section>
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4" style={{ color: '#24241F' }}>The Problem</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#6E6A5F' }}>
                      When SMEs attempt to expand internationally, their first major hurdle is understanding the regulatory landscape of the new market. Hiring local counsel for initial discovery is prohibitively expensive (often $5,000-$15,000 just for a preliminary brief). As a result, many small businesses either abandon expansion plans or enter markets blindly, exposing themselves to massive compliance risks, fines, and operational shutdowns.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4" style={{ color: '#24241F' }}>Target Customer</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#6E6A5F' }}>
                      B2B SaaS companies, e-commerce brands, and specialized service providers with 10-500 employees looking to enter Tier 1 and Tier 2 international markets. The buyer is typically the CEO, COO, or VP of Expansion who needs quick, reliable answers before committing resources to a new region.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4" style={{ color: '#24241F' }}>Proposed Solution</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#6E6A5F' }}>
                      An AI-driven platform that ingests the latest regulatory databases and official government publications from target countries. Users input their business model, data collection practices, and target market. The system generates a comprehensive, plain-English "Compliance Action Plan" detailing required licenses, data privacy obligations (like GDPR vs. PDPA), employment laws, and tax implications, complete with confidence scores and citations to actual statutes.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4" style={{ color: '#24241F' }}>Revenue Model</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#6E6A5F' }}>
                      Pay-per-brief pricing model starting at $299 for a standard preliminary report, with an upsell to $899 for a deep-dive report reviewed by a verified legal partner in that jurisdiction (hybrid AI + human model). A subscription tier at $1,200/yr for continuous monitoring of regulatory changes in selected markets.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4" style={{ color: '#24241F' }}>Why This Market</h2>
                    <p className="text-base leading-relaxed" style={{ color: '#6E6A5F' }}>
                      Cross-border trade for digital services is exploding, but regulatory fragmentation is increasing (e.g., EU AI Act, diverse state privacy laws in the US, digital service taxes globally). The gap between "too small for a global law firm" and "too complex for Google searches" is widening rapidly.
                    </p>
                  </section>

                  <section className="pt-6 border-t" style={{ borderColor: '#DED6C8' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#6E6A5F' }}>Contributor Skills Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Full-stack Developer', 'Legal Expert (UK/EU)', 'Data Engineer', 'B2B Marketing', 'Finance'].map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-full text-sm font-medium border" style={{ borderColor: '#DED6C8', backgroundColor: '#F7F3EA', color: '#24241F' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab !== 'Pitch' && (
                <div className="py-20 text-center">
                  <p className="text-lg italic" style={{ color: '#6E6A5F' }}>Content for {activeTab} would be displayed here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right, ~35%) */}
          <div className="lg:w-[35%] space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm sticky top-28" style={{ borderColor: '#DED6C8', backgroundColor: '#FFFDF7' }}>
              
              {/* Sidebar Header - Mobile actions duplicated for small screens */}
              <div className="flex lg:hidden flex-col gap-3 mb-8">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:bg-[#243D32]" style={{ backgroundColor: '#2F4A3D' }}>
                  Offer to Contribute
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors border" style={{ backgroundColor: 'transparent', borderColor: '#DED6C8', color: '#2F4A3D' }}>
                  Follow Idea
                </button>
              </div>

              {/* Stats & Meta List */}
              <div className="space-y-5">
                
                <div className="pb-5 border-b" style={{ borderColor: '#DED6C8' }}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium" style={{ color: '#2F4A3D' }}><Award size={16} className="inline mr-1 pb-0.5" />Quality Score</span>
                    <span className="font-bold">74 / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#EAE6DC' }}>
                    <div className="h-full rounded-full" style={{ width: '74%', backgroundColor: '#2F4A3D' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6E6A5F' }}>Stage</span>
                  <span className="font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: '#EAE6DC' }}>Prototype</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6E6A5F' }}>Industry</span>
                  <span className="font-medium">LegalTech / B2B SaaS</span>
                </div>

                <div className="flex justify-between items-start text-sm gap-4">
                  <span style={{ color: '#6E6A5F' }}>Target Market</span>
                  <span className="font-medium text-right">UK, Singapore, Nigeria</span>
                </div>

                <div className="pt-5 border-t space-y-4" style={{ borderColor: '#DED6C8' }}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: '#6E6A5F' }}>
                      <User size={16} /> Submitted by
                    </span>
                    <span className="font-medium hover:underline cursor-pointer" style={{ color: '#2F4A3D' }}>@founder_anon</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: '#6E6A5F' }}>
                      <Calendar size={16} /> Date
                    </span>
                    <span className="font-medium text-right">12 May 2025</span>
                  </div>
                </div>

                <div className="pt-5 border-t flex justify-between text-sm" style={{ borderColor: '#DED6C8', color: '#6E6A5F' }}>
                  <span className="flex items-center gap-1.5"><Eye size={16} /> 1,204 views</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={16} /> 24 comments</span>
                </div>

              </div>

              {/* Desktop Actions (duplicate from header for sticky access if needed, but per spec "Clean card with... Offer to Contribute... Follow") */}
              <div className="mt-8 space-y-3 pt-6 border-t" style={{ borderColor: '#DED6C8' }}>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-white font-medium transition-colors hover:bg-[#243D32] shadow-sm" style={{ backgroundColor: '#2F4A3D' }}>
                  Offer to Contribute
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium transition-colors border hover:bg-[#F7F3EA]" style={{ backgroundColor: 'transparent', borderColor: '#DED6C8', color: '#2F4A3D' }}>
                  Follow this idea
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
