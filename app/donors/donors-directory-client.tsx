"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Award, MapPin, Building, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getPublicDonors, type PublicDonor } from "@/lib/api/donors";
import { type Page } from "@/lib/api/paginate";

interface Props {
  initialData: Page<PublicDonor>;
}

const getTierStyles = (tier: string) => {
  const t = tier.toLowerCase();
  if (t.includes('diamond')) return 'bg-cyan-50/80 text-cyan-800 border-cyan-200/50 shadow-sm';
  if (t.includes('platinum')) return 'bg-slate-100/80 text-slate-700 border-slate-300/50 shadow-sm';
  if (t.includes('gold')) return 'bg-[#c9a84c]/10 text-[#8b6914] border-[#c9a84c]/30 shadow-sm';
  if (t.includes('silver')) return 'bg-zinc-100/80 text-zinc-600 border-zinc-200/50 shadow-sm';
  if (t.includes('bronze')) return 'bg-amber-100/50 text-amber-800 border-amber-200/50 shadow-sm';
  return 'bg-[var(--color-beige)]/30 text-[var(--color-temple)] border-[var(--color-beige)]/60 shadow-sm';
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
};

export function DonorsDirectoryClient({ initialData }: Props) {
  const [data, setData] = useState<Page<PublicDonor>>(initialData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [clubName, setClubName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDonors = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await getPublicDonors({
        page: targetPage,
        search: search.trim() || undefined,
        club_name: clubName.trim() || undefined,
      });
      setData(res);
      setPage(targetPage);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, clubName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      void fetchDonors(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchDonors]);

  const hasNextPage = !!data.next;
  const hasPrevPage = !!data.previous;

  return (
    <div className="min-h-screen bg-surface devotional-gradient pt-32 pb-20 relative overflow-hidden">
      {/* Background ambient shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-champagne-dark/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-champagne-dark/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-temple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-[1px] bg-champagne-dark/40"></div>
            <div className="mx-4 p-2 bg-surface-deep rounded-full border border-champagne-dark/20 shadow-sm">
              <Award className="w-6 h-6 text-champagne-dark" />
            </div>
            <div className="w-16 h-[1px] bg-champagne-dark/40"></div>
          </div>
          <h1 className="font-display text-4xl text-temple tracking-widest uppercase sm:text-5xl md:text-6xl drop-shadow-sm mb-6">
            Donors Directory
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-body leading-relaxed">
            Honoring the remarkable individuals and organizations supporting our mission with their generous contributions.
          </p>
        </div>

        {/* Filters */}
        <div className="devotional-search p-6 sm:p-8 rounded-[var(--radius-devotional)] mb-14 flex flex-col md:flex-row gap-5 items-center justify-between mx-auto max-w-4xl">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-champagne-dark" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border border-beige/40 rounded-xl leading-5 bg-white/60 backdrop-blur-md text-charcoal placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-champagne-dark/50 focus:bg-white sm:text-base shadow-inner transition-all"
              placeholder="Search by name or donor ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-champagne-dark" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border border-beige/40 rounded-xl leading-5 bg-white/60 backdrop-blur-md text-charcoal placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-champagne-dark/50 focus:bg-white sm:text-base shadow-inner transition-all"
              placeholder="Filter by organization..."
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </div>
        </div>

        {/* Loading / Content overlay */}
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-[var(--radius-devotional)] transition-all">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping rounded-full h-16 w-16 bg-champagne-dark/20"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-champagne-dark"></div>
              </div>
            </div>
          )}

          {/* Grid */}
          {data.results.length === 0 && !isLoading ? (
            <div className="text-center py-24 bg-white/50 backdrop-blur-md rounded-[var(--radius-devotional)] border border-beige/60 shadow-warm">
              <div className="w-20 h-20 mx-auto bg-surface-deep rounded-full flex items-center justify-center mb-6 border border-beige/80 shadow-inner">
                <Users className="h-10 w-10 text-champagne-dark/60" />
              </div>
              <h3 className="text-2xl font-display text-temple mb-3">No donors found</h3>
              <p className="text-muted max-w-md mx-auto text-lg">
                Try adjusting your search or organization filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {data.results.map((donor) => (
                <motion.div 
                  variants={itemVariants}
                  key={donor.id} 
                  className="stay-card stay-card--donor group flex flex-col"
                >
                  <div className="p-8 flex-grow flex flex-col items-center text-center relative z-10">
                    <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-[0.08] transition-opacity duration-500 scale-150 group-hover:scale-110 origin-top-right">
                      <Award className="w-24 h-24 text-champagne-dark" />
                    </div>
                    
                    <div className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#fffdf9] to-surface-deep flex items-center justify-center mb-6 shadow-warm border border-white group-hover:scale-105 transition-transform duration-500">
                      <span className="font-display text-3xl font-bold text-temple">
                        {donor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-bold text-xl text-charcoal mb-2 leading-tight line-clamp-2 group-hover:text-temple transition-colors duration-300">
                      {donor.name}
                    </h3>
                    
                    <div className="mt-auto pt-6 w-full flex flex-col items-center space-y-3.5">
                      <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] border ${getTierStyles(donor.tier)}`}>
                        <Award className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                        {donor.tier}
                      </div>
                      
                      {donor.club_name && (
                        <div className="flex items-center justify-center text-sm text-muted font-medium w-full px-2">
                          <Building className="flex-shrink-0 mr-2 h-4 w-4 text-champagne-dark/70" />
                          <span className="truncate">{donor.club_name}</span>
                        </div>
                      )}
                      
                      {donor.district_code && (
                        <div className="flex items-center justify-center text-sm text-muted/80 font-medium">
                          <MapPin className="flex-shrink-0 mr-2 h-4 w-4 text-champagne-dark/50" />
                          <span>District {donor.district_code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#fffdf9] px-6 py-4 border-t border-beige/30 relative z-10">
                    <div className="text-xs font-mono font-medium text-muted/70 text-center tracking-wider">
                      ID: {donor.donor_id}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {data.count > 0 && (
          <div className="mt-16 flex items-center justify-between border-t border-beige/60 pt-8 pb-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchDonors(page - 1)}
                disabled={!hasPrevPage}
                className="relative inline-flex items-center px-5 py-2.5 border border-beige/80 text-sm font-semibold rounded-xl text-charcoal bg-white shadow-sm hover:bg-surface-deep hover:border-champagne-dark/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDonors(page + 1)}
                disabled={!hasNextPage}
                className="ml-3 relative inline-flex items-center px-5 py-2.5 border border-beige/80 text-sm font-semibold rounded-xl text-charcoal bg-white shadow-sm hover:bg-surface-deep hover:border-champagne-dark/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted font-medium">
                  Showing <span className="font-bold text-charcoal">{(page - 1) * 20 + 1}</span> to{" "}
                  <span className="font-bold text-charcoal">{Math.min(page * 20, data.count)}</span> of{" "}
                  <span className="font-bold text-charcoal">{data.count}</span> donors
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm overflow-hidden border border-beige/80 bg-white" aria-label="Pagination">
                  <button
                    onClick={() => fetchDonors(page - 1)}
                    disabled={!hasPrevPage}
                    className="relative inline-flex items-center px-3 py-2.5 bg-white text-sm font-medium text-muted hover:bg-surface-deep hover:text-temple disabled:opacity-50 disabled:pointer-events-none transition-colors border-r border-beige/50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => fetchDonors(page + 1)}
                    disabled={!hasNextPage}
                    className="relative inline-flex items-center px-3 py-2.5 bg-white text-sm font-medium text-muted hover:bg-surface-deep hover:text-temple disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
