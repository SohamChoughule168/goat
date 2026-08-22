import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
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

export default function ContactPage() {
  return (
    <>
      <section className="section-y pb-10">
        <div className="shell">
          <p data-reveal="fade" className="eyebrow mb-5">
            Contact
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            Tell us what
            <span className="font-serif font-normal italic text-primary"> you&apos;re building.</span>
          </h1>
          <p data-reveal="up" className="lede mt-7 max-w-2xl">
            The more context you give, the sharper our first answer will be — scope,
            timeline, honest feasibility, and a price range without a sales call.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-4" >
            {CHANNELS.map((c, i) => (
              <a
                key={c.label}
                data-reveal="up"
                data-reveal-delay={String(i * 50)}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-5 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/50 hover:bg-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="block truncate text-sm font-medium">{c.value}</span>
                  <span className="block text-xs text-muted-foreground">{c.note}</span>
                </span>
              </a>
            ))}

            <div data-reveal="up" data-reveal-delay="150" className="rounded-xl border border-border p-5 text-sm">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">
                  {site.address.line1}, {site.address.line2}, {site.address.city}{" "}
                  {site.address.postalCode}
                </span>
              </p>
              <p className="mt-3 flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">
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
            className="relative h-fit rounded-xl border border-border bg-card/40 p-7 md:p-9"
          >
            <h2 className="display-3 mb-8">Send the brief</h2>
            <ContactForm serviceOptions={services.map((s) => s.title)} />
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
