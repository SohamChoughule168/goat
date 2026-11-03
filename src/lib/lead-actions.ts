import {
  buildLeadPayload,
  formatPlanSummary,
  type LeadContext,
  type LeadPayload,
} from "@/lib/leads";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFieldErrors = Record<string, string>;

export function validateLeadEmail(email: string): string | undefined {
  const trimmed = email.trim();

  if (!trimmed) return "Add your email.";
  if (!EMAIL_PATTERN.test(trimmed)) return "Use a valid email address.";

  return undefined;
}

export function validateLeadContact(
  {
    name,
    email,
    message,
  }: {
    name?: string;
    email?: string;
    message?: string;
  },
  { messageMin }: { messageMin?: number } = {},
): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (!name?.trim()) errors.name = "Add your name.";

  const emailError = validateLeadEmail(email ?? "");
  if (emailError) errors.email = emailError;

  if (messageMin && (message?.trim().length ?? 0) < messageMin) {
    errors.message = `Add a few more details (at least ${messageMin} characters).`;
  }

  return errors;
}

export function buildPlanEmailLead({
  email,
  title,
  lines,
  footer,
  context,
  now,
}: {
  email: string;
  title: string;
  lines: string[];
  footer?: string;
  context?: LeadContext;
  now?: Date;
}): LeadPayload {
  return buildLeadPayload({
    intent: "plan-email",
    context,
    fields: {
      email: email.trim(),
      plan: formatPlanSummary({ title, lines, footer }),
    },
    now,
  });
}

export function buildQuoteLead({
  name,
  email,
  phone,
  organisation,
  packageName,
  services,
  budget,
  timeline,
  brief,
  context,
  now,
}: {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  packageName?: string;
  services?: string[];
  budget?: string;
  timeline?: string;
  brief?: string;
  context?: LeadContext;
  now?: Date;
}): LeadPayload {
  return buildLeadPayload({
    intent: "quote",
    context,
    fields: {
      name,
      email,
      phone,
      organisation,
      package: packageName,
      services,
      budget,
      timeline,
      brief,
    },
    now,
  });
}

export function buildBookingLead({
  name,
  email,
  phone,
  organisation,
  topic,
  preferredWindow,
  notes,
  context,
  now,
}: {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  topic?: string;
  preferredWindow?: string;
  notes?: string;
  context?: LeadContext;
  now?: Date;
}): LeadPayload {
  return buildLeadPayload({
    intent: "booking",
    context,
    fields: {
      name,
      email,
      phone,
      organisation,
      topic,
      preferredWindow,
      notes,
    },
    now,
  });
}

export function buildLeadWhatsAppMessage({
  pathname,
  packageName,
  plan,
}: {
  pathname?: string;
  packageName?: string;
  plan?: string;
}): string {
  const details = [
    packageName ? `I'm looking at the ${packageName} package.` : "",
    plan ? `I have a plan: ${plan}.` : "",
    pathname ? `Sent from ${pathname}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `Hi ImaginarsClub Services — I'd like to discuss a project.${details ? ` ${details}` : ""}`;
}
