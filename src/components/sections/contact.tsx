import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlagStrip } from "@/components/scene/prayer-flags";
import { site } from "@/data/site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const links = [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
    ...(site.links.resume ? [{ label: "Résumé (PDF)", href: site.links.resume }] : []),
  ];

  return (
    <section id="contact" className="relative mt-[clamp(96px,12vw,160px)] overflow-hidden bg-band text-band-foreground">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="block h-[90px] w-full bg-background">
        <path
          d="M0 120 L0 80 L120 50 L200 70 L320 20 L420 64 L540 34 L660 72 L780 28 L880 60 L1000 18 L1120 66 L1240 40 L1340 70 L1440 44 L1440 120 Z"
          style={{ fill: "var(--band)" }}
        />
      </svg>
      <div className="mx-auto max-w-[1320px] px-4 pb-[clamp(40px,5vw,64px)] pt-[clamp(48px,7vw,96px)] md:px-12">
        <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.1em] text-teal">Contact</p>
        <h2 className="max-w-[12em] font-display text-[clamp(48px,8vw,128px)] font-semibold leading-[0.98] tracking-[-0.035em] [font-stretch:90%]">
          Have something worth building?
        </h2>
        <p className="mb-10 mt-7 max-w-[32em] text-[clamp(18px,1.6vw,21px)] text-band-muted">
          Projects, roles or a technical second opinion. I reply within one working day.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-band-line py-5">
          <a
            href={`mailto:${site.email}`}
            className="min-w-0 flex-[1_1_280px] break-all font-display text-[clamp(22px,2.8vw,38px)] font-medium tracking-[-0.01em] hover:underline"
          >
            {site.email}
          </a>
          <Button onClick={copy} size="lg" className="h-12 bg-band-foreground px-5 text-band hover:bg-band-foreground/90">
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy email"}
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-5">
          <div className="flex flex-wrap gap-7 font-medium">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline-offset-[6px] opacity-85 hover:underline hover:opacity-100"
              >
                {link.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
          <p className="font-mono text-[13px] text-band-muted">
            © {new Date().getFullYear()} {site.name} · {site.city}
          </p>
        </div>
      </div>
      <FlagStrip className="h-2" />
    </section>
  );
}
