"use client";

import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import type { PublicDonor } from "@/lib/api/donors";

interface Props {
  donors: PublicDonor[];
}

export function DonorsMarqueeClient({ donors }: Props) {
  // Duplicate for seamless looping. Need enough to fill 2x screen width.
  const duplicatedDonors = [...donors, ...donors, ...donors, ...donors, ...donors];

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause-on-hover:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Our Generous Donors
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          We are deeply grateful for the continuous support from our community.
        </p>
      </div>

      {/* Marquee Container */}
      <div 
        className="relative flex overflow-hidden w-full pause-on-hover"
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" 
        }}
      >
        <div className="flex w-max animate-marquee">
          {duplicatedDonors.map((donor, idx) => (
            <div
              key={`${donor.id}-${idx}`}
              className="mx-2 sm:mx-4 flex flex-col items-center justify-center p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm min-w-[min(280px,78vw)] sm:min-w-[300px] transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-default"
            >
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 truncate w-full text-center">
                {donor.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1 truncate w-full text-center">
                {donor.club_name || donor.tier}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/donors/directory"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-champagne hover:bg-champagne/90 transition-all duration-200 shadow-warm hover:shadow-warm-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-champagne-dark"
        >
          View All Donors
          <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
