import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollSequence from "@/components/media/scroll-sequence";
import { institutionFrames } from "@/content/institution";

export default function InstitutionSequence() {
  return (
    <ScrollSequence
      sectionId="home-sequence"
      label="One day, four layers"
      title="From the first enquiry to the final record."
      lede="The same definitions move through every branch. Nothing is re-keyed between the desk, the record and the report."
      frames={institutionFrames}
      note="Illustrative sequence. No client records are shown."
      action={
        <Link href="/platform" className="inst-link">
          See how the platform is assembled
          <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
        </Link>
      }
    />
  );
}
