import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Sparkles,
  Award,
  Filter,
  Users
} from 'lucide-react';
import { Opportunity } from '../types';
import { api } from '../services/api';
import { CareerJourneyVisual } from '../components/CareerJourneyVisual';

export const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const categories = [
    'All',
    'Hiring Challenges',
    'Hackathons',
    'Coding Contests',
    'Internships',
    'Technical Challenges'
  ];

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunities(
        selectedCategory,
        searchQuery,
        onlyBookmarks
      );
      setOpportunities(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, [selectedCategory, onlyBookmarks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpps();
  };

  const handleToggleBookmark = async (id: number) => {
    try {
      const res = await api.toggleBookmark(id);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, is_bookmarked: res.bookmarked } : o))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          <span>Hiring Radar & Competitions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Opportunities & Challenges</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Apply your mastered patterns to real-world hiring challenges, hackathons, and company recruitment drives.
        </p>
      </div>

      {/* Visual Career Journey Component */}
      <CareerJourneyVisual />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, title, or skills (e.g. Python, Google)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </form>

          {/* Bookmarks toggle */}
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              onlyBookmarks
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked Only</span>
          </button>
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <div className="text-white font-bold text-sm">No opportunities found</div>
          <div className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or category filter.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      {opp.organization}
                    </span>
                    <h3 className="font-bold text-base text-white mt-0.5 leading-snug">{opp.title}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(opp.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors shrink-0"
                    title={opp.is_bookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
                  >
                    {opp.is_bookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Badge tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {opp.category}
                  </span>
                  {opp.is_demo && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Demo Opportunity
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800">
                    {opp.location}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500">Eligibility:</span> {opp.eligibility}
                  </div>
                  <div>
                    <span className="text-slate-500">Required Skills:</span>{' '}
                    <span className="font-mono text-cyan-300">{opp.skills}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold text-[11px] pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {opp.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">{opp.stipend_or_prize}</span>
                <a
                  href={opp.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 flex items-center gap-1 transition-all"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
