import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Clock } from "lucide-react";
import QuoteForm from "@/components/leads/quote-form";
import WhatsAppCta from "@/components/leads/whatsapp-cta";
import { JsonLd } from "@/components/seo/jsonld";
import { site } from "@/content/site";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Request a written quote — ImaginarsClub Services",
  description:
    "Request a written quote for a website, portal, app or growth work. Fixed scope, timeline and exclusions — a real answer within one business day.",
  path: "/quote",
});

const RETURNS = [
  {
    index: "01",
    title: "A fixed price.",
    copy: "One figure for the agreed scope, not a range that moves after the first review.",
  },
  {
    index: "02",
    title: "A real timeline.",
    copy: "The build window, the review points and what we need from your side to hold it.",
  },
  {
    index: "03",
    title: "What is excluded.",
    copy: "Hosting, media spend, third-party tools and scope outside the agreed pages, named in writing.",
  },
];

const USEFUL = [
  "What the institution does and who it serves",
  "The problem in one sentence",
  "Any deadline, admission cycle or launch date",
  "What already exists — site, domain, content",
  "A budget band if you have one",
];

const NOT_NEEDED = [
  "A finished specification",
  "Polished copy",
  "Brand files",
  "A pitch deck",
  "Certainty about the package",
];

export default function QuotePage() {
  return (
    <div className="convert-page quote-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: "Request a written quote",
              description:
                "Request a written quote for a website, portal, app or growth work from ImaginarsClub Services.",
              url: `${site.url}/quote`,
              isPartOf: { "@id": `${site.url}/#website` },
              about: { "@id": `${site.url}/#organization` },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Request a quote", path: "/quote" },
            ]),
          ],
        }}
      />

      <section className="inst-section convert-hero" aria-labelledby="quote-title">
        <div className="inst-shell convert-hero-grid">
          <div>
            <p className="inst-label">Written quote / Fixed scope</p>
            <h1 className="inst-display-l convert-hero-title" id="quote-title">
              A written quote,
              <br />
              <span className="inst-serif">not a guess.</span>
            </h1>
            <p className="inst-lede convert-hero-lede">
              Send the shape of the work. The first reply is a written scope with
              a price, a timeline and the exclusions — enough to decide without
              another discovery call.
            </p>
            <div className="convert-hero-actions">
              <a className="inst-btn" href="#quote-form">
                Start the brief
                <ArrowDown size={14} aria-hidden="true" />
              </a>
              <Link className="inst-link" href="/pricing/">
                See package prices
                <ArrowUpRight
                  className="inst-link-arrow"
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            </div>
            <ul className="convert-facts">
              <li>
                <Clock size={14} aria-hidden="true" />
                One business day
              </li>
              <li>No sales sequence</li>
              <li>Written scope before work</li>
            </ul>
          </div>

          <aside className="convert-note" aria-label="What the quote includes">
            <p className="inst-tag">What lands in your inbox</p>
            <ol>
              {RETURNS.map((item) => (
                <li key={item.index}>
                  <span>{item.index}</span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="convert-note-foot">
              If we are not the right studio, we say so in the first reply. A
              quote is not a commitment to work together.
            </p>
          </aside>
        </div>
      </section>

      <section
        className="inst-section-tight convert-body"
        id="quote-form"
        aria-label="Request a written quote"
      >
        <div className="inst-shell quote-form-grid">
          <QuoteForm />

          <aside className="convert-aside quote-aside">
            <div>
              <p className="inst-label">Useful, not required</p>
              <ul className="convert-detail-list">
                {USEFUL.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="inst-label">You do not need</p>
              <ul className="convert-detail-list convert-detail-muted">
                {NOT_NEEDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="convert-aside-card">
              <p className="inst-tag">Need a conversation first?</p>
              <p>
                Book a thirty-minute working call instead. Bring the problem; we
                will test whether a project is the right next step.
              </p>
              <Link className="inst-link" href="/book/">
                Book a call
                <ArrowUpRight
                  className="inst-link-arrow"
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <WhatsAppCta
              className="inst-btn inst-btn-ghost convert-whatsapp"
              label="Ask a question on WhatsApp"
            />
          </aside>
        </div>
      </section>
    </div>
  );
}
