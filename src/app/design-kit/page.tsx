import Link from "next/link";

export const metadata = {
  title: "Design kit — fields",
  robots: { index: false, follow: false },
};

const FIELDS = [
  { name: "paper" },
  { name: "ink" },
  { name: "cobalt" },
  { name: "violet" },
  { name: "vermilion" },
  { name: "chartreuse" },
  { name: "jade" },
] as const;

export default function DesignKitPage() {
  return (
    <main>
      <section className="field" data-field="paper">
        <div className="container">
          <p className="micro">Design kit · v2 field system</p>
          <h1 className="display mt-6">Seven fields, one ink each.</h1>
          <hr className="rule-heavy my-8" />
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Start a project
            </Link>
            <Link href="/services" className="btn btn-secondary">
              See services
            </Link>
          </div>
          <div className="mt-10 max-w-md">
            <label htmlFor="dk-email" className="micro">
              Email
            </label>
            <input
              id="dk-email"
              type="email"
              placeholder="you@company.com"
              className="input mt-2"
            />
          </div>
        </div>
      </section>

      {FIELDS.slice(1).map((f) => (
        <section key={f.name} className="field field-wipe" data-field={f.name}>
          <div className="container">
            <div className="flex items-baseline justify-between gap-6">
              <p className="micro">{f.name} field</p>
              <span className="index">
                {String(FIELDS.findIndex((x) => x.name === f.name) + 1).padStart(2, "0")} / 07
              </span>
            </div>
            <p className="mega mt-8">{f.name.toUpperCase()}</p>
            <hr className="rule-heavy my-8" />
            <p className="lede muted max-w-[46ch]">
              Field ink inverts automatically. One flat colour, edge to edge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">
                Primary on {f.name}
              </button>
              <button type="button" className="btn btn-secondary">
                Secondary
              </button>
            </div>
          </div>
        </section>
      ))}

      <section className="field" data-field="ink" aria-label="Marquee demo">
        <div className="marquee py-6">
          <span className="mega">
            Websites · Apps · AI · SEO · Content ·&nbsp;Websites · Apps · AI · SEO ·
            Content ·&nbsp;
          </span>
        </div>
      </section>
    </main>
  );
}

