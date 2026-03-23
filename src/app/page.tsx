"use client";

import { useEffect, useMemo, useState } from "react";

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Focus is the discipline of attention.",
  "Deep work grows in silence you protect.",
  "Stay in your zone. Let distraction be someone else’s problem.",
  "Your calendar is your values in motion.",
  "Choose the task that moves you closer to your future.",
  "When you drift, return to the plan—without negotiation.",
  "Distraction is expensive. Discipline is how you pay less.",
  "Guard your time like it guards your momentum.",
  "Clarity comes from staying with one thing long enough.",
];

function formatLocalTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function getNoonAnchoredDateKey(d: Date) {
  // Rotate at local 12:00. Before noon -> use previous day; after noon -> use current day.
  const adjusted = new Date(d);
  if (adjusted.getHours() < 12) adjusted.setDate(adjusted.getDate() - 1);

  const yyyy = adjusted.getFullYear();
  const mm = String(adjusted.getMonth() + 1).padStart(2, "0");
  const dd = String(adjusted.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function hashString(str: string) {
  // Simple deterministic hash (djb2).
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

export default function Home() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(() => formatLocalTime(now), [now]);

  const quote = useMemo(() => {
    const key = getNoonAnchoredDateKey(now);
    const idx = hashString(key) % QUOTES.length;
    return QUOTES[idx];
  }, [now]);

  return (
    <>
      <main className="square-container w-full flex flex-col justify-center px-12 lg:px-16 py-12 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-surface-bright opacity-[0.04] rounded-full blur-[140px] -z-10"></div>

        <div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto w-full items-center relative z-10">
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6 mb-4 w-full">
                <p className="font-headline uppercase tracking-[0.5em] text-on-surface-variant text-[9px] opacity-60">
                  STATE · FLOW · ACTIVE
                </p>
              </div>

              <div className="relative">
                <h1 className="font-headline text-[5rem] lg:text-[6.5rem] font-extrabold leading-[0.85] tracking-tighter editorial-gradient py-2 select-none">
                  FOCUSED
                  <br />
                  ZONE
                </h1>
              </div>

              <div className="pt-6 max-w-[280px] border-t border-outline-variant/10 mt-8">
                <p className="text-on-surface-variant font-body leading-relaxed text-sm italic opacity-70">
                  &quot;{quote}&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 space-y-10">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-6 bg-primary/30"></div>
                <h2 className="font-headline text-on-surface-variant text-[9px] uppercase tracking-[0.3em] font-bold">
                  Working Hours
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-surface-bright/10 p-5 border-l border-primary/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-label text-tertiary/60 text-[9px] uppercase tracking-widest mb-1">
                        Morning Sprint
                      </p>
                      <p className="font-headline text-2xl text-primary font-light tracking-tight">
                        9:00 AM — 11:30 AM
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-xl opacity-30">
                      wb_sunny
                    </span>
                  </div>
                </div>

                <div className="px-5 py-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-label text-on-surface-variant/40 text-[9px] uppercase tracking-widest mb-1">
                        Afternoon Deep Work
                      </p>
                      <p className="font-headline text-2xl text-on-surface font-extralight tracking-tight opacity-80">
                        1:30 PM — 5:30 PM
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-xl opacity-10">
                      dark_mode
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-6 bg-primary/30"></div>
                <h2 className="font-headline text-on-surface-variant text-[9px] uppercase tracking-[0.3em] font-bold">
                  Rules for Focus
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="px-4 py-2 flex items-center gap-4 group">
                  <span className="font-headline text-primary-dim text-base font-bold opacity-20">
                    01
                  </span>
                  <p className="font-body text-on-surface/80 text-sm">
                    Maintain absolute deep focus
                  </p>
                </div>
                <div className="px-4 py-2 flex items-center gap-4 group border-t border-outline-variant/5">
                  <span className="font-headline text-primary-dim text-base font-bold opacity-20">
                    02
                  </span>
                  <p className="font-body text-on-surface/80 text-sm">
                    Embrace the digital silence
                  </p>
                </div>
                <div className="px-4 py-2 flex items-center gap-4 group border-t border-outline-variant/5">
                  <span className="font-headline text-primary-dim text-base font-bold opacity-20">
                    03
                  </span>
                  <p className="font-body text-on-surface/80 text-sm">
                    Stay in your zone
                  </p>
                </div>
                <div className="px-4 py-2 flex items-center gap-4 group border-t border-outline-variant/5">
                  <span className="font-headline text-primary-dim text-base font-bold opacity-20">
                    04
                  </span>
                  <p className="font-body text-on-surface/80 text-sm">
                    Silence all social media
                  </p>
                </div>
                <div className="px-4 py-2 flex items-center gap-4 group border-t border-outline-variant/5">
                  <span className="font-headline text-primary-dim text-base font-bold opacity-20">
                    05
                  </span>
                  <p className="font-body text-on-surface/80 text-sm">
                    No domestic chores allowed
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-20 mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence
              baseFrequency={0.65}
              numOctaves={3}
              stitchTiles="stitch"
              type="fractalNoise"
            />
          </filter>
          <rect filter="url(#noise)" height="100%" width="100%" />
        </svg>
      </div>
    </>
  );
}
