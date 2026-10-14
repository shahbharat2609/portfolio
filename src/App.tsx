import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Hero } from "@/components/sections/hero";
import { Overview } from "@/components/sections/overview";
import { Work } from "@/components/sections/work";
import { Approach } from "@/components/sections/approach";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FlagStrip } from "@/components/scene/prayer-flags";
import { ShanCompanion } from "@/components/shan-companion";
import { useTheme } from "@/hooks/use-theme";
import { interceptAnchors, springs, startSmoothScroll } from "@/lib/motion";

export default function App() {
  const { night, toggle } = useTheme();
  const [spins, setSpins] = useState(0);
  const [hovering, setHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const spin = () => setSpins((count) => count + 1);

  useEffect(() => {
    const stopScroll = startSmoothScroll();
    const stopAnchors = interceptAnchors();
    return () => {
      stopScroll();
      stopAnchors();
    };
  }, []);

  return (
    <TooltipProvider>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[linear-gradient(90deg,#2E5FA8_0_20%,#F4F1EA_20%_40%,#C8342B_40%_60%,#2E8B57_60%_80%,#E6B422_80%)]"
        style={{ scaleX: progress }}
      />
      <Hero night={night} onToggleTheme={toggle} onSpin={spin} />
      <FlagStrip />
      <main>
        <div className="mx-auto max-w-[1320px] px-4 md:px-12">
          <Overview />
          <Work />
        </div>
        <Approach night={night} />
        <div className="mx-auto max-w-[1320px] px-4 md:px-12">
          <About />
        </div>
      </main>
      <Contact />
      <div
        className="fixed bottom-5 right-5 z-50"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <AnimatePresence>
          {hovering && (
            <motion.span
              className="pointer-events-none absolute bottom-14 right-[86px] whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg"
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={springs.snappy}
            >
              Julley! Spins: {spins}
            </motion.span>
          )}
        </AnimatePresence>
        <ShanCompanion svgClassName="w-[84px]" onSpin={spin} />
      </div>
    </TooltipProvider>
  );
}
