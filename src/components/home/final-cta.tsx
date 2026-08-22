import Link from "next/link";
import { site } from "@/content/site";

export default function FinalCta() {
  return (
    <section className="field" data-field="ink" aria-label="Start a project">
      <div className="container">
        <p className="micro opacity-70">Next step</p>
        <h2 className="display mt-6 max-w-[24ch]">
          Tell us what you&rsquo;re building. We&rsquo;ll tell you what it takes.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line font-medium underline-offset-4"
          >
            or message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
