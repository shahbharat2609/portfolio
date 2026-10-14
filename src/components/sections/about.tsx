import { Separator } from "@/components/ui/separator";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="flex flex-wrap gap-[clamp(32px,6vw,88px)] pt-[clamp(88px,11vw,150px)]">
      <div className="min-w-0 flex-[0_1_360px]">
        <SectionLabel className="mb-3.5">About</SectionLabel>
        <div className="grid aspect-[4/5] max-w-full place-items-center rounded-md bg-[var(--m2)] font-mono text-sm text-white">
          Your photo
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5 md:pt-9">
        <Reveal as="h2" className="font-display text-[clamp(36px,4.4vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em] [font-stretch:92%]">
          {about.title}
        </Reveal>
        <p className="max-w-[32em] text-[clamp(19px,1.6vw,21px)]">{about.lead}</p>
        <p className="max-w-[36em] text-muted-foreground">{about.body}</p>
        <ol className="mt-3">
          <Separator />
          {about.timeline.map((entry) => (
            <li key={entry.role}>
              <div className="flex flex-wrap gap-x-6 gap-y-1 py-4">
                <span className="w-[130px] font-mono text-sm text-muted-foreground">{entry.period}</span>
                <span className="flex-[1_1_260px]">
                  <strong className="font-semibold">{entry.role}</strong>
                  <br />
                  <span className="text-base text-muted-foreground">{entry.detail}</span>
                </span>
              </div>
              <Separator />
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-x-12 gap-y-6">
          {about.skills.map((skill) => (
            <div key={skill.group}>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{skill.group}</p>
              <p className="text-base">{skill.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
