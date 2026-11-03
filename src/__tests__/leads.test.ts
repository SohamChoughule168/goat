import { describe, expect, it, vi } from "vitest";
import {
  buildLeadPayload,
  buildMailtoHref,
  buildWhatsAppHref,
  formatPlanSummary,
  getLeadContext,
  submitLead,
} from "@/lib/leads";

describe("getLeadContext", () => {
  it("extracts page, package, plan and attribution from the URL", () => {
    const context = getLeadContext({
      pathname: "/pricing",
      search:
        "?package=growth&plan=Growth+plan&utm_source=newsletter&utm_medium=email&utm_campaign=admissions&utm_term=institute&utm_content=cta",
      source: "pricing-builder",
    });

    expect(context).toEqual({
      page: "/pricing",
      source: "pricing-builder",
      package: "growth",
      plan: "Growth plan",
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "admissions",
      utmTerm: "institute",
      utmContent: "cta",
    });
  });

  it("lets an explicit package override the query string", () => {
    const context = getLeadContext({
      pathname: "/quote",
      search: "?package=starter",
      packageSlug: "pro",
    });

    expect(context.package).toBe("pro");
  });

  it("omits absent and empty values", () => {
    const context = getLeadContext({
      pathname: "/contact",
      search: "?package=&utm_source=",
    });

    expect(context).toEqual({ page: "/contact" });
  });
});

describe("buildLeadPayload", () => {
  it("normalizes fields and adds submission metadata", () => {
    const payload = buildLeadPayload({
      intent: "quote",
      context: {
        page: "/quote",
        package: "growth",
        utmSource: "google",
      },
      fields: {
        name: "  Asha Rao  ",
        email: "asha@example.com",
        services: ["Website", "SEO"],
        empty: "",
        missing: undefined,
      },
      now: new Date("2026-10-25T10:00:00.000Z"),
    });

    expect(payload).toMatchObject({
      intent: "quote",
      source: "website",
      page: "/quote",
      package: "growth",
      utmSource: "google",
      name: "Asha Rao",
      email: "asha@example.com",
      services: "Website, SEO",
      submittedAt: "2026-10-25T10:00:00.000Z",
      _subject: "Quote request",
    });
    expect(payload).not.toHaveProperty("empty");
    expect(payload).not.toHaveProperty("missing");
  });

  it("uses the context source and a plan-specific subject", () => {
    const payload = buildLeadPayload({
      intent: "plan-email",
      context: { source: "fit-check", plan: "Growth plan" },
      fields: { email: "institute@example.com" },
    });

    expect(payload.source).toBe("fit-check");
    expect(payload.plan).toBe("Growth plan");
    expect(payload._subject).toBe("Plan email request");
  });
});

describe("formatPlanSummary", () => {
  it("joins the title, lines and footer with clean spacing", () => {
    const summary = formatPlanSummary({
      title: "Growth plan",
      lines: ["Package: Growth", "One-time: ₹59,999", ""],
      footer: "Indicative scope. Final quote in writing.",
    });

    expect(summary).toBe(
      "Growth plan\n\nPackage: Growth\nOne-time: ₹59,999\n\nIndicative scope. Final quote in writing.",
    );
  });
});

describe("buildWhatsAppHref", () => {
  it("encodes the prefilled message for the studio number", () => {
    const href = buildWhatsAppHref({
      message: "Hi — plan: Growth\nBudget: ₹60k",
    });

    expect(href).toBe(
      "https://wa.me/919372809022?text=Hi%20%E2%80%94%20plan%3A%20Growth%0ABudget%3A%20%E2%82%B960k",
    );
  });
});

describe("buildMailtoHref", () => {
  it("encodes the subject and body", () => {
    const href = buildMailtoHref({
      to: "studio@example.com",
      subject: "Quote — Growth",
      body: "Line 1\nLine 2",
    });

    expect(href).toBe(
      "mailto:studio@example.com?subject=Quote%20%E2%80%94%20Growth&body=Line%201%0ALine%202",
    );
  });
});

describe("submitLead", () => {
  it("posts JSON to a configured endpoint", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: "true" }),
    } as Response));

    await submitLead(
      { intent: "quote", name: "Asha" },
      { endpoint: "https://example.com/form", fetchImpl },
    );

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://example.com/form");
    expect(init).toMatchObject({ method: "POST" });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      intent: "quote",
      name: "Asha",
    });
  });

  it("falls back to the studio inbox when no endpoint is configured", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: "true" }),
    } as Response));

    await submitLead(
      { intent: "booking", name: "Asha" },
      { endpoint: "", fetchImpl },
    );

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://formsubmit.co/ajax/imaginarsclubs@gmail.com");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      intent: "booking",
      name: "Asha",
      _captcha: "false",
    });
  });

  it("throws when the provider rejects the submission", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ({
      ok: false,
      status: 422,
      json: async () => ({}),
    } as Response));

    await expect(
      submitLead(
        { intent: "contact" },
        { endpoint: "https://example.com/form", fetchImpl },
      ),
    ).rejects.toThrow("Lead submission failed (422)");
  });
});
