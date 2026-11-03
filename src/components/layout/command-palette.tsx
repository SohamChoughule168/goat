"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Search, X } from "lucide-react";
import { audienceSolutions } from "@/content/institutional";
import { companyNav, primaryNav } from "@/content/navigation";
import { PACKAGES } from "@/content/packages";
import { pillars, allServices } from "@/content/services";
import { caseStudies } from "@/content/work";
import { insights } from "@/content/insights";

interface PaletteItem {
  label: string;
  href: string;
  type: string;
  meta?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const items = useMemo<PaletteItem[]>(
    () => [
      ...primaryNav.map((item) => ({ ...item, type: "Navigate" })),
      ...companyNav.map((item) => ({ ...item, type: "Company" })),
      ...pillars.map((pillar) => ({
        label: pillar.title,
        href: `/services/${pillar.slug}`,
        type: "Practice",
        meta: pillar.kicker,
      })),
      ...allServices.map((service) => ({
        label: service.title,
        href: `/services/${service.slug}`,
        type: "Capability",
        meta: service.tagline,
      })),
      ...audienceSolutions.map((solution) => ({
        label: solution.title,
        href: `/solutions#${solution.id}`,
        type: "Solution",
        meta: solution.problem,
      })),
      ...PACKAGES.map((tier) => ({
        label: `${tier.name} package`,
        href: `/pricing#${tier.slug}`,
        type: "Pricing",
        meta: tier.subtitle,
      })),
      { label: "Institutional engagement", href: "/pricing#institutional", type: "Pricing" },
      {
        label: "Institution blueprint",
        href: "/blueprint",
        type: "Plan",
        meta: "Draft a build sequence before you price the page.",
      },
      ...insights.map((insight) => ({
        label: insight.title,
        href: `/insights/${insight.slug}`,
        type: "Field Note",
        meta: insight.category,
      })),
      ...caseStudies.map((study) => ({
        label: study.client,
        href: `/work/${study.slug}`,
        type: "Proof",
        meta: `${study.sector} · ${study.year}`,
      })),
    ],
    []
  );

  function navigate(href: string) {
    onOpenChange(false);
    router.push(href as Route);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="overlay-backdrop" />
        <DialogPrimitive.Content
          className="palette-overlay"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="visually-hidden">
            Search ImaginarsClub
          </DialogPrimitive.Title>
          <PaletteSearch items={items} onNavigate={navigate} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function PaletteSearch({
  items,
  onNavigate,
}: {
  items: PaletteItem[];
  onNavigate: (href: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 9);
    return items
      .filter((item) =>
        `${item.label} ${item.type} ${item.meta ?? ""}`.toLowerCase().includes(normalized)
      )
      .slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    const node = document.getElementById(`palette-result-${selected}`);
    node?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((index) => Math.min(index + 1, filtered.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && filtered[selected]) {
      event.preventDefault();
      onNavigate(filtered[selected].href);
    }
  }

  return (
    <>
      <div className="palette-input-row">
        <Search size={16} strokeWidth={1.6} aria-hidden="true" />
        <input
          className="palette-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search capabilities, solutions, proof…"
          aria-label="Search the site"
          aria-controls="palette-results"
          aria-activedescendant={
            filtered[selected] ? `palette-result-${selected}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
        />
        <DialogPrimitive.Close asChild>
          <button type="button" className="overlay-close" aria-label="Close search">
            <span className="overlay-close-kbd" aria-hidden="true">
              Esc
            </span>
            <X size={14} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </DialogPrimitive.Close>
      </div>

      <div className="palette-results" id="palette-results" role="listbox">
        {filtered.length ? (
          filtered.map((item, index) => (
            <a
              key={`${item.type}-${item.href}-${item.label}`}
              id={`palette-result-${index}`}
              href={item.href}
              role="option"
              aria-selected={index === selected}
              className="palette-result"
              data-selected={index === selected}
              onMouseEnter={() => setSelected(index)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
            >
              <span>
                {item.label}
                {item.meta ? (
                  <span style={{ display: "block", marginTop: 2, opacity: 0.65, fontSize: "0.75rem" }}>
                    {item.meta}
                  </span>
                ) : null}
              </span>
              <span className="palette-result-type">{item.type}</span>
            </a>
          ))
        ) : (
          <p className="palette-empty">
            Nothing matched “{query}”. Try a capability, solution or{" "}
            <a href="/contact">start a conversation</a>.
          </p>
        )}
      </div>

      <div className="palette-foot">
        <span>↑ ↓ to move · Enter to open</span>
        <span>Esc to close</span>
      </div>
    </>
  );
}
