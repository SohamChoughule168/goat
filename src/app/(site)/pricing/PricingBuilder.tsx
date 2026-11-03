"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import PlanEmailForm from "@/components/leads/plan-email-form";
import {
  ALL_ADDONS,
  ADDON_GROUPS,
  OFFER,
  PACKAGES,
  formatINR,
  formatMonthly,
  type PackageSlug,
} from "@/content/packages";

export default function PricingBuilder() {
  const [selectedPackage, setSelectedPackage] = useState<PackageSlug>("growth");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const pkg = params.get("package");
      if (pkg === "starter" || pkg === "growth" || pkg === "pro") {
        setSelectedPackage(pkg);
      }
      const ids = params
        .getAll("addon")
        .flatMap((value) => value.split(","))
        .filter((id) => ALL_ADDONS.some((addon) => addon.id === id));
      if (ids.length) setSelectedAddons(Array.from(new Set(ids)));
    });
  }, []);

  const tier = PACKAGES.find((item) => item.slug === selectedPackage) ?? PACKAGES[1];
  const addons = ALL_ADDONS.filter((addon) => selectedAddons.includes(addon.id));

  const { onceTotal, monthlyTotal } = useMemo(() => {
    const once =
      tier.price +
      addons.reduce((sum, addon) => {
        const extra = addon.unit === "once" ? addon.price : 0;
        return sum + extra;
      }, 0);
    const monthly = addons.reduce((sum, addon) => {
      const recurring = addon.unit === "month" ? addon.price : 0;
      return sum + recurring + (addon.monthly ?? 0);
    }, 0);
    return { onceTotal: once, monthlyTotal: monthly };
  }, [tier, addons]);

  const summary = useMemo(() => {
    const lines = [
      `Package: ${tier.name} — ${formatINR(tier.price)} (festive price, usually ${formatINR(tier.original)})`,
      `Support included: ${tier.support}`,
    ];
    if (addons.length) {
      lines.push("Add-ons:");
      for (const addon of addons) {
        const recurring = addon.unit === "month" ? `/mo` : addon.monthly ? ` + ${formatINR(addon.monthly)}/mo` : "";
        lines.push(`• ${addon.name} — ${formatINR(addon.price)}${recurring}`);
      }
    } else {
      lines.push("Add-ons: none selected");
    }
    lines.push(`One-time total: ${formatINR(onceTotal)}`);
    if (monthlyTotal) lines.push(`Monthly: ${formatINR(monthlyTotal)}/mo`);
    return lines.join("\n");
  }, [tier, addons, onceTotal, monthlyTotal]);

  const whatsappHref = `${site.whatsapp}?text=${encodeURIComponent(
    `Hi ImaginarsClub Services, I would like a quote.\n\n${summary}`
  )}`;

  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Quote request — ${tier.name} package`
  )}&body=${encodeURIComponent(summary)}`;

  const quoteHref = `/quote/?package=${encodeURIComponent(
    selectedPackage
  )}&brief=${encodeURIComponent(summary)}`;

  const toggleAddon = (id: string) => {
    setSelectedAddons((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="ev-builder">
      <div className="ev-builder-head">
        <div>
          <p className="inst-label">Configure</p>
          <h2 className="inst-h2 mt-3">Start with the right size.</h2>
        </div>
        <p>
          Festive pricing is shown. The struck-through figure is the standard fee. Every total
          below is indicative until a written quote confirms the scope.
        </p>
      </div>

      <div className="ev-tier-grid">
        {PACKAGES.map((item) => {
          const active = item.slug === selectedPackage;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active}
              data-active={active}
              onClick={() => setSelectedPackage(item.slug)}
              className="ev-tier"
            >
              <span className="ev-tier-top">
                <span className="ev-tier-name">{item.name}</span>
                {item.featured && <span className="ev-tier-badge">Recommended</span>}
              </span>
              <span className="ev-tier-sub">{item.subtitle}</span>

              <span className="ev-tier-price">
                <strong>{formatINR(item.price)}</strong>
                <s>{formatINR(item.original)}</s>
              </span>
              <span className="ev-tier-support">{item.support}</span>

              <span className="ev-tier-best">{item.bestFor}</span>

              <span className="ev-tier-features">
                {item.features.map((feature) => (
                  <span key={feature} className="ev-tier-feature">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </span>
                ))}
              </span>

              <span className="ev-tier-action">
                {active ? "Selected" : "Select package"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="ev-builder-grid">
        <div>
          <div className="ev-builder-addons-head">
            <p className="inst-label">Add-ons / optional</p>
            <h3 className="inst-h3 mt-3">Only pay for what you need.</h3>
          </div>

          {ADDON_GROUPS.map((group) => (
            <fieldset key={group.id} className="ev-addon-group">
              <legend>
                <span>{group.title}</span>
                <span>{group.note}</span>
              </legend>

              {group.addons.map((addon) => {
                const active = selectedAddons.includes(addon.id);
                return (
                  <label key={addon.id} className="ev-addon">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleAddon(addon.id)}
                    />
                    <span>
                      <span className="ev-addon-head">
                        <span className="ev-addon-name">{addon.name}</span>
                        <span className="ev-addon-price">
                          {addon.unit === "month"
                            ? formatMonthly(addon.price)
                            : `${formatINR(addon.price)}${
                                addon.monthly ? ` + ${formatMonthly(addon.monthly)}` : ""
                              }`}
                        </span>
                      </span>
                      <span className="ev-addon-desc">{addon.description}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          ))}
        </div>

        <aside className="ev-summary" aria-label="Your selection">
          <p className="ev-micro">Your selection</p>
          <p className="ev-summary-name">{tier.name}</p>
          <p className="ev-summary-sub">{tier.subtitle}</p>

          <dl>
            <div>
              <dt>Package</dt>
              <dd>{formatINR(tier.price)}</dd>
            </div>
            <div>
              <dt>Festive saving</dt>
              <dd className="ev-summary-saving">−{formatINR(tier.original - tier.price)}</dd>
            </div>
            {addons.map((addon) => (
              <div key={addon.id}>
                <dt>{addon.name}</dt>
                <dd>
                  {addon.unit === "month"
                    ? formatMonthly(addon.price)
                    : `${formatINR(addon.price)}${
                        addon.monthly ? ` + ${formatMonthly(addon.monthly)}` : ""
                      }`}
                </dd>
              </div>
            ))}
          </dl>

          <div className="ev-summary-total">
            <div className="ev-summary-total-row">
              <span>One-time</span>
              <strong>{formatINR(onceTotal)}</strong>
            </div>
            {monthlyTotal > 0 && (
              <div className="ev-summary-total-row mt-2">
                <span>Recurring</span>
                <span className="font-mono text-sm">{formatMonthly(monthlyTotal)}</span>
              </div>
            )}
            <p className="ev-summary-note">
              Indicative. Scope, content and integrations are confirmed in a written quote before
              work starts. Taxes extra where applicable.
            </p>
          </div>

          <div className="ev-summary-actions">
            <Link href={quoteHref} className="inst-btn">
              Request a written quote
            </Link>
            <div className="ev-summary-pair">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inst-btn inst-btn-ghost"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                WhatsApp
              </a>
              <a href={mailHref} className="inst-btn inst-btn-ghost">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>

          <PlanEmailForm
            title={`${tier.name} package quote`}
            plan={selectedPackage}
            source="pricing"
            compact
            className="mt-4"
            lines={summary.split("\n")}
            footer={`${OFFER.label}. A written scope confirms the fixed price.`}
          />

          <p className="ev-summary-offer">
            {OFFER.label} · save up to {formatINR(OFFER.saveUpTo)} against standard fees.
          </p>
        </aside>
      </div>
    </div>
  );
}
