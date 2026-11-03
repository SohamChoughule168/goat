import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { footerColumns } from "@/content/navigation";
import { site } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="inst-shell">
        <div className="footer-top">
          <div className="footer-contact">
            <Link
              href="/"
              className="site-wordmark"
              aria-label="ImaginarsClub Institutional systems — home"
            >
              <LogoMark className="h-7 w-auto" />
              <span className="site-wordmark-name">ImaginarsClub</span>{" "}
              <span className="site-wordmark-meta">Institutional systems</span>
            </Link>

            <p className="footer-description">{site.description}</p>

            <address>
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city} {site.address.postalCode}
              </span>
              <span className="footer-contact-links">
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </span>
              <span>
                {site.hours.days}, {site.hours.time}
              </span>
            </address>

            <p className="footer-response">{site.hours.responseNote}</p>

            <ul className="footer-socials">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label}
                    <ArrowUpRight size={12} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav className="footer-col" key={column.title} aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href as Route}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>Mumbai, India · Monday – Saturday</p>
          <p className="footer-colophon">
            Built for institutions that intend to keep the system. You own the accounts, code and data.
          </p>
        </div>
      </div>
    </footer>
  );
}
