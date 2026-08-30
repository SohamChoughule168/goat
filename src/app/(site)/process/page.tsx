import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Process",
  description: "Discovery, Strategy, Execution, Ownership — documented in depth.",
  path: "/process",
});

const STAGES = [
  {
    n: "01", title: "Discovery",
    duration: "Week 1",
    whatHappens: "A structured session plus a written audit of your current state. We crawl the existing site or review the brief, measure performance on real devices, and map the competitive landscape.",
    clientDoes: "Shares access to existing accounts, introduces us to anyone whose input matters, and answers questions about audiences and goals.",
    youReceive: "A shared-vocabulary document: audiences defined, success metrics agreed, constraints documented.",
    pitfalls: "Skipping this to save time is the most common cause of scope creep later.",
  },
  {
    n: "02", title: "Strategy",
    duration: "Weeks 1–2",
    whatHappens: "We produce a scoped plan: sitemap, content model, technical approach, milestone schedule and fixed quote. Every item traces back to a discovery finding.",
    clientDoes: "Reviews the plan, asks questions, and approves (or requests changes) within five working days.",
    youReceive: "A written scope of work with milestones, deliverables and payment terms. This is the contract.",
    pitfalls: "Vague briefs at this stage resurface mid-project as change requests.",
  },
  {
    n: "03", title: "Execution",
    duration: "Weeks 2–6+",
    whatHappens: "Working software appears on staging in weekly increments. Each increment is reviewable, testable and reversible. You provide feedback asynchronously via shared documents.",
    clientDoes: "Reviews staging builds, provides content by agreed deadlines, responds to async questions within one business day.",
    youReceive: "A product that exists and improves each week, plus progress notes explaining what changed and why.",
    pitfalls: "Delayed content or feedback is the number-one cause of timeline slip.",
  },
  {
    n: "04", title: "Ownership",
    duration: "Post-launch",
    whatHappens: "We measure against discovery metrics, fix what data exposes, then hand over everything: repositories, hosting accounts, analytics, pipelines, documentation.",
    clientDoes: "Confirms the handover checklist, updates passwords we were given during the engagement.",
    youReceive: "Full ownership of every asset created for you, plus documentation your next developer can read.",
    pitfalls: "Staying dependent on an agency after launch is a design flaw, not a business model.",
  },
];

export default function ProcessPage() {
  return (
    <main className="shell max-w-3xl section-y">
      <p className="micro">Process</p>
      <h1 className="display mt-4">How an engagement actually runs.</h1>
      <p className="lede mt-6">
        Four phases with honest timeframes. No black boxes, no surprise
        invoices, no disappearing act after launch.
      </p>
      <div className="mt-16 space-y-16">
        {STAGES.map((s) => (
          <section key={s.n} aria-label={s.title}>
            <div className="flex items-baseline gap-4 border-t-[3px] border-current pt-5">
              <span className="index">{s.n}</span>
              <h2 className="display" style={{ fontSize: "var(--text-h2)" }}>{s.title}</h2>
            </div>
            <dl className="mt-6 space-y-5">
              <div><dt className="micro">What happens</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{s.whatHappens}</dd></div>
              <div><dt className="micro">What you do</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{s.clientDoes}</dd></div>
              <div><dt className="micro">What you receive</dt><dd className="mt-1 leading-relaxed text-muted-foreground">{s.youReceive}</dd></div>
              <div><dt className="micro">Common pitfall</dt><dd className="mt-1 leading-relaxed text-destructive">{s.pitfalls}</dd></div>
            </dl>
          </section>
        ))}
      </div>
      <Link href="/contact" className="btn btn-primary mt-14">Start with Discovery</Link>
    </main>
  );
}
