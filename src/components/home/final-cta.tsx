import Link from "next/link";
import { site } from "@/content/site";

export default function FinalCta() {
  return (
    <section className="section-y border-t border-border" aria-label="Start a project">
      <div className="shell">
        <p className="micro">Next step</p>
        <h2 className="display-2 mt-4 max-w-[22ch]">
          Tell us what you&rsquo;re building. We&rsquo;ll tell you what it takes.
        </h2>
        <p className="lede mt-5 text-sm">
          An honest assessment, a clear scope, and a reply within one business day.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
