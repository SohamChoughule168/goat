"use client";

import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Hero", href: "#home-hero" },
  { label: "Sequence", href: "#home-sequence" },
  { label: "Stack", href: "#home-stack" },
  { label: "Capabilities", href: "#home-capabilities" },
  { label: "Command Center", href: "#home-command" },
  { label: "Features", href: "#home-premium" },
  { label: "Method", href: "#home-method" },
  { label: "Pricing", href: "#home-economics" },
  { label: "Trust", href: "#home-trust" },
];

/**
 * Sticky Section Navigator — Apple-style table of contents that stays
 * in view as you scroll. Highlights the current section.
 */
export default function SectionNavigator() {
  return (
    <nav className="nav-section" aria-label="Section navigation">
      <div className="inst-shell nav-shell">
        <div className="nav-list">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-item"
            >
              <span className="nav-dot" />
              <span className="nav-label">{item.label}</span>
              <span className="nav-line" />
            </Link>
          ))}
        </div>
        <div className="nav-progress" />
      </div>
    </nav>
  );
}
