import Link from "next/link";
import { site } from "@/content/site";
import Magnetic from "@/components/motion/magnetic";

export function FooterCTA() {
  return (
    <section id="footer-cta" className="section-y" aria-label="Start a project">
      <div className="shell">
        <div className="cta-block px-6 py-14 md:px-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">Next step</p>
              <h2 className="display-2 mt-5">
                <span className="block text-balance">
                  Tell us what you&rsquo;re building.
                </span>{" "}
                <span className="block text-balance">
                  <em>We&rsquo;ll tell you what it takes.</em>
                </span>
              </h2>
            </div>
            <div>
              <p className="lede max-w-sm">
                An honest assessment, a clear scope, and a reply within one business day.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link href="/contact" className="btn btn-primary">
                    Start a project
                  </Link>
                </Magnetic>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Message on WhatsApp
                </a>
              </div>
              <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.16em] opacity-60">
                Or email{" "}
                <a href={`mailto:${site.email}`} className="link-line">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterCTA;
