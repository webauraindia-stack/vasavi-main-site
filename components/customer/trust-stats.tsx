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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[var(--radius-devotional)] border border-beige/70 bg-white p-4 sm:p-5 shadow-warm-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-champagne/10 text-champagne">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-champagne font-bold leading-none">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-muted leading-snug">
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
