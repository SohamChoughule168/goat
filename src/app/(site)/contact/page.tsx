import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
import HeroLedger from "@/components/editorial/hero-ledger";
import { JsonLd } from "@/components/seo/jsonld";
import { breadcrumbSchema, createMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Contact — Start a Project",
  description:
    "Tell us what you're building. Call, WhatsApp or send the brief form — every enquiry gets a reply within one business day.",
  path: "/contact",
});

const CHANNELS = [
  {
    icon: Phone,
    label: "Call",
    value: site.phone,
    href: `tel:${site.phoneHref}`,
    note: site.hours.days,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.phone,
    href: site.whatsapp,
    note: "Usually fastest response",
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Replies within one business day",
  },
];

const RESPONSE_STEPS = [
  {
    index: "01 / You",
    title: "You send the brief.",
    copy:
      "The form, WhatsApp or email — whichever is least friction. A paragraph about what is not working is enough to start.",
  },
  {
    index: "02 / Us",
    title: "We read it properly.",
    copy:
      "No auto-router, no lead score, no chatbot. The person who would do the work reads the enquiry and checks whether we are a sensible fit.",
  },
  {
    index: "03 / <24h",
    title: "You get a real first answer.",
    copy:
      "Scope, likely range, feasibility and the one thing we would need to know next. If we are not the right studio, we say so.",
  },
  {
    index: "04 / Both",
    title: "You decide without a chase.",
    copy:
      "No follow-up sequence and no pressure call. If you want to proceed, we send a written scope. If not, the thread simply ends.",
  },
];

const HELPFUL_DETAILS = [
  "What the business does and who it serves",
  "The problem in one sentence",
  "Any deadline, event or launch date",
  "What already exists — site, domain, content",
  "A budget range if you have one in mind",
];

const NOT_NEEDED = [
  "A finished specification",
  "Polished website copy",
  "Logo or brand files",
  "A pitch deck",
  "Certainty about which package you need",
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div className="page-hero-copy">
            <p data-reveal="fade" className="eyebrow">
              Contact · Mumbai, IST
            </p>
            <h1 data-reveal="up" className="display-1 mt-5">
              Tell us what
              <span className="font-serif font-normal italic text-primary">
                {" "}
                you&apos;re building.
              </span>
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="lede">
              The more context you give, the sharper our first answer will be — scope, timeline,
              honest feasibility, and a price range without a sales call. One reply, written by a
              person, within one business day.
            </p>
            <div className="page-hero-actions" data-reveal="up" data-reveal-delay="140">
              <a href="#send" className="btn btn-primary">
                Send the brief
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Message on WhatsApp
              </a>
            </div>
            <p className="page-hero-note" data-reveal="fade" data-reveal-delay="200">
              <span>No sales sequence</span>
              <span>No auto-router</span>
              <span>Written reply, not a calendar link</span>
            </p>
          </div>

          <HeroLedger
            eyebrow="Response ledger / inbound"
            value="24h"
            title="one business day. Written by a person."
            rows={[
              { label: "Reply", value: "Within 1 business day" },
              { label: "First answer", value: "Scope + honest range" },
              { label: "Studio", value: "Kanjur Marg East, Mumbai" },
              { label: "Hours", value: "Mon–Sat · 9–7 IST" },
            ]}
            footer="WhatsApp is usually fastest"
            slip="Reply / <24h"
          />
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="response-steps">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">After you press send</p>
              <h2 id="response-steps" className="display-2 mt-4 max-w-[16ch]">
                Four steps. No <em>mystery funnel.</em>
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              Most studios hide their process behind a discovery call. Here is exactly what happens
              after an enquiry reaches us — including the step where we tell you not to hire us.
            </p>
          </div>

          <div className="contact-steps mt-12">
            {RESPONSE_STEPS.map((step, index) => (
              <article
                key={step.index}
                className="contact-step"
                data-reveal="up"
                data-reveal-delay={String(index * 70)}
              >
                <time>{step.index}</time>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="send"
        className="section-y scroll-mt-24 border-t border-[var(--rule)]"
        aria-labelledby="send-title"
      >
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal="up">
              Direct lines
            </p>
            <h2 id="send-title" className="display-2 mt-4 max-w-[14ch]" data-reveal="up">
              Or skip the form.
            </h2>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-[var(--ink-3)]" data-reveal="up">
              If you already know what you need, call or message. We will ask the same questions the
              form would have asked — just faster.
            </p>

            <div className="mt-8 space-y-3">
              {CHANNELS.map((c, i) => (
                <a
                  key={c.label}
                  data-reveal="up"
                  data-reveal-delay={String(i * 50)}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-5 border border-[var(--rule)] bg-[var(--paper-2)] p-5 transition-colors hover:border-[var(--rule-strong)] hover:bg-[var(--paper)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--rule)] text-[var(--accent)]">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
                      {c.label}
                    </span>
                    <span className="block truncate text-sm font-medium">{c.value}</span>
                    <span className="block text-xs text-[var(--ink-3)]">{c.note}</span>
                  </span>
                </a>
              ))}
            </div>

            <div
              data-reveal="up"
              data-reveal-delay="150"
              className="mt-3 border border-[var(--rule)] p-5 text-sm"
            >
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-[var(--ink-3)]">
                  {site.address.line1}, {site.address.line2}, {site.address.city}{" "}
                  {site.address.postalCode}
                </span>
              </p>
              <p className="mt-3 flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-[var(--ink-3)]">
                  {site.hours.days}
                  <br />
                  {site.hours.time}
                </span>
              </p>
            </div>
          </div>

          <div
            data-reveal="up"
            data-reveal-delay="80"
            className="relative h-fit border border-[var(--rule)] bg-[var(--paper-2)] p-6 md:p-9"
          >
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-[var(--rule)] pb-5">
              <div>
                <p className="eyebrow">Project brief</p>
                <h2 className="display-3 mt-3">Send the brief</h2>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] sm:block">
                Takes ~2 min
              </span>
            </div>
            <ContactForm
              serviceOptions={[
                ...services.map((s) => s.title),
                "Starter package",
                "Growth package",
                "Pro package",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section-y border-t border-[var(--rule)]" aria-labelledby="first-message">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div data-reveal="up">
              <p className="eyebrow">A useful first message</p>
              <h2 id="first-message" className="display-2 mt-4 max-w-[17ch]">
                Short is fine. <em>Vague is harder.</em>
              </h2>
            </div>
            <p className="lede" data-reveal="up" data-reveal-delay="80">
              You do not need a brief, a deck or a finished idea. You need enough context for us to
              tell whether we can help — and roughly what it would take.
            </p>
          </div>

          <div className="fit-grid mt-12">
            <div data-reveal="up">
              <p className="micro mb-4 text-[var(--accent)]">Helpful, if you have it</p>
              <ul className="fit-list">
                {HELPFUL_DETAILS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div data-reveal="up" data-reveal-delay="80">
              <p className="micro mb-4 text-[var(--ink-3)]">You do not need</p>
              <ul className="fit-list fit-list-muted">
                {NOT_NEEDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-12 flex flex-col gap-5 border border-[var(--rule)] bg-[var(--paper-2)] p-6 sm:flex-row sm:items-center sm:justify-between"
            data-reveal="up"
          >
            <p className="max-w-[58ch] text-sm leading-relaxed text-[var(--ink-3)]">
              Not ready to talk? The pricing page explains what is included and the process page
              shows how a build runs. Both are readable without submitting anything.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/pricing" className="btn btn-secondary">
                See pricing
              </Link>
              <Link href="/process" className="btn btn-secondary">
                See process
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
