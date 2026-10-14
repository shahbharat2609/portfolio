import { lazy, Suspense, useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShanCompanion } from "@/components/shan-companion";
import { springs } from "@/lib/motion";
import { site } from "@/data/site";

const HeroScene = lazy(() => import("@/three/hero-scene"));

const nav = [
  ["Work", "#work"],
  ["Approach", "#approach"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

const copy = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const line = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: springs.soft },
};

type HeroProps = {
  night: boolean;
  onToggleTheme: () => void;
  onSpin: () => void;
};

export function Hero({ night, onToggleTheme, onSpin }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { margin: "0px 0px 200px 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);
  const themeLabel = night ? "Switch to day" : "Switch to night";

  return (
    <header ref={ref} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-sky text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene night={night} active={inView} reduced={reduced} />
        </Suspense>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 pt-7 md:px-12">
        <motion.nav
          aria-label="Main"
          className="flex flex-wrap items-center justify-between gap-4"
          initial={reduced ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.soft}
        >
          <a href="#top" className="font-display text-xl font-bold tracking-tight">
            {site.name}
          </a>
          <div className="hidden gap-8 text-[15px] font-medium md:flex">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="group relative opacity-85 hover:opacity-100">
                {label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={onToggleTheme}
                  aria-label={themeLabel}
                  className="overflow-hidden rounded-full border-white/50 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white dark:bg-white/5"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={night ? "moon" : "sun"}
                      initial={{ y: 18, rotate: -90, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      exit={{ y: -18, rotate: 90, opacity: 0 }}
                      transition={springs.snappy}
                      className="grid place-items-center"
                    >
                      {night ? <Moon /> : <Sun />}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{themeLabel}</TooltipContent>
            </Tooltip>
            <Button asChild size="lg" className="hidden bg-white text-[#1C2126] hover:bg-white/90 sm:inline-flex">
              <a href="#contact">Get in touch</a>
            </Button>
          </div>
        </motion.nav>

        <div className="flex flex-wrap items-center gap-10 pt-14 md:pt-24">
          <motion.div
            className="min-w-0 max-w-[900px] flex-[1_1_560px] [text-shadow:0_2px_28px_rgba(8,16,36,0.35)]"
            style={{ y: copyY, opacity: copyOpacity }}
            variants={copy}
            initial={reduced ? false : "hidden"}
            animate="show"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={night ? "night" : "day"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.9, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-mono text-[13px] uppercase tracking-[0.12em]"
              >
                {night ? "Night · Hanle dark sky, Ladakh" : "Day · Clear skies over Leh, Ladakh"}
              </motion.p>
            </AnimatePresence>
            <motion.h1
              variants={line}
              className="mt-5 text-balance font-display text-[clamp(44px,6.4vw,94px)] font-semibold leading-[1.02] tracking-[-0.03em] [font-stretch:92%]"
            >
              {site.hero.title}
            </motion.h1>
            <motion.p variants={line} className="mt-6 max-w-[34em] text-[clamp(18px,1.6vw,21px)] opacity-95">
              {site.hero.intro}
            </motion.p>
            <motion.div variants={line} className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 bg-white px-6 text-[15px] text-[#1C2126] hover:bg-white/90">
                <a href="#work">View selected work</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-white/60 bg-white/5 px-6 text-[15px] text-white backdrop-blur-sm hover:bg-white/15 hover:text-white dark:bg-white/5"
              >
                <a href="#contact">Start a conversation</a>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="mx-auto hidden flex-col items-center gap-2 md:flex"
            initial={reduced ? false : { opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ ...springs.bouncy, delay: 0.7 }}
          >
            <ShanCompanion svgClassName="w-[clamp(180px,17vw,250px)]" onSpin={onSpin} />
            <span className="font-mono text-xs tracking-[0.06em] opacity-90">Meet Shan · drag or tap</span>
          </motion.div>
        </div>
      </div>
      <div className="flex-1" />
    </header>
  );
}
