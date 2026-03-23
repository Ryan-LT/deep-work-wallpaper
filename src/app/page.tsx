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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type WorkingStatus = "morning" | "afternoon" | "off";

const MORNING_START_MINUTES = 9 * 60;
const MORNING_END_MINUTES = 11 * 60 + 30;
const AFTERNOON_START_MINUTES = 13 * 60 + 30;
const AFTERNOON_END_MINUTES = 17 * 60 + 30;

function getMinutesSinceMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

function getWorkingStatus(now: Date): WorkingStatus {
  const minutes = getMinutesSinceMidnight(now);

  // Inclusive start, exclusive end.
  if (minutes >= MORNING_START_MINUTES && minutes < MORNING_END_MINUTES) {
    return "morning";
  }
  if (
    minutes >= AFTERNOON_START_MINUTES &&
    minutes < AFTERNOON_END_MINUTES
  ) {
    return "afternoon";
  }
  return "off";
}

function format12hTimeFromMinutes(totalMinutes: number) {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

function getNextWorkingStartLabel(now: Date) {
  const minutes = getMinutesSinceMidnight(now);

  if (minutes < MORNING_START_MINUTES) {
    return format12hTimeFromMinutes(MORNING_START_MINUTES);
  }
  if (minutes >= MORNING_END_MINUTES && minutes < AFTERNOON_START_MINUTES) {
    return format12hTimeFromMinutes(AFTERNOON_START_MINUTES);
  }

  // After hours (after afternoon end) -> next is tomorrow morning sprint.
  return format12hTimeFromMinutes(MORNING_START_MINUTES);
}

export default function Home() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(() => formatLocalTime(now), [now]);
  const workingStatus = useMemo(() => getWorkingStatus(now), [now]);
  const nextStartLabel = useMemo(
    () => (workingStatus === "off" ? getNextWorkingStartLabel(now) : null),
    [now, workingStatus]
  );

  const isMorning = workingStatus === "morning";
  const isAfternoon = workingStatus === "afternoon";
  const isOffHours = workingStatus === "off";

  const quote = useMemo(() => {
    const key = getNoonAnchoredDateKey(now);
    const idx = hashString(key) % QUOTES.length;
    return QUOTES[idx];
  }, [now]);

  return (
    <>
      <main
        className="square-container w-full flex flex-col justify-center px-12 lg:px-16 py-12 relative overflow-hidden bg-background"
      >
        <span className="sr-only" aria-live="polite">
          {`Current time ${time}`}
        </span>
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
                <span
                  className={cn(
                    "whitespace-nowrap text-[9px] uppercase tracking-[0.3em] font-bold px-2 py-1 rounded border",
                    isOffHours
                      ? "border-outline-variant/10 bg-surface-bright/10 text-on-surface-variant/60 text-[8px]"
                      : "border-outline-variant/20 bg-surface-bright/10 text-on-surface-variant/90"
                  )}
                >
                  {isOffHours
                    ? nextStartLabel
                      ? `Outside - Next ${nextStartLabel}`
                      : "Outside"
                    : isMorning
                      ? "Focused now"
                      : "Deep work now"}
                </span>
              </div>

              <div className="space-y-6">
                <div
                  className={cn(
                    "bg-surface-bright/10 p-5 rounded border-l border-primary/20 transition-colors duration-300",
                    isMorning
                      ? "border-primary/80"
                      : "opacity-60"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={cn(
                          "font-label text-tertiary/60 text-[9px] uppercase tracking-widest mb-1 transition-opacity duration-300",
                          isMorning ? "opacity-100" : "opacity-60"
                        )}
                      >
                        Morning Sprint
                      </p>
                      <p
                        className={cn(
                          "font-headline text-2xl text-primary font-light tracking-tight transition-opacity duration-300",
                          isMorning ? "opacity-100" : "opacity-65"
                        )}
                      >
                        9:00 AM — 11:30 AM
                      </p>
                    </div>
                    <span
                      className={cn(
                        "material-symbols-outlined text-primary text-xl transition-opacity duration-300",
                        isMorning ? "opacity-85" : "opacity-30"
                      )}
                    >
                      wb_sunny
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "bg-surface-bright/10 p-5 rounded border-l border-primary/20 transition-colors duration-300",
                    isAfternoon
                      ? "border-tertiary/70"
                      : "opacity-60"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={cn(
                          "font-label text-on-surface-variant/40 text-[9px] uppercase tracking-widest mb-1 transition-opacity duration-300",
                          isAfternoon ? "opacity-100" : "opacity-60"
                        )}
                      >
                        Afternoon Deep Work
                      </p>
                      <p
                        className={cn(
                          "font-headline text-2xl text-on-surface font-extralight tracking-tight transition-opacity duration-300",
                          isAfternoon ? "opacity-95" : "opacity-65"
                        )}
                      >
                        1:30 PM — 5:30 PM
                      </p>
                    </div>
                    <span
                      className={cn(
                        "material-symbols-outlined text-on-surface-variant text-xl transition-opacity duration-300",
                        isAfternoon ? "opacity-85" : "opacity-30"
                      )}
                    >
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
