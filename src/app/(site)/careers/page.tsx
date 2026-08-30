import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description: "No open roles right now — speculative applications welcome.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <main className="shell section-y max-w-2xl">
      <p className="micro">Careers</p>
      <h1 className="display mt-4">No open roles right now.</h1>
      <p className="lede mt-6">
        We hire slowly and deliberately when workload demands it. If you are a
        senior practitioner in web development, design or growth marketing and
        want to be considered for future openings, send a note about your work.
      </p>
      <div className="mt-10 rounded-md border p-6">
        <h2 className="text-h4 font-semibold">Speculative applications</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Email your portfolio link, the practice you work in, and one sentence
          about why Imaginars. We read every message and reply within a week.
        </p>
        <a href="mailto:imaginarsclubservices@gmail.com?subject=Careers" className="link-line mt-4 inline-block text-sm font-medium">
          imaginarsclubservices@gmail.com
        </a>
      </div>
    </main>
  );
}
