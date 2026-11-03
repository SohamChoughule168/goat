export type InstitutionTone = "ink" | "bone" | "bone-2" | "cobalt";

export interface InstitutionLayer {
  id: "brand" | "website" | "admissions" | "intelligence";
  index: string;
  title: string;
  meta: string;
  tone: InstitutionTone;
}

export interface InstitutionFrame {
  src: string;
  srcSet: string;
  alt: string;
  stage: string;
  caption: string;
  width: number;
  height: number;
}

/**
 * The four operating layers the preview shows. The gap between 03 and 08 is
 * deliberate: the institution runs eight layers, of which four are visible.
 */
export const institutionLayers: InstitutionLayer[] = [
  {
    id: "brand",
    index: "01",
    title: "Brand",
    meta: "Identity and governance",
    tone: "ink",
  },
  {
    id: "website",
    index: "02",
    title: "Website",
    meta: "Public front door",
    tone: "bone",
  },
  {
    id: "admissions",
    index: "03",
    title: "Admissions",
    meta: "Enquiry to enrolment",
    tone: "bone-2",
  },
  {
    id: "intelligence",
    index: "08",
    title: "Intelligence",
    meta: "One reporting layer",
    tone: "cobalt",
  },
];

export const institutionHero = {
  src: "/media/institution/hero-desk-1200.webp",
  srcSet:
    "/media/institution/hero-desk-720.webp 720w, /media/institution/hero-desk-1200.webp 1200w",
  alt: "Layered bone-white sheets of paper in cool morning light.",
  width: 1200,
  height: 1500,
};

/** Five photographic stages, one day in the life of a single record. */
export const institutionFrames: InstitutionFrame[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    srcSet:
      "/media/institution/sequence-01-800.webp 800w, /media/institution/sequence-01-1600.webp 1600w",
    alt: "A dim admissions room at dawn, lit by a frosted window.",
    stage: "The room before hours",
    caption:
      "Enquiry. A parent asks. Source, branch and owner attach to the record.",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    srcSet:
      "/media/institution/sequence-02-800.webp 800w, /media/institution/sequence-02-1600.webp 1600w",
    alt: "Overlapping blank sheets of paper in cool morning light.",
    stage: "Records, layered",
    caption:
      "Qualification. Every counsellor applies the same definition of qualified.",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    srcSet:
      "/media/institution/sequence-03-800.webp 800w, /media/institution/sequence-03-1600.webp 1600w",
    alt: "A plume of cobalt ink dispersing in water.",
    stage: "Ink, suspended",
    caption:
      "Admission. The offer, the seat and the batch update in one move.",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    srcSet:
      "/media/institution/sequence-04-800.webp 800w, /media/institution/sequence-04-1600.webp 1600w",
    alt: "Overlapping blank paper sheets in warm afternoon light.",
    stage: "Records, late light",
    caption:
      "Record. Attendance, documents and communication stay on one file.",
    width: 1600,
    height: 900,
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    srcSet:
      "/media/institution/sequence-05-800.webp 800w, /media/institution/sequence-05-1600.webp 1600w",
    alt: "A quiet room at dusk, warm light through a frosted pane.",
    stage: "The room at close of day",
    caption: "Handover. Accounts, code and the runbook leave with you.",
    width: 1600,
    height: 900,
  },
];
