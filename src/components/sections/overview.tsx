import { site } from "@/data/site";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/reveal";

export function Overview() {
  return (
    <section className="flex flex-wrap gap-x-18 gap-y-8 pt-[clamp(88px,11vw,150px)]">
      <SectionLabel className="flex-[0_0_220px]">3,500 m · Overview</SectionLabel>
      <div className="min-w-0 flex-[1_1_560px]">
        <Reveal
          as="h2"
          className="max-w-[22em] text-balance font-display text-[clamp(30px,3.6vw,52px)] font-medium leading-[1.15] tracking-[-0.02em] [font-stretch:95%]"
        >
          {site.overview.statement}
        </Reveal>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] border-t">
          {site.overview.capabilities.map((capability, index) => (
            <Reveal key={capability} delay={index * 0.08} className="pr-5 pt-5">
              <p className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1.5 font-semibold">{capability}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
