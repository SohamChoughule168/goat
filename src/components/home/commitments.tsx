import Link from "next/link";

const COMMITMENTS = [
  { value: "<24h", label: "Reply on every enquiry", detail: "One business day, in writing." },
  { value: "100%", label: "Ownership at handover", detail: "Code, accounts, pipelines — configured in your name." },
  { value: "0", label: "Junior hand-offs", detail: "The people who scope your project build it." },
];

export default function Commitments() {
  return (
    <section className="section-y" aria-label="Commitments">
      <div className="container max-w-3xl">
        <p className="micro">Commitments</p>
        <h2 className="mt-3 text-h2 font-semibold tracking-[var(--track-h2)]">
          Three promises we can be held to.
        </h2>
        <ul className="mt-10 border-t-[3px] border-current space-y-0">
          {COMMITMENTS.map((c) => (
            <li key={c.label} className="grid gap-2 border-b-2 border-current/15 py-7 sm:grid-cols-[140px_1fr] sm:gap-8">
              <span className="text-h4 font-semibold">{c.value}</span>
              <div>
                <p className="font-medium">{c.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/about" className="link-line mt-8 inline-block text-sm font-medium">
          More about the studio →
        </Link>
      </div>
    </section>
  );
}
