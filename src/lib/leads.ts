export type LeadIntent = "contact" | "quote" | "booking" | "plan-email";

export interface LeadContext {
  source?: string;
  page?: string;
  package?: string;
  plan?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface LeadContextInput {
  pathname?: string;
  search?: string;
  source?: string;
  packageSlug?: string;
  plan?: string;
  referrer?: string;
}

export interface BuildLeadPayloadInput {
  intent: LeadIntent;
  context?: LeadContext;
  fields?: Record<string, unknown>;
  now?: Date;
}

export type LeadPayload = Record<string, string>;

export interface SubmitLeadOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

const LEAD_EMAIL = "imaginarsclubs@gmail.com";
const WHATSAPP_NUMBER = "919372809022";

const SUBJECTS: Record<LeadIntent, string> = {
  contact: "New project enquiry",
  quote: "Quote request",
  booking: "Discovery call request",
  "plan-email": "Plan email request",
};

const UTM_KEYS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
} as const;

export function getLeadContext(input: LeadContextInput = {}): LeadContext {
  const params = new URLSearchParams(input.search ?? "");
  const context: LeadContext = {};

  if (input.pathname) context.page = input.pathname;
  if (input.source) context.source = input.source;

  const packageSlug = input.packageSlug ?? params.get("package");
  if (packageSlug) context.package = packageSlug;

  const plan = input.plan ?? params.get("plan");
  if (plan) context.plan = plan;

  if (input.referrer) context.referrer = input.referrer;

  for (const param of Object.keys(UTM_KEYS) as Array<keyof typeof UTM_KEYS>) {
    const value = params.get(param);
    if (value) context[UTM_KEYS[param]] = value;
  }

  return context;
}

export function buildLeadPayload({
  intent,
  context = {},
  fields = {},
  now = new Date(),
}: BuildLeadPayloadInput): LeadPayload {
  const payload: LeadPayload = {
    intent,
    source: context.source ?? "website",
    submittedAt: now.toISOString(),
    _subject: SUBJECTS[intent],
  };

  for (const [key, value] of Object.entries({ ...context, ...fields })) {
    if (value === null || value === undefined) continue;

    const normalized = Array.isArray(value)
      ? value.filter(Boolean).join(", ")
      : typeof value === "string"
        ? value.trim()
        : String(value);

    if (normalized) payload[key] = normalized;
  }

  return payload;
}

export function formatPlanSummary({
  title,
  lines,
  footer,
}: {
  title: string;
  lines?: Array<string | undefined>;
  footer?: string;
}): string {
  const lineBlock = (lines ?? []).filter((line): line is string => Boolean(line?.trim())).join("\n");

  return [title, lineBlock, footer]
    .filter((part): part is string => Boolean(part?.trim()))
    .join("\n\n");
}

export function buildWhatsAppHref({
  message,
  phone = WHATSAPP_NUMBER,
}: {
  message: string;
  phone?: string;
}): string {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoHref({
  to = LEAD_EMAIL,
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body: string;
}): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function submitLead(
  payload: LeadPayload,
  {
    endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT,
    fetchImpl = fetch,
  }: SubmitLeadOptions = {},
): Promise<void> {
  const useFormspree = Boolean(endpoint);
  const url = useFormspree ? endpoint! : `https://formsubmit.co/ajax/${LEAD_EMAIL}`;
  const body = useFormspree
    ? payload
    : { ...payload, _captcha: "false", _template: "table" };

  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed (${response.status})`);
  }
}
