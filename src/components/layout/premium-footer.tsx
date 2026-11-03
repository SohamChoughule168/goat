"use client";

import Link from "next/link";
import { site } from "@/content/site";

/**
 * Premium Footer — multi-column with newsletter signup,
 * social links, and company info. Apple-grade footer design.
 */
export default function PremiumFooter() {
  return (
    <footer className="premium-footer" aria-label="Footer">
      <div className="inst-shell premium-footer-inner">
        <div className="premium-footer-grid">
          <div className="premium-footer-brand">
            <Link href="/" className="premium-footer-logo">
              <span className="inst-serif text-[1.5rem] font-semibold tracking-tight text-[var(--ink)]">
                ImaginarsClub
              </span>
            </Link>
            <p className="premium-footer-brand-copy mt-4 text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">
              Websites, student portals and admissions systems for coaching institutes,
              schools and edtech teams — built in Mumbai.
            </p>
            <div className="premium-footer-social mt-6 flex gap-3">
              <a href="https://in.linkedin.com/company/imaginarsclubservices" className="premium-footer-social-link" target="_blank" rel="noopener noreferrer">
                <span className="inst-serif text-[var(--ink-2)]">LinkedIn</span>
              </a>
              <a href="https://wa.me/919372809022" className="premium-footer-social-link">
                <span className="inst-serif text-[var(--ink-2)]">WhatsApp</span>
              </a>
              <a href={`mailto:${site.email}`} className="premium-footer-social-link">
                <span className="inst-serif text-[var(--ink-2)]">Email</span>
              </a>
            </div>
          </div>

          <div className="premium-footer-columns">
            <div className="premium-footer-column">
              <h4 className="premium-footer-column-title">Institution</h4>
              <ul className="premium-footer-links">
                <li><Link href="/platform/">Platform</Link></li>
                <li><Link href="/solutions/">Solutions</Link></li>
                <li><Link href="/pricing/">Pricing</Link></li>
                <li><Link href="/book/">Book a discovery call</Link></li>
                <li><Link href="/quote/">Request a quote</Link></li>
                <li><Link href="/blueprint/">Institution blueprint</Link></li>
                <li><Link href="/estimate/">Scope Architect</Link></li>
                <li><Link href="/contact/?intent=health-check">Health Check</Link></li>
              </ul>
            </div>
            <div className="premium-footer-column">
              <h4 className="premium-footer-column-title">Proof</h4>
              <ul className="premium-footer-links">
                <li><Link href="/work/">Work</Link></li>
                <li><Link href="/craft/">Craft</Link></li>
                <li><Link href="/trust/">Trust</Link></li>
                <li><Link href="/process/">Process</Link></li>
                <li><Link href="/insights/">Field Notes</Link></li>
              </ul>
            </div>
            <div className="premium-footer-column">
              <h4 className="premium-footer-column-title">Company</h4>
              <ul className="premium-footer-links">
                <li><Link href="/about/">About</Link></li>
                <li><Link href="/careers/">Careers</Link></li>
                <li><Link href="/contact/">Contact</Link></li>
                <li><Link href="/faq/">FAQ</Link></li>
              </ul>
            </div>
            <div className="premium-footer-column">
              <h4 className="premium-footer-column-title">Legal</h4>
              <ul className="premium-footer-links">
                <li><Link href="/legal/privacy/">Privacy</Link></li>
                <li><Link href="/legal/terms/">Terms</Link></li>
                <li><Link href="/legal/cookies/">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="premium-footer-newsletter">
            <h4 className="premium-footer-column-title">Stay updated</h4>
            <p className="premium-footer-newsletter-copy mt-2 text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">
              We reply to every enquiry within one business day.
            </p>
            <div className="premium-footer-contact mt-4 flex flex-col gap-1">
              <a href={`tel:${site.phoneHref}`} className="premium-footer-contact-item">
                <span className="inst-serif text-[var(--ink)]">{site.phone}</span>
              </a>
              <a href={`mailto:${site.email}`} className="premium-footer-contact-item">
                <span className="inst-serif text-[var(--ink)]">{site.email}</span>
              </a>
              <span className="premium-footer-contact-item">
                <span className="inst-serif text-[var(--ink-3)]">Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
              </span>
            </div>
          </div>
        </div>

        <div className="premium-footer-divider" />
        
        <div className="premium-footer-bottom flex flex-wrap items-center justify-between gap-3 mt-6">
          <p className="text-[0.6875rem] text-[var(--ink-3)]">
            © 2026 ImaginarsClub Services. All rights reserved.
          </p>
          <p className="text-[0.6875rem] text-[var(--ink-3)]">
            Mumbai, India · Built for institutions that intend to keep the system.
          </p>
        </div>
      </div>
    </footer>
  );
}
