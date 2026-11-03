import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Clock, MapPin } from "lucide-react";
import BookingPanel from "@/components/leads/booking-panel";
import WhatsAppCta from "@/components/leads/whatsapp-cta";
import { JsonLd } from "@/components/seo/jsonld";
import { site } from "@/content/site";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Book a discovery call — ImaginarsClub Services",
  description:
    "Book a 30-minute working call with ImaginarsClub Services. Bring the problem, leave with a clear next step, a likely scope and what to do first.",
  path: "/book",
});

const PREP = [
  {
    index: "01",
    title: "Who you serve.",
    copy: "Coaching institute, school, school group or edtech team — and roughly how many enquiries or students a month.",
  },
  {
    index: "02",
    title: "What is not working.",
    copy: "The website, admissions follow-up or operations problem in one sentence. Examples are more useful than abstractions.",
  },
  {
    index: "03",
    title: "Any real constraint.",
    copy: "An admission deadline, a board approval, a budget band or a system that cannot be replaced this year.",
  },
];

const AFTER = [
  "A likely scope boundary, not a vague range.",
  "The build sequence we would use, and why.",
  "The two assumptions that need checking.",
  "A clear next step: quote, blueprint or stop.",
];

export default function BookPage() {
  return (
    <div className="convert-page booking-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: "Book a discovery call",
              description:
                "Book a 30-minute working call with ImaginarsClub Services.",
              url: `${site.url}/book`,
              isPartOf: { "@id": `${site.url}/#website` },
              about: { "@id": `${site.url}/#organization` },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Book a call", path: "/book" },
            ]),
          ],
        }}
      />

      <section className="inst-section convert-hero" aria-labelledby="book-title">
        <div className="inst-shell convert-hero-grid">
          <div>
            <p className="inst-label">Discovery call / 30 minutes</p>
            <h1 className="inst-display-l convert-hero-title" id="book-title">
              A working call,
              <br />
              <span className="inst-serif">not a pitch.</span>
            </h1>
            <p className="inst-lede convert-hero-lede">
              Bring the problem. We will use the thirty minutes to name what is
              actually in the way, sketch the first useful sequence and tell you
              whether a project is the right answer.
            </p>
            <div className="convert-hero-actions">
              <a className="inst-btn" href="#book-a-time">
                Choose a time
                <ArrowDown size={14} aria-hidden="true" />
              </a>
              <Link className="inst-link" href="/quote/">
                Prefer writing? Request a quote
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
                30 minutes
              </li>
              <li>
                <MapPin size={14} aria-hidden="true" />
                Online, IST
              </li>
              <li>No deck required</li>
            </ul>
          </div>

          <aside className="convert-note" aria-label="How to prepare">
            <p className="inst-tag">Before the call</p>
            <ol>
              {PREP.map((item) => (
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
              If you only have a paragraph, that is enough. We would rather hear
              the real problem than review a polished brief.
            </p>
          </aside>
        </div>
      </section>

      <section
        className="inst-section-tight convert-body"
        id="book-a-time"
        aria-label="Booking options"
      >
        <div className="inst-shell convert-body-grid">
          <div className="convert-main">
            <BookingPanel />
          </div>

          <aside className="convert-aside">
            <p className="inst-label">What you leave with</p>
            <ol className="convert-aside-list">
              {AFTER.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>

            <div className="convert-aside-card">
              <p className="inst-tag">Not ready to book?</p>
              <p>
                Send the brief in writing. You will get a real first answer
                within one business day, without a call or a follow-up sequence.
              </p>
              <Link className="inst-link" href="/quote/">
                Request a written quote
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
