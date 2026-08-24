import Link from "next/link";
import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import SelectedWork from "@/components/home/selected-work";
import CapabilityGraph from "@/components/capability-graph";
import WideStatement from "@/components/home/wide-statement";
import MechanismStrip from "@/components/home/mechanism-strip";
import Commitments from "@/components/home/commitments";
import FinalCta from "@/components/home/final-cta";
import { pillars, getServicesByPillar } from "@/content/services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <CapabilitySection />
      <SelectedWork />
      <WideStatement />
      <MechanismStrip />
      <Commitments />
      <FinalCta />
    </>
  );
}

function CapabilitySection() {
  return (
    <section className="section-y" aria-label="Capability graph">
      <div className="shell">
        <div className="mb-10 max-w-2xl">
          <p className="micro"><span className="kicker-rule" aria-hidden="true" />Capabilities</p>
          <h2 className="mt-4 font-semibold" style={{ fontSize: "var(--text-h2)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--text-hi)" }}>
            One studio. Four practices. Eighteen services that compound.
          </h2>
          <p className="lede mt-4 text-sm">
            Build the product. Grow the demand. Tell the story. Enable the team.
            Each practice stands alone — together they run as one accountable system.
          </p>
        </div>
        <CapabilityGraph />

        {/* Practice index — compact editorial rows */}
        <ol className="mt-14 border-t border-[var(--line-strong)] list-none m-0 p-0">
          {pillars.map((p, i) => (
            <li key={p.slug} className="border-b border-[var(--line)]">
              <Link href={`/services/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-6 transition-colors hover:bg-[var(--surface-hover)] px-3 -mx-3 rounded-md">
                <span className="flex items-baseline gap-5 min-w-0">
                  <span className="index shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold transition-colors group-hover:text-[var(--blue-hover)]" style={{ color: "var(--text-hi)" }}>{p.title}</span>
                    <span className="mt-0.5 block text-sm" style={{ color: "var(--text-subtle)" }}>{p.kicker} — {p.description.split(".")[0].toLowerCase()}.</span>
                  </span>
                </span>
                <span className="index shrink-0 tabular-nums">{String(getServicesByPillar(p.slug).length).padStart(2, "0")} services</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
