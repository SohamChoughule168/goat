"use client";

import Link from "next/link";
import type { Route } from "next";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowUpRight, Search, X } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { audienceSolutions } from "@/content/institutional";
import { companyNav, primaryNav } from "@/content/navigation";
import { pillars } from "@/content/services";

const groups = [
  {
    title: "Navigate",
    links: primaryNav,
  },
  {
    title: "Solutions",
    links: [
      ...audienceSolutions.map((solution) => ({
        label: solution.title,
        href: `/solutions#${solution.id}`,
      })),
      { label: "Institution blueprint", href: "/blueprint" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Practice",
    links: pillars.map((pillar) => ({
      label: pillar.title,
      href: `/services/${pillar.slug}`,
    })),
  },
  {
    title: "Company",
    links: companyNav,
  },
];

interface SiteIndexProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSearch: () => void;
}

export default function SiteIndex({ open, onOpenChange, onOpenSearch }: SiteIndexProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="overlay-backdrop" />
        <DialogPrimitive.Content
          className="index-overlay"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="visually-hidden">Site index</DialogPrimitive.Title>

          <div className="index-overlay-head">
            <Link href="/" className="site-wordmark" onClick={() => onOpenChange(false)}>
              <LogoMark className="h-6 w-auto" />
              <span className="site-wordmark-name">ImaginarsClub</span>{" "}
              <span className="site-wordmark-meta">Site index</span>
            </Link>
            <DialogPrimitive.Close asChild>
              <button type="button" className="overlay-close">
                Close
                <span className="overlay-close-kbd" aria-hidden="true">
                  Esc
                </span>
                <X size={14} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <div className="index-overlay-body">
            <div className="inst-shell">
              <div className="index-grid">
                {groups.map((group) => (
                  <nav key={group.title} className="index-group" aria-label={group.title}>
                    <h2>{group.title}</h2>
                    <ul>
                      {group.links.map((link) => (
                        <li key={`${group.title}-${link.href}`}>
                          <DialogPrimitive.Close asChild>
                            <Link href={link.href as Route}>{link.label}</Link>
                          </DialogPrimitive.Close>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>
            </div>
          </div>

          <div className="index-overlay-foot">
            <button type="button" className="overlay-close" onClick={onOpenSearch}>
              <Search size={14} strokeWidth={1.6} aria-hidden="true" />
              Search everything
              <span className="overlay-close-kbd" aria-hidden="true">
                ⌘K
              </span>
            </button>
            <Link href="/contact" className="inst-link" onClick={() => onOpenChange(false)}>
              Start a conversation
              <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
