import { lazy, Suspense, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/section-label";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { site, type Stop } from "@/data/site";
import { stopAt } from "@/three/stops";

const RideScene = lazy(() => import("@/three/ride-scene"));

function StopCard({ stop }: { stop: Stop }) {
  return (
    <Card className="gap-0 rounded-md border-white/10 bg-card/90 py-0 shadow-2xl backdrop-blur-md">
      <CardContent className="flex flex-col gap-3 p-6">
        <p className="font-mono text-[13px] text-ochre">
          {stop.number} · {stop.place} · {stop.phase}
        </p>
        <h3 className="font-display text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.02em]">{stop.title}</h3>
        <p className="text-base text-muted-foreground">{stop.text}</p>
        {stop.chips && (
          <div className="flex flex-wrap gap-2">
            {stop.chips.map((chip) => (
              <Badge key={chip} variant="outline" className="rounded-sm text-sm font-normal">
                {chip}
              </Badge>
            ))}
          </div>
        )}
        {stop.checklist && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[15px]">
            {stop.checklist.map((item, index) => (
              <motion.li
                key={item}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springs.snappy, delay: 0.15 + index * 0.08 }}
              >
                <Check className="size-4 text-teal" strokeWidth={3} />
                {item}
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function Approach({ night }: { night: boolean }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(section, { margin: "200px 0px 200px 0px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.0005 });
  const rail = useTransform(progress, [0, 1], ["0%", "100%"]);
  const introOpacity = useTransform(progress, [0, 0.82, 0.9], [1, 1, 0]);
  const introY = useTransform(progress, [0.82, 0.9], [0, -24]);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const count = stopAt.filter((at) => value >= at - 0.02).length;
    setReached((current) => (current === count ? current : count));
  });

  const current = site.stops[Math.max(0, reached - 1)];

  return (
    <section ref={section} id="approach" className="relative mt-[clamp(88px,11vw,150px)] h-[420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-sky">
        <div className="absolute inset-0" aria-hidden="true">
          <Suspense fallback={null}>
            <RideScene night={night} active={inView} reduced={reduced} progress={progress} reached={reached} />
          </Suspense>
        </div>

        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1320px] flex-col justify-between px-4 py-8 md:px-12 md:py-12">
          <motion.div style={{ opacity: introOpacity, y: introY }} className="max-w-xl rounded-md bg-background/80 p-5 backdrop-blur-md md:p-6">
            <SectionLabel className="mb-3">5,328 m · Tanglang La · Approach</SectionLabel>
            <h2 className="font-display text-[clamp(30px,3.6vw,52px)] font-semibold leading-none tracking-[-0.03em] [font-stretch:92%]">
              From first sketch to shipped software.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Scroll to ride the Gata Loops, cross the Morey Plains and climb to Tanglang La. Same rider the whole way.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="pointer-events-auto w-full max-w-md">
              <AnimatePresence mode="wait">
                {reached > 0 && (
                  <motion.div
                    key={current.number}
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                    transition={springs.soft}
                  >
                    <StopCard stop={current} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full max-w-sm rounded-md bg-background/80 p-4 backdrop-blur-md">
              <div className="relative h-1.5 rounded-full bg-border">
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-teal" style={{ width: rail }} />
                {stopAt.map((at, index) => (
                  <motion.span
                    key={at}
                    className={cn(
                      "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background",
                      reached > index ? "bg-[#E6B422]" : "bg-muted-foreground/40",
                    )}
                    style={{ left: `${at * 100}%` }}
                    animate={{ scale: reached > index ? 1.25 : 1 }}
                    transition={springs.bouncy}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                <span>Sarchu</span>
                <span>Morey Plains</span>
                <span>Tanglang La</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ol className="sr-only">
        {site.stops.map((stop) => (
          <li key={stop.number}>
            {stop.place}, {stop.phase}: {stop.title} {stop.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
