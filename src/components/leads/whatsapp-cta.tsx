"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildLeadWhatsAppMessage } from "@/lib/lead-actions";
import { buildWhatsAppHref } from "@/lib/leads";

export default function WhatsAppCta({
  label = "Chat on WhatsApp",
  packageName,
  plan,
  className = "",
}: {
  label?: string;
  packageName?: string;
  plan?: string;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const href = buildWhatsAppHref({
    message: buildLeadWhatsAppMessage({ pathname, packageName, plan }),
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className || "inst-btn inst-btn-ghost"}
    >
      <MessageCircle size={15} strokeWidth={1.7} aria-hidden="true" />
      {label}
    </a>
  );
}
