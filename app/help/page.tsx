"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Crown, 
  Heart, 
  Sparkles, 
  ChevronDown, 
  HelpCircle, 
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I access my Donor stay benefits?",
    answer: "Simply sign in using the phone number or email registered with your Vasavi Clubs International donor profile. Our portal will automatically fetch your membership details, apply your Gold/Silver tier discount, and show priority stay quotas."
  },
  {
    question: "Can I reserve rooms for my family or group?",
    answer: "Yes, both general devotees and donors can book up to 3 rooms under a single reservation. Ensure that check-in guests present valid ID proofs matching the booking details at the reception counter."
  },
  {
    question: "What are the standard check-in and check-out timings?",
    answer: "Most spiritual guest houses operate on a 24-hour cycle or a standard 12:00 PM check-in and 11:00 AM check-out. This allows ample time for strict cleanliness and spiritual purification protocols between guest stays."
  },
  {
    question: "Is the Annadanam meal service open to non-hotel guests?",
    answer: "Yes! Guided by our sacred motto 'Live to Serve', Vasavi Clubs dining halls offer free, pure-vegetarian meals (lunch and dinner) to all visiting pilgrims. While room reservation guests receive priority dining cards, everyone is welcome at our holy tables."
  },
  {
    question: "How are my stay booking contributions utilized?",
    answer: "100% of the room reservation proceeds directly fund community welfare programs, including our 24/7 free dining halls (Annadanam), local mobile healthcare units, Vedic pathshalas, and elderly support shelters across India."
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fffdf9] pt-20 pb-16">
      {/* Header Banner */}
      <div className="bg-surface py-14 md:py-20 border-b border-beige/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="page-container relative z-10 text-center px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-champagne hover:text-champagne-dark mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal font-black text-balance">
            Pilgrim Stay &amp; Donor Guide
          </h1>
          <p className="mt-4 text-base md:text-lg lg:text-xl text-muted leading-relaxed max-w-3xl mx-auto font-semibold">
            Learn how to seamlessly search spiritual stays, unlock exclusive donor room allocations, reserve free meals, and support community welfares.
          </p>
        </div>
      </div>

      {/* Grid of Interactive Guides */}
      <div className="page-container py-12 md:py-16 px-4">
        <h2 className="font-display text-2xl md:text-3.5xl text-charcoal font-black text-center mb-10">
          How to Use Our Website
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Search */}
          <div className="card-surface p-6 md:p-8 flex flex-col justify-between group hover:border-champagne/40 transition-all duration-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-champagne/10 text-champagne-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-charcoal font-black mb-3">
                1. Search Pilgrim Stays
              </h3>
              <p className="text-sm md:text-base text-muted font-semibold leading-relaxed mb-6">
                Enter your destination city (e.g. Srisailam, Tirupati, Varanasi) and selected dates in the search bar. You can instantly filter the properties based on rates, premium amenities, or properties having designated donor rooms.
              </p>
            </div>
            <div className="text-xs font-bold text-champagne uppercase tracking-wider">
              Tip: Tap search fields anywhere on the site to start
            </div>
          </div>

          {/* Card 2: Donor Privileges */}
          <div className="card-surface p-6 md:p-8 flex flex-col justify-between group hover:border-champagne/40 transition-all duration-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-champagne/10 text-champagne-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Crown className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-charcoal font-black mb-3">
                2. Access Donor Privileges
              </h3>
              <p className="text-sm md:text-base text-muted font-semibold leading-relaxed mb-6">
                Vasavi Clubs International offers stay privileges for registered donors. Log in to claim your complimentary stay days or priority allocations:
              </p>
              <ul className="space-y-2 mb-6 text-xs md:text-sm font-semibold text-muted pl-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-champagne shrink-0" />
                  <strong>Gold Tier:</strong> 4 free nights/year &amp; 30% discount
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-champagne shrink-0" />
                  <strong>Silver Tier:</strong> 2 free nights/year &amp; 20% discount
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-champagne shrink-0" />
                  <strong>Bronze Tier:</strong> Exclusive stay quotas &amp; 15% discount
                </li>
              </ul>
            </div>
            <Link href="/donors" className="text-xs font-bold text-champagne uppercase tracking-wider hover:underline">
              Learn about our Donor Program &rarr;
            </Link>
          </div>

          {/* Card 3: Annadanam */}
          <div className="card-surface p-6 md:p-8 flex flex-col justify-between group hover:border-champagne/40 transition-all duration-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-champagne/10 text-champagne-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-charcoal font-black mb-3">
                3. Book Complimentary Annadanam
              </h3>
              <p className="text-sm md:text-base text-muted font-semibold leading-relaxed mb-6">
                Enjoy pure satvik, traditional vegetarian lunches and dinners at all our properties. During the room booking checkout process, you can easily reserve dining slots for your entire party at no extra cost under our community welfare initiative.
              </p>
            </div>
            <div className="text-xs font-bold text-champagne uppercase tracking-wider">
              100% vegetarian &amp; sanctified pilgrim meals
            </div>
          </div>

          {/* Card 4: Welfares */}
          <div className="card-surface p-6 md:p-8 flex flex-col justify-between group hover:border-champagne/40 transition-all duration-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-champagne/10 text-champagne-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-charcoal font-black mb-3">
                4. Support Community Schemes
              </h3>
              <p className="text-sm md:text-base text-muted font-semibold leading-relaxed mb-6">
                Every reservation you make on Vasavi Hotels goes directly toward financing local community support schemes. These include pilgrim guest houses, educational scholarships for needy children (KCGF), and high-quality emergency health centers.
              </p>
            </div>
            <Link href="/schemes" className="text-xs font-bold text-champagne uppercase tracking-wider hover:underline">
              Explore our welfare programs &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Accordion FAQs Section */}
      <div className="bg-[#fffbf0] py-14 md:py-20 border-y border-beige/60">
        <div className="page-container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-champagne mb-3">
              <HelpCircle className="h-4 w-4" />
              Common Inquiries
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal font-black">
              Pilgrim Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted font-semibold">
              Quick answers to help you organize a hassle-free, spiritual journey.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl border border-beige bg-white shadow-warm-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-charcoal text-base md:text-lg hover:text-champagne transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    {faq.question}
                    <ChevronDown className={`h-5 w-5 text-champagne shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-60 border-t border-beige/50" : "max-h-0"}`}
                  >
                    <p className="p-5 text-sm md:text-base text-muted leading-relaxed font-semibold">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="page-container py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto rounded-3xl border border-champagne/20 bg-surface/60 p-8 md:p-12 shadow-warm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <h2 className="font-display text-2xl md:text-4xl text-charcoal font-black mb-4">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="text-sm md:text-base text-muted font-semibold leading-relaxed mb-8">
            Return to our stays directory and choose from our premium guest houses across India&apos;s holiest destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button size="lg" className="rounded-full px-8 shadow-warm-md w-full sm:w-auto">
                Explore Stay Houses
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-beige hover:bg-surface w-full sm:w-auto">
                Contact Support Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
