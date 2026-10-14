import { cn } from "@/lib/utils";

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("m-0 font-mono text-[13px] uppercase tracking-[0.1em] text-teal", className)}>{children}</p>
  );
}
