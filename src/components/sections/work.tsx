import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { springs } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/section-label";
import { Bike } from "@/components/scene/bike";
import { Kiang } from "@/components/scene/kiang";
import { PrayerFlags } from "@/components/scene/prayer-flags";
import { site, type Project } from "@/data/site";

function RoadBand() {
  return (
    <div aria-hidden="true" className="relative left-1/2 mb-12 h-[190px] w-screen -translate-x-1/2 overflow-hidden">
      <svg viewBox="0 0 1440 190" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <path
          d="M0 112 L140 84 L230 100 L340 70 L450 98 L560 82 L700 104 L820 74 L940 100 L1060 84 L1180 104 L1300 78 L1440 96 V190 H0 Z"
          style={{ fill: "var(--m1)" }}
        />
        <path
          d="M340 70 L326 80 L336 79 L344 84 L354 78 Z M820 74 L806 84 L816 83 L824 88 L834 82 Z M1300 78 L1286 88 L1296 87 L1304 92 L1314 86 Z"
          style={{ fill: "var(--snow)" }}
        />
        <path d="M0 112 C240 106 420 110 600 108 C840 105 1100 110 1440 106 V190 H0 Z" style={{ fill: "var(--plain)" }} />
        <path d="M0 126 C400 122 1000 122 1440 124" fill="none" strokeWidth="1" strokeDasharray="2 10" style={{ stroke: "var(--m3)" }} />
        <path d="M0 132 C500 128 900 130 1440 128" fill="none" strokeWidth="1" strokeDasharray="1 14" style={{ stroke: "var(--m3)" }} />
        <Kiang x={420} y={104} scale={0.55} />
        <Kiang x={470} y={108} scale={0.5} />
        <Kiang x={1010} y={104} scale={0.55} flip />
        <PrayerFlags from={[0, 6]} control={[720, 70]} to={[1440, 6]} count={15} width={22} height={26} stringColor="rgba(120,120,120,.5)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-[46px] border-t-[3px] bg-[var(--road)]" style={{ borderTopColor: "var(--road-edge)" }} />
      <div className="absolute inset-x-0 bottom-[21px] h-[3px] bg-[repeating-linear-gradient(90deg,#E6B422_0_30px,transparent_30px_64px)] opacity-85" />
      <span className="absolute bottom-[54px] right-4 font-mono text-[11px] tracking-[0.1em] opacity-70 md:right-12">
        MOREY PLAINS · KIANG CHU THANG · 4,700 M · MANALI–LEH HWY
      </span>
      <div className="ride absolute bottom-3.5 h-[86px] w-[128px]">
        <Bike tank="#A8322B" jacket="#A85E22" helmet="#F4F1EA" className="size-full" />
      </div>
      <div className="ride b absolute bottom-3.5 h-[86px] w-[128px]">
        <Bike tank="#2F6E99" jacket="#3B4A3A" helmet="#E6B422" className="size-full" />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      href={project.href ?? "#contact"}
      className="project-card group block min-w-0 flex-[1_1_380px] rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      initial={reduced ? false : { opacity: 0, y: 60, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileHover={reduced ? undefined : { y: -10, rotate: index % 2 ? 0.6 : -0.6 }}
      transition={{ ...springs.soft, delay: index * 0.1 }}
    >
      <Card className="h-full gap-0 overflow-hidden rounded-md py-0 shadow-none transition-shadow duration-500 group-hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]">
        <div className="relative h-[220px] overflow-hidden" style={{ background: project.panel }}>
          <span className="absolute left-5 top-4 font-mono text-xs uppercase tracking-[0.08em]" style={{ color: project.tagColor }}>
            {project.tag}
          </span>
          <svg
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-2.5 h-[130px] w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2"
          >
            <path d="M0 80 L60 50 L110 70 L180 30 L240 64 L300 40 L360 66 L400 54 V120 H0 Z" fill={project.ridge[0]} />
            <path d="M0 100 C100 86 200 92 300 100 C340 104 380 98 400 96 V120 H0 Z" fill={project.ridge[1]} />
          </svg>
          <div className="mini-bike absolute bottom-2 h-[58px] w-24" aria-hidden="true">
            <Bike {...project.bike} dust={false} beamLength={170} className="size-full" />
          </div>
        </div>
        <CardContent className="flex flex-col gap-3 px-6 pb-7 pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-[28px] font-semibold tracking-[-0.02em]">
              {project.name}
              <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <span className="font-mono text-[13px] text-muted-foreground">{project.year}</span>
          </div>
          <p className="text-base text-muted-foreground">{project.summary}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Badge key={item} variant="outline" className="rounded-sm font-mono text-xs font-normal text-teal">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}

export function Work() {
  return (
    <section id="work" className="pt-[clamp(88px,11vw,150px)]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <SectionLabel className="mb-3.5">4,700 m · Selected work</SectionLabel>
          <Reveal as="h2" className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] [font-stretch:92%]">
            Projects
          </Reveal>
        </div>
        <p className="max-w-[24em] text-muted-foreground">
          Client products and platforms I've built recently. Details shared with permission.
        </p>
      </div>
      <RoadBand />
      <div className="flex flex-wrap gap-6">
        {site.projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
