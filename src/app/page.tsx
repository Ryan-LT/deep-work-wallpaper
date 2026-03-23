"use client";

import { useEffect, useMemo, useState } from "react";

type Quote = { text: string; author: string };

function countWords(input: string) {
  const cleaned = input
    .replace(/[“”]/g, "")
    .replace(/[’]/g, "'")
    .replace(/[^A-Za-z0-9'\s-]+/g, " ")
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

const MIN_QUOTE_WORDS = 3;
const MAX_QUOTE_WORDS = 250;

function getQuoteTextClass(wordCount: number) {
  if (wordCount <= 13) return "text-sm leading-relaxed";
  if (wordCount <= 25) return "text-[13px] leading-snug";
  if (wordCount <= 40) return "text-[12px] leading-snug";
  return "text-[11px] leading-tight";
}

// Stored as raw text to keep the data compact, then parsed into { text, author }.
const RAW_QUOTES = `
1. “Discipline is choosing between what you want now and what you want most.” - —
2. “Focus is the discipline of attention.” - —
3. “Deep work grows in silence you protect.” - —
4. “Stay in your zone. Let distraction be someone else’s problem.” - —
5. “Your calendar is your values in motion.” - —
6. “Choose the task that moves you closer to your future.” - —
7. “When you drift, return to the plan—without negotiation.” - —
8. “Distraction is expensive. Discipline is how you pay less.” - —
9. “Guard your time like it guards your momentum.” - —
10. “Clarity comes from staying with one thing long enough.” - —
11. “What you focus on grows!” - Kelli Wilson
12. “You can't get attention of one who focused on himself.” - Toba Beta
13. “Simplicity is ultimately a matter of focus.” - Ann Voskamp
14. “Focusing is about saying No.” - Steve Jobs
15. “Find your focus by seeking all that is good in your life.” - Lorii Myers
16. “If you think you can then you can.” - Stephen Richards
17. “When you fail, that is when you get closer to success.” - Stephen Richards
18. “The only time you fail is when you fall down and stay down.” - Stephen Richards
19. “Doing the tough things sets winners apart from losers.” - Stephen Richards
20. “Without enthusiasm then what we have surrounded ourselves with becomes worthless.” - Stephen Richards
21. “No matter how small you start, always dream big.” - Stephen Richards
22. “Judgment is a negative frequency.” - Stephen Richards
23. “Cosmic Ordering is a dish best served today.” - Stephen Richards
24. “Sweep the board with Cosmic Ordering Success.” - Stephen Richards
25. “There is no eleventh hour with Cosmic Ordering, only the golden hour.” - Stephen Richards
26. “Whatever your desire, use Cosmic Ordering to get what you require!” - Stephen Richards
27. “A clever person solves a problem; a wise person uses Cosmic Ordering!” - Stephen Richards
28. “Everybody talks about being rich, Cosmic Ordering does something about it.” - Stephen Richards
29. “To fail is nothing, unless you continue to ignore Cosmic Ordering.” - Stephen Richards
30. “Riches will come when you follow Cosmic Ordering.” - Stephen Richards
31. “Tell me your story and I will get back your life.” - Stephen Richards
32. “If you are in a prison of fear ... break out!” - Stephen Richards
33. “Urgent equals ephemeral, and ephemeral equals unimportant.” - John le Carré
34. “Don't look at the present storm, but look to the Son coming.” - Anthony Liccione
35. “Become your own success story, not someone else's.” - Stephen Richards
36. “Set aside your repertoire of objections and own 100 percent of your focus.” - Lorii Myers
37. “Run and hide or rise and shine ...” - Stephen Richards
38. “Positive thinking without any thought is wasted ...” - Stephen Richards
1. "Self-discipline is the ability to make yourself do what you should do, when you should do it, whether you feel like it or not." – Elbert Hubbard
2. "The price of excellence is discipline. The cost of mediocrity is disappointment."
3. "Discipline is the bridge between goals and accomplishment." – Jim Rohn
4. "Your future is found in your daily routine."
5. "Discipline is the soul of an army. It makes small numbers formidable." – George Washington
6. "Success is nothing more than a few simple disciplines, practiced every day." – Jim Rohn
7. "Discipline is not a dirty word. It is the key to freedom."
8. "He who cannot obey himself will be commanded." – Friedrich Nietzsche
9. "Motivation gets you going, but habit keeps you going." – Jim Ryun
10. "Freedom is not the absence of commitments, but the ability to choose what is best for me." – Paulo Coelho
11. "Greatness is not a function of circumstance. Greatness is a matter of conscious choice and discipline." – Jim Collins
12. "Don’t stop when you’re tired. Stop when you’re done."
13. "If you want to be a master, you must be a servant to your discipline."
14. "We are what we repeatedly do. Excellence, then, is not an act, but a habit." – Will Durant
15. "A disciplined mind leads to happiness, and an undisciplined mind leads to suffering." – Dalai Lama
16. "Mastering others is strength. Mastering yourself is true power." – Lao Tzu
17. "The successful person has the habit of doing the things failures don't like to do." – Thomas Edison
18. "Small wins lead to big victories. Discipline is the sum of small wins."
19. "You cannot conquer the world until you conquer yourself."
20. "Discipline is doing what needs to be done, even if you don't want to do it."
21. "The pain of discipline is far less than the pain of regret."
22. "Suffering is the test of discipline."
23. "The only way to get to the finish line is to keep your feet moving."
24. "Consistency is the DNA of mastery."
25. "Your mind is a muscle; discipline is the gym."
26. "The successful warrior is the average man, with laser-like focus." – Bruce Lee
27. "Focus is a matter of deciding what things you are not going to do." – John Carmack
28. "Deep work is the superpower of the 21st century." – Cal Newport
29. "Multi-tasking is the ability to screw up more than one thing at a time."
30. "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus." – Alexander Graham Bell
31. "Starve your distractions, feed your focus."
32. "If you chase two rabbits, you will catch neither." – Zen Proverb
33. "Focus is not just saying yes to the thing you have to focus on; it’s saying no to the hundred other good ideas." – Steve Jobs
34. "What you do every day matters more than what you do once in a while." – Gretchen Rubin
35. "Attention is the rarest and purest form of generosity." – Simone Weil
36. "Where focus goes, energy flows." – Tony Robbins
37. "The best way to get things done is to simply begin."
38. "Distraction is the thief of time and the enemy of genius."
39. "A clear vision, backed by definite plans, gives you a tremendous feeling of confidence." – Brian Tracy
40. "Clarity of mind means clarity of passion."
41. "In the age of distraction, nothing can feel more luxurious than paying attention." – Pico Iyer
42. "Focus is a muscle. You build it by using it."
43. "Keep your eyes on the prize, and your feet on the path."
44. "One intense hour is worth ten distracted ones."
45. "The world is full of obvious things which nobody by any chance ever observes." – Sherlock Holmes
46. "Simplicity is the consequence of refined focus."
47. "Identify the essential. Eliminate the rest." – Leo Babauta
48. "To be everywhere is to be nowhere." – Seneca
49. "Do not let what you cannot do interfere with what you can do." – John Wooden
50. "Your life is controlled by what you focus on."
51. "Believing is the first step toward receiving."
52. "The universe doesn't give you what you want; it gives you what you are."
53. "Your thoughts are the architects of your destiny."
54. "Success is a state of mind. If you want success, start thinking of yourself as a success." – Joyce Brothers
55. "Manifestation begins with a single, disciplined thought."
56. "The limits of your world are the limits of your belief."
57. "Abundance is not something we acquire. It is something we tune into." – Wayne Dyer
58. "A positive mindset is a magnet for miracles."
59. "Don't wait for the right moment. Create it."
60. "The vibration of your thoughts dictates the quality of your life."
61. "You are the master of your own frequency."
62. "Energy follows intention."
63. "Doubt is a leak in your power. Plug it with certainty."
64. "The inner world creates the outer world."
65. "You are not a product of your circumstances; you are a product of your decisions." – Stephen Covey
66. "The best way to predict the future is to create it." – Peter Drucker
67. "To have what you’ve never had, you must do what you’ve never done."
68. "Change your thoughts and you change your world." – Norman Vincent Peale
69. "Everything you’ve ever wanted is on the other side of fear." – George Addair
70. "A mind stretched by a new idea never returns to its original dimensions." – Oliver Wendell Holmes
71. "Your reality is a reflection of your strongest beliefs."
72. "Success is an inside job."
73. "Stop looking for the key; you are the lock and the key."
74. "Willpower is the spark, but habit is the flame."
75. "Mind over matter isn't a cliché; it's a requirement."
76. "Fall seven times, stand up eight." – Japanese Proverb
77. "Persistence is the twin sister of excellence. One is a matter of quality; the other, a matter of time."
78. "It’s not that I’m so smart, it’s just that I stay with problems longer." – Albert Einstein
79. "Tough times never last, but tough people do." – Robert Schuller
80. "The difference between a successful person and others is not a lack of strength, but a lack of will." – Vince Lombardi
81. "Obstacles are those frightful things you see when you take your eyes off your goal." – Henry Ford
82. "Endurance is not just the ability to bear a hard thing, but to turn it into glory." – William Barclay
83. "The harder the conflict, the more glorious the triumph." – Thomas Paine
84. "Don't wish it were easier; wish you were better." – Jim Rohn
85. "The only person you are destined to become is the person you decide to be." – Ralph Waldo Emerson
86. "Failure is simply the opportunity to begin again, this time more intelligently." – Henry Ford
87. "Hard work beats talent when talent doesn’t work hard." – Tim Notke
88. "Your struggle is your strength."
89. "Character is the ability to carry out a good resolution long after the excitement of the moment has passed." – Cavett Robert
90. "What lies behind us and what lies before us are tiny matters compared to what lies within us." – Ralph Waldo Emerson
91. "The gems cannot be polished without friction, nor man perfected without trials." – Chinese Proverb
92. "Grit is passion and perseverance for very long-term goals." – Angela Duckworth
93. "You don’t find willpower, you create it."
94. "Strength does not come from winning. Your struggles develop your strengths." – Arnold Schwarzenegger
95. "Pressure creates diamonds."
96. "Execution is everything."
97. "The best time to plant a tree was 20 years ago. The second best time is now." – Chinese Proverb
98. "Don't tell me what you value, show me your budget and I'll tell you what you value." – Joe Biden
99. "Action is the foundational key to all success." – Pablo Picasso
100. "Someday is not a day of the week." – Denise Brennan-Nelson
101. "Procrastination is the art of keeping up with yesterday." – Don Marquis
102. "Done is better than perfect." – Sheryl Sandberg
103. "You don’t have to be great to start, but you have to start to be great." – Zig Ziglar
104. "The secret of getting ahead is getting started." – Mark Twain
105. "While we stop to think, we often miss our opportunity." – Publilius Syrus
106. "Do it now. Sometimes 'later' becomes 'never'."
107. "Action cures fear."
108. "An ounce of practice is worth more than tons of preaching." – Mahatma Gandhi
109. "The path to success is to take massive, determined action." – Tony Robbins
110. "Your time is limited, so don't waste it living someone else's life." – Steve Jobs
111. "He who hesitates is lost."
112. "Vision without action is a daydream. Action without vision is a nightmare."
113. "Start where you are. Use what you have. Do what you can." – Arthur Ashe
114. "The scariest moment is always just before you start." – Stephen King
115. "A year from now you may wish you had started today." – Karen Lamb
116. "Activity is not achievement."
117. "Work like there is someone working twenty-four hours a day to take it away from you." – Mark Cuban
118. "If you spend too much time thinking about a thing, you’ll never get it done." – Bruce Lee
119. "Momentum is the best friend of success."
120. "Be busy being effective, not just busy."
121. "He who has a why to live can bear almost any how." – Friedrich Nietzsche
122. "The two most important days in your life are the day you are born and the day you find out why." – Mark Twain
123. "Efforts and courage are not enough without purpose and direction." – John F. Kennedy
124. "Clarity is power."
125. "If you don't design your own life plan, chances are you'll fall into someone else's plan." – Jim Rohn
126. "Focus on the journey, not the destination."
127. "Your calling is where your deep gladness and the world's deep hunger meet." – Frederick Buechner
128. "A goal without a plan is just a wish." – Antoine de Saint-Exupéry
129. "Purpose is the engine of discipline."
130. "When you know what you want, and you want it badly enough, you’ll find a way to get it." – Jim Rohn
131. "The meaning of life is to find your gift. The purpose of life is to give it away." – Pablo Picasso
132. "Decide what you want, decide what you are willing to exchange for it. Establish your priorities and go to work." – H.L. Hunt
133. "Without a goal, discipline has no home."
134. "Great minds have purposes; others have wishes." – Washington Irving
135. "Your mission should be so clear that your excuses become irrelevant."
136. "The first and best victory is to conquer self." – Plato
137. "Mastery is not a finished degree, but a continuous process."
138. "A man is but the product of his thoughts; what he thinks, he becomes." – Mahatma Gandhi
139. "Integrity is doing the right thing, even when no one is watching." – C.S. Lewis
140. "Humility is not thinking less of yourself, it's thinking of yourself less." – C.S. Lewis
141. "The most powerful weapon on earth is the human soul on fire." – Ferdinand Foch
142. "Character is destiny." – Heraclitus
143. "Control your emotions or they will control you."
144. "Be the change you wish to see in the world." – Gandhi
145. "Self-respect is the fruit of discipline." – Abraham Joshua Heschel
146. "Rule your mind or it will rule you." – Horace
147. "You are the average of the five people you spend the most time with." – Jim Rohn
148. "Work on yourself more than you work on your job." – Jim Rohn
149. "Discipline is the foundation upon which all success is built."
150. "Your character is your capital."
151. "Eat a live frog first thing in the morning and nothing worse will happen to you the rest of the day." – Mark Twain
152. "The best way to manage your time is to manage your energy."
153. "Complexity is the enemy of execution." – Tony Robbins
154. "Systemize the routine, humanize the exception."
155. "If it’s not a 'hell yes,' it’s a 'no'." – Derek Sivers
156. "Focus on being productive instead of busy." – Tim Ferriss
157. "The key is not to prioritize what's on your schedule, but to schedule your priorities." – Stephen Covey
158. "Amateurs wait for inspiration. The rest of us just get up and go to work." – Chuck Close
159. "Simplify, then add lightness." – Colin Chapman
160. "Efficiency is doing things right; effectiveness is doing the right things." – Peter Drucker
161. "Subtract until you can’t subtract anymore."
162. "Plan your work and work your plan." – Napoleon Hill
163. "Constraints drive innovation."
164. "The way to get started is to quit talking and begin doing." – Walt Disney
165. "High performance is not an accident."
166. "Success is stumbling from failure to failure with no loss of enthusiasm." – Winston Churchill
167. "The only place where success comes before work is in the dictionary." – Vidal Sassoon
168. "Growth and comfort do not coexist." – Ginni Rometty
169. "Don't be afraid to give up the good to go for the great." – John D. Rockefeller
170. "Successful people are simply those with successful habits." – Brian Tracy
171. "Every master was once a beginner."
172. "The secret of your success is hidden in your daily routine."
173. "Big results require big ambitions." – Heraclitus
174. "Success is not final, failure is not fatal: it is the courage to continue that counts." – Winston Churchill
175. "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
176. "The road to success is always under construction." – Lily Tomlin
177. "Dream big and dare to fail." – Norman Vaughan
178. "If you want to achieve greatness, stop asking for permission."
179. "Your level of success will seldom exceed your level of personal development." – Jim Rohn
180. "Success isn't owned, it's leased. And rent is due every day." – J.J. Watt
181. "Ask, and it shall be given you; seek, and ye shall find." – Matthew 7:7
182. "The universe is change; our life is what our thoughts make it." – Marcus Aurelius
183. "The law of attraction is always working, whether you believe it or not."
184. "Intention is the creative power that fulfills every need." – Deepak Chopra
185. "Whatever the mind of man can conceive and believe, it can achieve." – Napoleon Hill
186. "Your life is an open book of choices."
187. "Believe that you deserve it and the universe will serve it."
188. "Gratitude is the healthiest of all human emotions." – Zig Ziglar
189. "When you are in alignment, things flow."
190. "The frequency of joy is the most productive state."
191. "Order in the mind creates order in the world."
192. "Expect miracles."
193. "Manifestation is the marriage of vision and discipline."
194. "You are the co-creator of your reality."
195. "Think like a queen. A queen is not afraid to fail." – Oprah Winfrey
196. "The universe has no restrictions. You place restrictions on the universe with your expectations." – Deepak Chopra
197. "Life doesn't happen to you, it happens for you." – Jim Carrey
198. "Magic is believing in yourself. If you can do that, you can make anything happen." – Johann Wolfgang von Goethe
199. "You are a magnet. You attract what you think about."
200. "The power of the universe is within you; use it wisely."
`;

function parseQuotes(raw: string): Quote[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const parsed: Quote[] = [];
  for (const line of lines) {
    const normalized = line
      .replace(/^\d+\.\s*/, "")
      .replace(/^\-\s*/, "")
      .trim();

    // 1) “Quote text” - Author
    const dashMatch = normalized.match(/^\s*[“"]?(.+?)[”"]?\s*[-–—]\s*(.+)\s*$/);
    if (dashMatch) {
      const text = dashMatch[1].trim();
      const author = dashMatch[2].trim() || "—";
      const wc = countWords(text);
      if (wc >= MIN_QUOTE_WORDS && wc <= MAX_QUOTE_WORDS) {
        parsed.push({ text, author });
      }
      continue;
    }

    // 2) Quote... Author  (common WisdomQuotes format: "Quote. Author")
    const punctMatch = normalized.match(/^(.*?)([.!?])\s+(.+)\s*$/);
    if (punctMatch) {
      const text = `${punctMatch[1].trim()}${punctMatch[2]}`.trim();
      const author = punctMatch[3].replace(/\s*\(.*\)\s*$/, "").trim();
      const wc = countWords(text);
      if (wc >= MIN_QUOTE_WORDS && wc <= MAX_QUOTE_WORDS) {
        parsed.push({ text, author: author || "—" });
      }
      continue;
    }

    // 3) Fallback: line as quote, no author.
    const wc = countWords(normalized);
    if (wc >= MIN_QUOTE_WORDS && wc <= MAX_QUOTE_WORDS) {
      // Strip surrounding quotes if present.
      const cleaned = normalized
        .replace(/^["“]\s*/g, "")
        .replace(/\s*["”]$/g, "")
        .trim();
      parsed.push({ text: cleaned || normalized, author: "—" });
    }
  }

  return parsed;
}

const QUOTES: Quote[] = parseQuotes(RAW_QUOTES);

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

              <div className="pt-6 max-w-[480px] border-t border-outline-variant/10 mt-8">
                <p
                  className={cn(
                    "text-on-surface-variant font-body italic opacity-70",
                    getQuoteTextClass(countWords(quote.text))
                  )}
                >
                  &quot;{quote.text}&quot;
                </p>
                <p className="text-tertiary/60 font-label text-[9px] uppercase tracking-widest mt-2 opacity-60">
                  {quote.author === "—" ? "" : `— ${quote.author}`}
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
