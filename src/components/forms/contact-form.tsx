"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContact,
  type ContactState,
} from "@/app/(site)/contact/actions";

const initialState: ContactState = { status: "idle" };

const inputCls = "h-11 rounded-lg bg-background/60 px-4 text-base";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="h-12 px-8 text-base" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        <>
          Send message
          <ArrowUpRight aria-hidden="true" />
        </>
      )}
    </Button>
  );
}

export default function ContactForm({ serviceOptions }: { serviceOptions: string[] }) {
  const [state, formAction] = useActionState(submitContact, initialState);
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="space-y-6" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full name <span aria-hidden="true" className="text-primary">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={`${inputCls} ${errorFor("name") ? "border-destructive" : ""}`}
            aria-invalid={!!errorFor("name")}
            aria-describedby={errorFor("name") ? "name-error" : undefined}
          />
          {errorFor("name") && (
            <p id="name-error" role="alert" className="text-xs text-destructive">
              {errorFor("name")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span aria-hidden="true" className="text-primary">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={`${inputCls} ${errorFor("email") ? "border-destructive" : ""}`}
            aria-invalid={!!errorFor("email")}
            aria-describedby={errorFor("email") ? "email-error" : undefined}
          />
          {errorFor("email") && (
            <p id="email-error" role="alert" className="text-xs text-destructive">
              {errorFor("email")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 …"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Company or project name"
            className={inputCls}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">What do you need?</Label>
        <select
          id="service"
          name="service"
          defaultValue=""
          className={`h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
            !serviceOptions.length ? "opacity-60" : ""
          }`}
        >
          <option value="">Not sure yet — help me decide</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Project details <span aria-hidden="true" className="text-primary">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What are you building, fixing or growing? Any deadline?"
          className={`min-h-32 resize-y rounded-lg bg-background/60 p-4 text-base ${
            errorFor("message") ? "border-destructive" : ""
          }`}
          aria-invalid={!!errorFor("message")}
          aria-describedby={errorFor("message") ? "message-error" : undefined}
        />
        {errorFor("message") && (
          <p id="message-error" role="alert" className="text-xs text-destructive">
            {errorFor("message")}
          </p>
        )}
      </div>

      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton />
        <p className="text-xs leading-relaxed text-muted-foreground">
          We reply within one business day.
          <br />
          Your details are never shared or sold.
        </p>
      </div>

      {state.status === "success" && (
        <p
          role="status"
          className="rounded-lg border border-primary/40 bg-primary/10 px-5 py-4 text-sm font-medium"
        >
          {state.message}
        </p>
      )}
      {state.status === "error" && !state.fieldErrors && state.message && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}
