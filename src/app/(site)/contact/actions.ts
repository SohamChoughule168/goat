"use server";

import { headers } from "next/headers";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("That email address looks invalid").max(140),
  phone: z.string().trim().max(24).optional().default(""),
  company: z.string().trim().max(140).optional().default(""),
  service: z.string().trim().max(90).optional().default("Not sure yet"),
  message: z
    .string()
    .trim()
    .min(12, "Tell us a little more — at least a sentence")
    .max(2000),
  website: z.string().max(0).optional().default(""),
  startedAt: z.coerce.number().int().nonnegative(),
});

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

async function deliver(
  payload: {
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    message: string;
  }
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    `Company: ${payload.company || "—"}`,
    `Service: ${payload.service}`,
    "",
    payload.message,
  ].join("\n");

  if (!key) {
    console.info("[contact-lead]", JSON.stringify(payload));
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "website@imaginarsclubservices.com",
      to: [process.env.CONTACT_TO_EMAIL ?? "imaginarsclubservices@gmail.com"],
      reply_to: payload.email,
      subject: `New project enquiry — ${payload.name}`,
      text,
    }),
  });
}

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "Too many messages from this connection. Please try again later or call us.",
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  if (data.website !== "" || data.startedAt <= 0) {
    return { status: "error", message: "Something looked automated. Please try again." };
  }
  if (Date.now() - data.startedAt < 2500) {
    return {
      status: "error",
      message: "That was quick — take a moment to add detail, then send again.",
    };
  }

  try {
    await deliver(data);
    return {
      status: "success",
      message: "Message received. You'll hear back within one business day.",
    };
  } catch {
    return {
      status: "error",
      message: "Sending failed on our side. Please email us directly at imaginarsclubservices@gmail.com.",
    };
  }
}
