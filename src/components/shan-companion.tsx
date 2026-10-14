import { useRef } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Shan } from "@/components/scene/shan";

type ShanCompanionProps = {
  className?: string;
  svgClassName?: string;
  onSpin?: () => void;
};

export function ShanCompanion({ className, svgClassName, onSpin }: ShanCompanionProps) {
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const turns = useRef(0);

  const spin = () => {
    onSpin?.();
    if (reduced) return;
    turns.current += 1;
    animate(scope.current, { rotate: turns.current * 360 }, { type: "spring", stiffness: 90, damping: 11 });
  };

  return (
    <motion.button
      type="button"
      aria-label="Spin Shan the snow leopard"
      className={cn("block cursor-grab touch-none select-none active:cursor-grabbing", className)}
      drag={!reduced}
      dragSnapToOrigin
      dragElastic={0.45}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 12 }}
      whileHover={reduced ? undefined : { scale: 1.05, rotate: -3 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      whileDrag={{ scale: 1.08, rotate: 8 }}
      onTap={spin}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          spin();
        }
      }}
    >
      <span ref={scope} className="block">
        <Shan className={svgClassName} />
      </span>
    </motion.button>
  );
}
