import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Design kit",
  robots: { index: false, follow: false },
};

export default function DesignKitPage() {
  return (
    <main className="shell section-y space-y-10">
      <header className="space-y-3">
        <p className="micro">Internal · Token verification</p>
        <h1 className="display-2">Token layer preview</h1>
        <p className="lede">
          One button, one input, one card — rendered against the installed token
          layer. Not indexed; not linked from navigation.
        </p>
      </header>

      <hr className="rule" />

      <div className="grid max-w-md gap-8">
        <div className="space-y-2">
          <Label htmlFor="dk-email">Email</Label>
          <Input id="dk-email" type="email" placeholder="you@company.com" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">Start a project</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">See services</Link>
          </Button>
        </div>
      </div>

      <div className="surface--lit card-interactive max-w-md p-6">
        <p className="micro">Practice 01 · Build</p>
        <h2 className="mt-3 font-medium text-[color:var(--text-1)]">
          Web Development
        </h2>
        <p className="mt-2 max-w-[46ch] text-sm leading-relaxed">
          Fast, findable websites that carry your brand and convert visitors.
        </p>
        <Link
          href="/services/web-development"
          className="link-line mt-4 inline-block text-sm text-[color:var(--text-1)]"
        >
          Explore practice
        </Link>
      </div>

      <div className="surface--raised max-w-md p-6">
        <p className="micro">Raised surface</p>
      </div>
    </main>
  );
}
