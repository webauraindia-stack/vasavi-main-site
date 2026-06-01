import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Phone, ExternalLink, User } from "lucide-react";
import {
  FOUNDER,
  COMMUNITY_SCHEMES,
  INTERNATIONAL_PST,
  VCI_CONTACT,
  QUICK_LINKS,
} from "@/lib/data/vasavi-community";
import { fetchHotels } from "@/lib/hotels/api";

export const metadata: Metadata = {
  title: "About Us | Vasavi Hotels",
  description:
    "HotelHub — eleven Vasavi-affiliated boutique hotels united under the spirit of Vasavi Clubs International since 1961.",
};

export default async function AboutPage() {
  const hotels = await fetchHotels().catch(() => []);

  return (
    <div className="pt-16 pb-20 bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden border-b border-beige">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-105 hover:scale-100"
          style={{ backgroundImage: "url('/images/vasavi-temple-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f0a0a]/75 via-[#4a0e0e]/55 to-[#1f0a0a]/85" />
        <div className="page-container relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm mb-4 leading-tight">
            About HotelHub
          </h1>
          <div className="w-24 h-[3px] bg-champagne-dark mx-auto mb-6 rounded-full shadow-sm"></div>
          <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-sm font-body font-medium">
            Eleven boutique hotels united in spiritual hospitality and noble service.
          </p>
        </div>
      </div>

      <div className="max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto py-16 space-y-20">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-charcoal/90 leading-relaxed text-base md:text-lg">
            <p>
              <strong className="text-charcoal text-lg font-bold block mb-2">Welcome to the Vasavi hotel community.</strong>
              HotelHub is the unified booking platform for eleven distinctive boutique hotels
              across India — from Hyderabad to Goa, Shimla to Kochi — operating in fellowship
              with the ideals of{" "}
              <a
                href={VCI_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne font-bold hover:underline"
              >
                Vasavi Clubs International
              </a>.
            </p>
            <p>
              A need was strongly felt to bring the community to a common platform. The first
              Vasavi Club was inaugurated on {FOUNDER.date} in {FOUNDER.place} by{" "}
              {FOUNDER.name} ({FOUNDER.honorific}), Freedom Fighter and Father of the Vasavi
              Movement, with {FOUNDER.foundingMembers} founding members. HotelHub extends that
              legacy through premium hospitality, donor giving, and service at every property.
            </p>
            <p>
              Our eleven hotels share one standard of excellence — heritage architecture,
              thoughtful amenities, and a commitment to giving back through KCGF education
              support, VKSP family welfare, self-employment loans, and the Sreyobhilashi
              scheme.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="card-surface overflow-hidden group shadow-warm-lg border-beige/60">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-deep">
                <Image 
                  src={FOUNDER.image} 
                  alt={FOUNDER.name}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                  <h3 className="font-display text-lg text-white font-bold mb-1">{FOUNDER.honorific}</h3>
                  <p className="text-[10px] text-champagne-dark uppercase font-bold tracking-wider mb-2">
                    Father of the Vasavi Movement
                  </p>
                  <Link href="/founder" className="inline-flex items-center text-xs text-white/95 hover:text-white hover:underline font-semibold mt-2">
                    Read Founder Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Section */}
        <section className="bg-surface-deep/10 rounded-[var(--radius-devotional)] p-8 sm:p-10 border border-beige/40 shadow-sm">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">Our Collection</h2>
            <div className="h-0.5 w-16 bg-champagne-dark"></div>
            <p className="text-muted text-sm mt-3 font-medium">
              {hotels.length} distinctive properties across {new Set(hotels.map((h) => h.city)).size} cities
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((h) => (
              <Link href={`/hotels/${h.slug}`} key={h.id}>
                <div className="bg-white hover:bg-[#fffdf9] rounded-xl p-4 border border-beige/50 hover:border-champagne-dark/30 shadow-sm transition-all duration-300 group flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-deep flex items-center justify-center text-champagne border border-beige/50 group-hover:bg-champagne group-hover:text-white transition-all duration-300">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm group-hover:text-champagne transition-colors">{h.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-champagne-dark/80" /> {h.city}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Schemes */}
        <section>
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">Community Schemes</h2>
            <div className="h-0.5 w-16 bg-champagne-dark"></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMMUNITY_SCHEMES.map((s) => (
              <Link href={`/schemes#${s.id}`} key={s.id} className="group">
                <div className="card-surface p-5 hover:bg-[#fffdf9] border-beige/50 hover:border-champagne-dark/30 hover:-translate-y-0.5 transition-all duration-300 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-champagne mb-2 block">{s.shortName}</span>
                    <h3 className="font-display text-base text-charcoal font-bold mb-2 group-hover:text-champagne transition-colors">{s.name.split("—")[0].trim()}</h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{s.summary}</p>
                  </div>
                  <div className="text-xs text-champagne font-bold mt-4 flex items-center justify-end group-hover:underline">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/schemes" className="inline-flex items-center text-sm text-champagne font-bold hover:underline">
              Full scheme details →
            </Link>
          </div>
        </section>

        {/* Leadership */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">International Leadership</h2>
            <div className="h-0.5 w-16 bg-champagne-dark mx-auto"></div>
            <p className="text-xs text-muted uppercase font-bold tracking-widest mt-3">Vasavi Clubs International PST</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERNATIONAL_PST.map((p) => (
              <div key={p.role} className="card-surface p-6 bg-[#fffdf9] border-beige/60 text-center shadow-sm hover:shadow-warm transition-shadow duration-300">
                <div className="w-12 h-12 bg-surface-deep rounded-full flex items-center justify-center mx-auto mb-4 border border-beige">
                  <User className="w-6 h-6 text-champagne" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-champagne-dark mb-1">{p.role}</p>
                <p className="font-display text-sm text-charcoal font-bold leading-tight">{p.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Card */}
          <div className="card-surface p-6 bg-surface-deep/20 border-beige/60">
            <h3 className="font-display text-lg text-charcoal mb-4 border-b border-beige/60 pb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-champagne animate-pulse" /> Contact Information
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              <span className="font-bold text-charcoal">Vasavi Clubs International:</span>{" "}
              <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline font-bold">
                {VCI_CONTACT.phone}
              </a>
            </p>
            <p className="text-sm text-muted mt-3 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-champagne-dark shrink-0 mt-0.5" />
              <span>{VCI_CONTACT.address}</span>
            </p>
          </div>

          {/* Quick links Card */}
          <div className="card-surface p-6 bg-[#fffdf9] border-beige/60">
            <h3 className="font-display text-lg text-charcoal mb-4 border-b border-beige/60 pb-2 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-champagne" /> Quick Links (VCI)
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-champagne font-semibold flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 bg-champagne-dark rounded-full"></span> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-beige/30">
          <Link href="/#hotels">
            <Button className="px-6 py-5 bg-champagne hover:bg-temple text-white shadow-md rounded-xl transition-all">
              Browse Hotels
            </Button>
          </Link>
          <Link href="/donors">
            <Button variant="outline" className="px-6 py-5 border-beige/80 rounded-xl hover:bg-surface-deep/30 transition-all text-charcoal">
              Donor Program
            </Button>
          </Link>
          <Link href="/founder">
            <Button variant="outline" className="px-6 py-5 border-beige/80 rounded-xl hover:bg-surface-deep/30 transition-all text-charcoal">
              Our Founder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
