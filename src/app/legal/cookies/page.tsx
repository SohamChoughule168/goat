import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "This site uses no tracking cookies. Here is what that means.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <main className="shell section-y max-w-3xl">
      <p className="micro">Legal</p>
      <h1 className="display mt-4">Cookie Policy</h1>
      <p className="lede mt-5 text-sm">Last updated: August 2026</p>
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-h4 font-semibold">This site sets no tracking cookies</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            ImaginarsClub Services does not set advertising, analytics or
            third-party tracking cookies on this website. No consent banner is
            needed because there is nothing to consent to.
          </p>
        </section>
        <section>
          <h2 className="text-h4 font-semibold">What we do store</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your theme preference (light or dark) is saved in localStorage under
            the key <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">imaginars-theme</code>.
            This is a functional preference, not a tracking cookie, and it never leaves your browser.
          </p>
        </section>
        <section>
          <h2 className="text-h4 font-semibold">Third-party services</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our hosting provider (Vercel) may set technically necessary cookies for security and load balancing.
            These are not used for tracking and expire automatically.
          </p>
        </section>
      </div>
    </main>
  );
}
