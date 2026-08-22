import Link from "next/link";

const COMMITMENTS = [
  { value: "<24h", label: "Reply on every enquiry", detail: "One business day, in writing." },
  {
    value: "100%",
    label: "Ownership at handover",
    detail: "Code, accounts, pipelines — configured in your name from day one.",
  },
  {
    value: "0",
    label: "Junior hand-offs",
    detail: "The people who scope your project are the people who build it.",
  },
];

export default function Commitments() {
  return (
    <section className="field" data-field="chartreuse" aria-label="Commitments">
      <div className="container">
        <p className="micro">Commitments</p>
        <h2 className="display mt-6 max-w-[20ch]">Three promises we can be held to.</h2>

        <ul className="mt-14 border-t-[4px] border-current">
          {COMMITMENTS.map((c) => (
            <li
              key={c.label}
              className="grid gap-2 border-b-[2px] border-current/25 py-8 sm:grid-cols-[160px_1fr] sm:gap-10"
            >
              <span className="display">{c.value}</span>
              <div>
                <h3 className="text-base font-medium">{c.label}</h3>
                <p className="muted mt-1 max-w-[58ch] text-sm leading-relaxed">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/about" className="link-line mt-10 inline-block font-medium underline-offset-4">
          More about how the studio runs →
        </Link>
      </div>
    </section>
  );
}
