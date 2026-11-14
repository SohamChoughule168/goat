"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Radio } from "lucide-react";

const CODE_PAYLOAD = `{
  "event": "admission.enrolment_confirmed",
  "institute_id": "imaginars-mumbai-01",
  "timestamp": "2026-11-15T00:26:00Z",
  "student": {
    "id": "STU-2026-9042",
    "name": "Aarav Deshmukh",
    "course": "NEET Two-Year Intensive",
    "branch": "Mumbai Main Campus"
  },
  "admission": {
    "stage": "enrolled",
    "counselor": "Dr. Prerna Patil",
    "verified_by": "Automated Seam Engine"
  },
  "settlement": {
    "amount_inr": 185000,
    "receipt_ref": "IC-2026-REC-0428",
    "status": "cleared"
  }
}`;

const CHANNELS = [
  { label: "Direct Search & Web", pct: 38, count: "474 leads", color: "#1f3ad8" },
  { label: "WhatsApp Business API", pct: 27, count: "337 leads", color: "#2563eb" },
  { label: "Meta Campaign Intake", pct: 19, count: "237 leads", color: "#3b82f6" },
  { label: "Walk-in Desk Tokens", pct: 10, count: "124 leads", color: "#60a5fa" },
  { label: "Alumni & Parent Referral", pct: 6, count: "76 leads", color: "#93c5fd" },
];

export default function NectarlineTerminal() {
  const [typedLength, setTypedLength] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Typewriter effect (20ms per character)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let timeoutId: NodeJS.Timeout;
    if (typedLength < CODE_PAYLOAD.length) {
      const nextChar = CODE_PAYLOAD[typedLength];
      const delay = nextChar === "\n" ? 100 : 18;
      timeoutId = setTimeout(() => {
        setTypedLength((l) => l + 1);
      }, delay);
    } else {
      // Loop after 4.5 seconds
      timeoutId = setTimeout(() => {
        setTypedLength(0);
      }, 4500);
    }

    return () => clearTimeout(timeoutId);
  }, [inView, typedLength]);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_PAYLOAD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      ref={containerRef}
      className="mt-8 grid gap-6 rounded-2xl border border-[var(--rule)] bg-[#f7f4ed] p-6 shadow-[0_12px_40px_rgba(17,18,15,0.06)] lg:grid-cols-[1.2fr_0.8fr] lg:p-8"
    >
      {/* Left: Typing Webhook Console */}
      <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-black/10 bg-[#11120f] p-5 font-mono shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-[#d8d0bf]">admission_webhook.json</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-[var(--cobalt)]/25 px-2 py-0.5 text-[0.625rem] text-[#93c5fd]">
              <Radio className="h-2.5 w-2.5 animate-pulse text-[#60a5fa]" />
              SEAM: OPEN_EDU 2.6
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy payload"
              className="rounded p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#60a5fa]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="my-4 h-64 overflow-y-auto whitespace-pre font-mono text-[0.75rem] leading-relaxed text-[#ede8dc]">
          <code>
            {CODE_PAYLOAD.slice(0, typedLength)}
            <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[#60a5fa]" />
          </code>
        </pre>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[0.6875rem] text-white/50">
          <span>Latency: 14ms to central ledger</span>
          <span className="text-[#93c5fd]">✓ Auth signature verified</span>
        </div>
      </div>

      {/* Right: Intake Channel Distribution Mix */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--cobalt)] font-medium">
              [Channel Distribution Mix]
            </span>
            <span className="font-mono text-xs text-[var(--ink-4)]">1,248 Verified</span>
          </div>
          <h4 className="mt-2 text-xl font-medium text-[var(--ink)]">
            Lead source attribution
          </h4>
          <p className="mt-1 text-xs text-[var(--ink-3)]">
            Every candidate enquiry remains linked to its original promotional spend across all branches.
          </p>

          {/* Progress Bars */}
          <div className="mt-6 space-y-4">
            {CHANNELS.map((ch) => (
              <div key={ch.label}>
                <div className="flex justify-between font-mono text-xs text-[var(--ink)]">
                  <span>{ch.label}</span>
                  <span className="text-[var(--ink-3)]">{ch.pct}% ({ch.count})</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bone-2)]">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: inView ? `${ch.pct}%` : "0%",
                      backgroundColor: ch.color,
                      boxShadow: `0 0 8px ${ch.color}44`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[#ede7d8]/70 p-3 text-center font-mono text-[0.6875rem] text-[var(--cobalt)] font-medium">
          ⚡ Real-time admissions pipe synced with Razorpay & WhatsApp
        </div>
      </div>
    </div>
  );
}
