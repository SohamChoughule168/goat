import type { Metadata } from "next";
import { preload } from "react-dom";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import BlueprintBuilder from "@/components/blueprint/blueprint-builder";
import { JsonLd } from "@/components/seo/jsonld";
import { site } from "@/content/site";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Institution blueprint — plan before you build",
  description:
    "A live, printable blueprint for coaching institutes, schools and edtech teams. Name the bottleneck, see the build sequence and the right package.",
  path: "/blueprint",
});

const readingNotes = [
  {
    index: "01",
    title: "Build before connect.",
    body: "A layer is only recommended when the layers underneath it can support it. Mark what already exists; the sheet will tell you what to connect instead of rebuild.",
  },
  {
    index: "02",
    title: "The package is a boundary.",
    body: "The recommendation uses the published starting points. It does not replace a diagnosis, a scope or a written quote.",
  },
  {
    index: "03",
    title: "The sheet is not a proposal.",
    body: "It is a working artefact. Send it to the studio and we will test the assumptions against your actual systems.",
  },
];

export default function BlueprintPage() {
  preload("/fonts/geist-print-400.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/fonts/geist-print-500.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <div className="bp-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: "Institution blueprint",
              description:
                "A live, printable blueprint for coaching institutes, schools, school groups and edtech teams.",
              url: `${site.url}/blueprint`,
              isPartOf: { "@id": `${site.url}/#website` },
              about: { "@id": `${site.url}/#organization` },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Institution blueprint", path: "/blueprint" },
            ]),
          ],
        }}
      />

      <section className="inst-section bp-hero" aria-labelledby="blueprint-title">
        <div className="inst-shell">
          <div className="bp-hero-grid">
            <div>
              <p className="inst-label">Institution blueprint / working draft</p>
              <h1 className="inst-display-l bp-hero-title" id="blueprint-title">
                Plan the system
                <br />
                before you price the <span className="inst-serif">page.</span>
              </h1>
              <p className="inst-lede bp-hero-lede">
                A live, printable first draft for a coaching institute, school,
                school group or edtech team. Choose the institution, name the
                break, mark what already works, and see the build sequence and
                the closest package.
              </p>
              <div className="bp-hero-actions">
                <a className="inst-btn" href="#workbench">
                  Open the workbench
                  <ArrowDown size={14} aria-hidden="true" />
                </a>
                <Link className="inst-link" href="/platform">
                  See the eight layers
                  <ArrowUpRight
                    className="inst-link-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <aside className="bp-hero-note" aria-label="What the blueprint returns">
              <p className="inst-tag">What it returns</p>
              <ul>
                <li>
                  <span>01</span>
                  <p>A build sequence, phased and ordered.</p>
                </li>
                <li>
                  <span>02</span>
                  <p>A package boundary, not a hidden estimate.</p>
                </li>
                <li>
                  <span>03</span>
                  <p>A brief you can send, copy or print.</p>
                </li>
              </ul>
              <p className="bp-hero-footnote">
                No email. No saved data. The sheet updates in the browser.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="bp-workbench-section"
        id="workbench"
        aria-label="Blueprint workbench"
      >
        <div className="inst-shell">
          <BlueprintBuilder />
        </div>
      </section>

      <section className="inst-section-tight bp-reading" aria-label="How to read the blueprint">
        <div className="inst-shell">
          <div className="bp-reading-grid">
            {readingNotes.map((note) => (
              <article className="bp-reading-col" key={note.index}>
                <span className="bp-reading-index">{note.index}</span>
                <h2 className="bp-reading-title">{note.title}</h2>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section inst-dark bp-final" aria-labelledby="blueprint-final-title">
        <div className="inst-shell">
          <div className="bp-final-grid">
            <div>
              <p className="inst-label">Next step</p>
              <h2 className="inst-h2" id="blueprint-final-title">
                Bring the draft.
                <br />
                We will test it.
              </h2>
            </div>
            <div>
              <p className="inst-body">
                Send the sheet with the priority you chose. We will reply with
                the assumptions that need checking, the layers that can wait,
                and a scoped next step.
              </p>
              <div className="bp-final-actions">
                <Link className="inst-btn inst-btn-light" href="/contact/?intent=institutional">
                  Talk to the studio
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link className="inst-link" href="/book/">
                  Book a call
                  <ArrowUpRight
                    className="inst-link-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
                <Link className="inst-link" href="/platform">
                  Read the platform
                  <ArrowUpRight
                    className="inst-link-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
