import { describe, expect, it } from "vitest";
import {
  buildBookingLead,
  buildLeadWhatsAppMessage,
  buildPlanEmailLead,
  buildQuoteLead,
  validateLeadContact,
  validateLeadEmail,
} from "@/lib/lead-actions";

describe("validateLeadEmail", () => {
  it("requires an email address", () => {
    expect(validateLeadEmail("  ")).toBe("Add your email.");
  });

  it("rejects malformed addresses", () => {
    expect(validateLeadEmail("not-an-email")).toBe(
      "Use a valid email address.",
    );
  });

  it("accepts a normal institute address", () => {
    expect(validateLeadEmail("admissions@example.edu")).toBeUndefined();
  });
});

describe("validateLeadContact", () => {
  it("reports missing contact fields", () => {
    expect(validateLeadContact({})).toEqual({
      name: "Add your name.",
      email: "Add your email.",
    });
  });

  it("enforces a minimum brief when one is required", () => {
    expect(
      validateLeadContact(
        { name: "Asha Rao", email: "asha@example.edu", message: "Need help" },
        { messageMin: 20 },
      ),
    ).toEqual({
      message: "Add a few more details (at least 20 characters).",
    });
  });

  it("passes a complete enquiry", () => {
    expect(
      validateLeadContact(
        {
          name: "Asha Rao",
          email: "asha@example.edu",
          message: "We need a single admissions site across three branches.",
        },
        { messageMin: 20 },
      ),
    ).toEqual({});
  });
});

describe("buildPlanEmailLead", () => {
  it("sends the plan summary with the captured email", () => {
    const payload = buildPlanEmailLead({
      email: "  admissions@example.edu ",
      title: "Growth plan",
      lines: ["Package: Growth", "One-time: ₹59,999"],
      footer: "Indicative scope. Final quote in writing.",
      context: { source: "fit-check", page: "/#fit-check" },
      now: new Date("2026-10-25T10:00:00.000Z"),
    });

    expect(payload).toMatchObject({
      intent: "plan-email",
      source: "fit-check",
      email: "admissions@example.edu",
      plan: "Growth plan\n\nPackage: Growth\nOne-time: ₹59,999\n\nIndicative scope. Final quote in writing.",
      submittedAt: "2026-10-25T10:00:00.000Z",
      _subject: "Plan email request",
    });
  });
});

describe("buildQuoteLead", () => {
  it("captures the selected package, services and brief", () => {
    const payload = buildQuoteLead({
      name: " Asha Rao ",
      email: "asha@example.edu",
      phone: "9876543210",
      organisation: "Northstar Academy",
      packageName: "Growth package",
      services: ["Website", "Admissions"],
      budget: "₹50,000–₹75,000",
      timeline: "2–3 months",
      brief: "Three branches, one admissions enquiry flow.",
      context: { page: "/quote", utmSource: "newsletter" },
      now: new Date("2026-10-25T10:00:00.000Z"),
    });

    expect(payload).toMatchObject({
      intent: "quote",
      page: "/quote",
      utmSource: "newsletter",
      name: "Asha Rao",
      email: "asha@example.edu",
      phone: "9876543210",
      organisation: "Northstar Academy",
      package: "Growth package",
      services: "Website, Admissions",
      budget: "₹50,000–₹75,000",
      timeline: "2–3 months",
      brief: "Three branches, one admissions enquiry flow.",
      _subject: "Quote request",
    });
  });
});

describe("buildBookingLead", () => {
  it("captures the preferred call window and topic", () => {
    const payload = buildBookingLead({
      name: "Asha Rao",
      email: "asha@example.edu",
      phone: "9876543210",
      organisation: "Northstar Academy",
      topic: "Admissions system",
      preferredWindow: "Tuesday afternoon",
      notes: "Two decision makers will join.",
      context: { source: "booking-page" },
      now: new Date("2026-10-25T10:00:00.000Z"),
    });

    expect(payload).toMatchObject({
      intent: "booking",
      source: "booking-page",
      name: "Asha Rao",
      email: "asha@example.edu",
      topic: "Admissions system",
      preferredWindow: "Tuesday afternoon",
      notes: "Two decision makers will join.",
      _subject: "Discovery call request",
    });
  });
});

describe("buildLeadWhatsAppMessage", () => {
  it("adds the package and page context to the studio message", () => {
    expect(
      buildLeadWhatsAppMessage({
        pathname: "/pricing",
        packageName: "Growth",
      }),
    ).toBe(
      "Hi ImaginarsClub Services — I'd like to discuss a project. I'm looking at the Growth package. Sent from /pricing.",
    );
  });

  it("handles a plan without a package", () => {
    expect(
      buildLeadWhatsAppMessage({
        pathname: "/blueprint",
        plan: "Institution blueprint",
      }),
    ).toBe(
      "Hi ImaginarsClub Services — I'd like to discuss a project. I have a plan: Institution blueprint. Sent from /blueprint.",
    );
  });
});
