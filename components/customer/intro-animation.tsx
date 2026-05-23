"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Check if animation already played in this session
    const hasPlayed = sessionStorage.getItem("vasavi_intro_played");
    if (hasPlayed) {
      onComplete();
      return;
    }

    setShow(true);
    sessionStorage.setItem("vasavi_intro_played", "true");

    // Generate random particles client-side to avoid SSR mismatch
    setParticles(
      Array.from({ length: 25 }).map(() => ({
        x: Math.random() * 100, // percentage width
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      }))
    );

    // Soft bell tone via Web Audio (no external file — avoids 404 on missing /sounds/temple-bell.mp3)
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        void ctx.resume();
      }
    } catch {
      // Autoplay blocked — ignore
    }

    // Phase orchestration
    // Phase 1 (0-1.2s): Particles + glowing light
    // Phase 2 (1.2-2.5s): Lotus emblem + rays
    // Phase 3 (2.5-3.8s): Text logo + tagline
    // Phase 4 (3.8-4.5s): Location pin
    // Phase 5 (4.5-5.0s): Reveal / search bar expansion
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 4500),
      setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 600); // Trigger parent reveal when fading out
      }, 4800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (!mounted || (!show && phase === 0)) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fffdf9] overflow-hidden"
        >
          {/* Subtle Traditional Indian Pattern Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236b1414\' fill-opacity=\'1\'%3E%3Cpath d=\'M30 0l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' 
            }} 
          />

          {/* Floating Golden Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: [0, 0.7, 0], 
                  y: -200 
                }}
                transition={{ 
                  duration: p.duration, 
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeOut"
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#c9a84c] blur-[1px]"
                style={{ left: `${p.x}%`, top: "60%" }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center justify-center h-full w-full">
            
            {/* Phase 1 & 2: Divine Light and Lotus Emblem */}
            <AnimatePresence mode="wait">
              {phase < 2 && (
                <motion.div
                  key="emblem"
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.4, filter: "blur(10px)", transition: { duration: 0.6 } }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute flex items-center justify-center"
                >
                  {/* Glowing divine light */}
                  <div className="absolute h-[300px] w-[300px] rounded-full bg-[#c9a84c]/20 blur-[80px]" />
                  
                  {/* Golden Rays */}
                  {phase >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                      animate={{ opacity: 0.25, rotate: 45, scale: 1 }}
                      transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                      className="absolute inset-0 m-auto h-[400px] w-[400px]"
                    >
                      <svg viewBox="0 0 100 100" className="h-full w-full fill-[#c9a84c]">
                        <path d="M50 0L52 40L90 10L60 48L100 50L60 52L90 90L52 60L50 100L48 60L10 90L40 52L0 50L40 48L10 10L48 40Z" />
                      </svg>
                    </motion.div>
                  )}

                  {/* Vasavi Mata Inspired Lotus Emblem SVG */}
                  <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_20px_rgba(201,168,76,0.6)]">
                    <path d="M50 5 C65 25, 85 45, 95 65 C95 85, 75 95, 50 95 C25 95, 5 85, 5 65 C15 45, 35 25, 50 5 Z" fill="url(#maroon-grad)" stroke="#c9a84c" strokeWidth="1.5"/>
                    <path d="M50 15 C58 30, 75 45, 80 60 C80 75, 65 85, 50 85 C35 85, 20 75, 20 60 C25 45, 42 30, 50 15 Z" fill="url(#gold-grad)"/>
                    <circle cx="50" cy="65" r="10" fill="#fffdf9" />
                    <circle cx="50" cy="65" r="5" fill="#c9a84c" />
                    <defs>
                      <linearGradient id="maroon-grad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8b1c1c" />
                        <stop offset="1" stopColor="#4a0e0e" />
                      </linearGradient>
                      <linearGradient id="gold-grad" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e8c872" />
                        <stop offset="1" stopColor="#c9a84c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3: Text Logo & Tagline */}
            <AnimatePresence mode="wait">
              {phase === 2 && (
                <motion.div
                  key="text-logo"
                  initial={{ opacity: 0, y: 20, filter: "blur(12px)", scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)", transition: { duration: 0.5 } }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute text-center flex flex-col items-center justify-center"
                >
                  <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight" style={{ 
                    backgroundImage: 'linear-gradient(to right, #4a0e0e, #8b1c1c)', 
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    VASAVI
                  </h1>
                  <p className="mt-1 font-display text-sm md:text-lg font-bold tracking-[0.25em] text-[#c9a84c] uppercase">
                    Spiritual Stays
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-6 font-body text-base md:text-lg font-medium italic text-[#5c4545] tracking-wide"
                  >
                    Where Hospitality Meets Tradition
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 4: Location Pin morphing to search bar reveal */}
            <AnimatePresence mode="wait">
              {phase >= 3 && (
                <motion.div
                  key="pin"
                  initial={{ opacity: 0, scale: 0, y: 40 }}
                  animate={
                    phase === 4
                      ? { scale: 15, opacity: 0, filter: "blur(10px)" }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  transition={{ duration: phase === 4 ? 0.8 : 0.6, ease: phase === 4 ? "easeIn" : "easeOut" }}
                  className="absolute flex items-center justify-center"
                >
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e8c872] via-[#c9a84c] to-[#6b1414] shadow-[0_0_40px_rgba(201,168,76,0.6)]">
                    <MapPin className="h-10 w-10 text-white drop-shadow-md" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
