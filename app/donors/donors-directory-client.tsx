"use client";

import { useState, useEffect } from "react";
import { Search, Award, MapPin, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicDonors, type PublicDonor } from "@/lib/api/donors";
import { type Page } from "@/lib/api/paginate";

interface Props {
  initialData: Page<PublicDonor>;
}

export function DonorsDirectoryClient({ initialData }: Props) {
  const [data, setData] = useState<Page<PublicDonor>>(initialData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [clubName, setClubName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDonors(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, clubName]);

  const fetchDonors = async (targetPage: number) => {
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
  };

  const hasNextPage = !!data.next;
  const hasPrevPage = !!data.previous;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl text-charcoal tracking-widest uppercase sm:text-5xl">
            Donors Directory
          </h1>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Honoring the remarkable individuals and organizations supporting our mission.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Search by name or donor ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Filter by organization/club..."
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </div>
        </div>

        {/* Loading overlay */}
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-50/50 z-10 flex items-center justify-center rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Grid */}
          {data.results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Award className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No donors found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.results.map((donor) => (
                <div 
                  key={donor.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="p-6 flex-grow flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                      <span className="text-2xl font-bold text-blue-700">
                        {donor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight line-clamp-2">
                      {donor.name}
                    </h3>
                    
                    <div className="mt-auto pt-4 space-y-2 w-full">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Award className="h-3.5 w-3.5 mr-1" />
                        {donor.tier}
                      </div>
                      
                      {donor.club_name && (
                        <div className="flex items-center justify-center text-sm text-slate-600 mt-2">
                          <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                          <span className="truncate">{donor.club_name}</span>
                        </div>
                      )}
                      
                      {donor.district_code && (
                        <div className="flex items-center justify-center text-sm text-slate-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                          <span>{donor.district_code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                    <div className="text-xs font-mono text-slate-500 text-center">
                      ID: {donor.donor_id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.count > 0 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchDonors(page - 1)}
                disabled={!hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDonors(page + 1)}
                disabled={!hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * 20, data.count)}</span> of{" "}
                  <span className="font-medium">{data.count}</span> donors
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => fetchDonors(page - 1)}
                    disabled={!hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => fetchDonors(page + 1)}
                    disabled={!hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
