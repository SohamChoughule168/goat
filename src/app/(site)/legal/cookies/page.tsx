import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "This site uses no tracking cookies. Here is what that means.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <div className="shell section-y max-w-3xl">
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
            This site does not save a theme preference or similar settings in your
            browser. The interface uses a single visual system for every visitor.
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
    </div>
  );
}
