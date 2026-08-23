import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: "Trust & Security",
  description: "Confidentiality posture, data handling, IP ownership and engagement terms.",
  path: "/trust",
});

const SECTIONS = [
  {
    h: "Confidentiality",
    p: "Client material shared with us stays confidential during and after the engagement. We never reference client-confidential projects publicly without written permission, and we treat those obligations as absolute.",
  },
  {
    h: "Data handling",
    p: "Enquiry data is used solely to respond to you. Analytics on this site are privacy-first with no cross-site tracking cookies. We do not sell, rent or trade your information.",
  },
  {
    h: "Where client material lives",
    p: "Project repositories, design files and communication are stored in access-controlled environments (GitHub, Google Workspace, Vercel). Access is limited to the people actively working on your project.",
  },
  {
    h: "Subcontractors",
    p: "We work with a vetted network of specialists assembled per project. Every subcontractor signs the same confidentiality terms we hold ourselves to, and we remain your single point of accountability.",
  },
  {
    h: "IP ownership",
    p: "Upon full payment, deliverables become yours: code, designs, accounts and pipelines configured in your name from day one. We retain the right to reference publicly released work unless confidentiality applies.",
  },
  {
    h: "Engagement terms",
    p: "Every project runs on a written scope with milestones and payment terms agreed before work begins. Work outside that scope is quoted separately before it starts.",
  },
];

export default function TrustPage() {
  return (
    <main className="shell section-y max-w-3xl">
      <p className="micro">Trust</p>
      <h1 className="display mt-4">What larger buyers check.</h1>
      <p className="lede mt-6">
        This page exists because financial services clients ask these questions
        before signing — and because publishing our answers holds us accountable.
      </p>
      <div className="mt-14 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-h3 font-semibold">{s.h}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <div>
          <h2 className="text-h3 font-semibold">Contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Questions about security or confidentiality:{" "}
            <a href={`mailto:${site.email}`} className="link-line">{site.email}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
