import Link from "next/link";
import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import SelectedWork from "@/components/home/selected-work";
import CapabilityGraph from "@/components/capability-graph";
import WideStatement from "@/components/home/wide-statement";
import MechanismStrip from "@/components/home/mechanism-strip";
import Commitments from "@/components/home/commitments";
import FinalCta from "@/components/home/final-cta";
import { getServicesByPillar, pillars } from "@/content/services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <CapabilitySection />
      <SelectedWork />
      <PracticeRows />
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
      <div className="container">
        <p className="micro">Capabilities</p>
        <h2 className="mt-3 text-h2 font-semibold tracking-[var(--track-h2)]">
          18 services. Four practices.
        </h2>
        <div className="mt-12">
          <CapabilityGraph />
        </div>
      </div>
    </section>
  );
}

function PracticeRows() {
  return (
    <section className="section-y" aria-label="Practice areas">
      <div className="container max-w-3xl">
        <p className="micro">Practices</p>
        <ol className="mt-10 border-t-[3px] border-current">
          {pillars.map((p, i) => (
            <li key={p.slug} className="border-b-2 border-current/15 py-8">
              <Link href={`/services/${p.slug}`} className="group flex items-baseline justify-between gap-6">
                <span>
                  <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-xl font-semibold">{p.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.kicker}</span>
                </span>
                <span className="index shrink-0">{getServicesByPillar(p.slug).length} services</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
