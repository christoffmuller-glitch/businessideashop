import React from "react";
import { Search, Compass, LogIn, ChevronDown, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function Browse() {
  return (
    <div className="min-h-screen font-['Inter'] text-[#24241F] bg-[#F7F3EA]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#DED6C8] bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="#" className="font-['Playfair_Display'] font-bold text-2xl tracking-tight text-[#2F4A3D]">
              Business Idea Shop
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-[#2F4A3D]">
                Explore Ideas
              </a>
              <a href="#" className="text-sm font-medium text-[#6E6A5F] hover:text-[#24241F] transition-colors">
                How It Works
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-[#24241F] hover:bg-[#EAE6DC] hidden sm:flex">
              Log in / Sign up
            </Button>
            <Button className="bg-[#2F4A3D] text-[#FFFDF7] hover:bg-[#243D32] rounded-full px-6">
              Submit Idea
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-3xl">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4 text-[#24241F]">
            Explore Ideas
          </h1>
          <p className="text-lg text-[#6E6A5F] mb-8">
            Discover structured business ideas from founders and operators around the world.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8A98E]" />
            <Input 
              placeholder="Search ideas..." 
              className="w-full pl-12 pr-4 py-6 rounded-2xl border-[#DED6C8] bg-[#FFFDF7] text-lg focus-visible:ring-[#2F4A3D]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <Card className="p-6 bg-[#FFFDF7] border-[#DED6C8] rounded-2xl shadow-sm">
            <div className="space-y-8">
              
              {/* Sort */}
              <div>
                <h3 className="font-semibold text-sm tracking-wider uppercase text-[#6E6A5F] mb-4">Sort By</h3>
                <div className="space-y-3">
                  {["Score ↓", "Newest", "Most discussed"].map((sort, i) => (
                    <label key={sort} className="flex items-center gap-3 cursor-pointer group">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#DED6C8] group-hover:border-[#2F4A3D] transition-colors">
                        {i === 0 && <div className="w-2.5 h-2.5 rounded-full bg-[#2F4A3D]" />}
                      </div>
                      <span className="text-sm text-[#24241F] font-medium">{sort}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <h3 className="font-semibold text-sm tracking-wider uppercase text-[#6E6A5F] mb-4">Industry</h3>
                <div className="space-y-3">
                  {["B2B SaaS", "Fintech", "Health", "Education", "Logistics", "Marketplace", "Consumer"].map(ind => (
                    <div key={ind} className="flex items-center space-x-3">
                      <Checkbox id={`ind-${ind}`} className="border-[#DED6C8] data-[state=checked]:bg-[#2F4A3D] data-[state=checked]:border-[#2F4A3D]" />
                      <label htmlFor={`ind-${ind}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#24241F]">
                        {ind}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage */}
              <div>
                <h3 className="font-semibold text-sm tracking-wider uppercase text-[#6E6A5F] mb-4">Stage</h3>
                <div className="space-y-3">
                  {["Raw concept", "Researching", "Validating", "Prototype", "Pilot", "Launch-ready"].map(stage => (
                    <div key={stage} className="flex items-center space-x-3">
                      <Checkbox id={`stg-${stage}`} className="border-[#DED6C8] data-[state=checked]:bg-[#2F4A3D] data-[state=checked]:border-[#2F4A3D]" />
                      <label htmlFor={`stg-${stage}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#24241F]">
                        {stage}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributor Needs */}
              <div>
                <h3 className="font-semibold text-sm tracking-wider uppercase text-[#6E6A5F] mb-4">Contributor Needs</h3>
                <div className="space-y-3">
                  {["Technical", "Design", "Sales", "Finance", "Legal", "Domain expertise"].map(need => (
                    <div key={need} className="flex items-center space-x-3">
                      <Checkbox id={`need-${need}`} className="border-[#DED6C8] data-[state=checked]:bg-[#2F4A3D] data-[state=checked]:border-[#2F4A3D]" />
                      <label htmlFor={`need-${need}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#24241F]">
                        {need}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Card>
        </aside>

        {/* Main Grid Area - Empty State */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center py-24 px-6 text-center bg-[#FFFDF7] border border-dashed border-[#B8A98E] rounded-3xl">
          <div className="w-20 h-20 bg-[#EAE6DC] rounded-full flex items-center justify-center mb-6">
            <Lightbulb className="w-10 h-10 text-[#2F4A3D]" strokeWidth={1.5} />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#24241F] mb-3">
            No ideas have been submitted yet.
          </h2>
          <p className="text-[#6E6A5F] text-lg max-w-md mb-8">
            Be the first to add a structured business idea to Business Idea Shop.
          </p>
          <Button className="bg-[#2F4A3D] text-[#FFFDF7] hover:bg-[#243D32] rounded-full px-8 py-6 text-lg font-medium">
            Submit an Idea
          </Button>
        </div>

      </main>
    </div>
  );
}
