"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake, Landmark, Building2, Users } from "lucide-react";
import { TRUST_STATS } from "@/lib/data/hotels";
import { useAppLanguage } from "@/hooks/use-app-language";

function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const ICONS = [Users, Landmark, Building2, HeartHandshake];

export function TrustStats() {
  const { t } = useAppLanguage();

  const stats = [
    { label: t("trust.devotees"), value: TRUST_STATS.totalBookings, suffix: "+" },
    { label: t("trust.years"), value: TRUST_STATS.yearsOperating },
    { label: t("trust.temples"), value: TRUST_STATS.cities },
    { label: t("trust.properties"), value: 11 },
  ];

  return (
    <section className="relative z-10 -mt-8">
      <div className="page-container">
        <div className="rounded-[var(--radius-devotional)] border border-beige/50 bg-[#fffdf9]/75 backdrop-blur-[8px] p-6 sm:p-8 shadow-warm grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8 divide-x divide-beige/25">
          {stats.map((stat, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center px-2 first:border-l-0 border-l border-beige/25"
              >
                <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-champagne-dark/15 text-champagne-dark">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-champagne font-black leading-none">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-[0.6875rem] sm:text-xs font-bold uppercase tracking-widest text-muted/95 leading-snug max-w-[160px]">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
