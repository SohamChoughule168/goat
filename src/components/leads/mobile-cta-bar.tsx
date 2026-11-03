"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MessageCircle } from "lucide-react";
import { buildLeadWhatsAppMessage } from "@/lib/lead-actions";
import { buildWhatsAppHref } from "@/lib/leads";

const HIDDEN_PATHS = new Set(["/book", "/quote"]);

const normalisePath = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export default function MobileCtaBar() {
  const pathname = normalisePath(usePathname() ?? "/");

  if (HIDDEN_PATHS.has(pathname)) return null;

  const whatsappHref = buildWhatsAppHref({
    message: buildLeadWhatsAppMessage({ pathname }),
  });

  return (
    <nav className="mobile-cta-bar" aria-label="Quick contact">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
        className="mobile-cta-bar-whatsapp"
      >
        <MessageCircle size={17} strokeWidth={1.8} aria-hidden="true" />
        WhatsApp
      </a>
      <Link href="/book" className="mobile-cta-bar-book">
        <CalendarDays size={17} strokeWidth={1.8} aria-hidden="true" />
        Book a call
      </Link>
    </nav>
  );
}
