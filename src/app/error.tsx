"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <section className="section-y">
      <div className="shell py-16">
        <p className="eyebrow mb-6">Something broke on our side</p>
        <h1 className="display-2 max-w-2xl">
          An unexpected error occurred.
        </h1>
        <p className="lede mt-5">
          The issue has been logged. Try again — or reach us directly at{" "}
          <a href="mailto:imaginarsclubservices@gmail.com" className="link-line text-foreground">
            imaginarsclubservices@gmail.com
          </a>{" "}
          if it persists.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
