"use client";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  results: string[];
  category: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "delhi-public",
    title: "Delhi Public School",
    client: "Delhi Public School",
    location: "Delhi, India",
    beforeImage: "/media/institution/sequence-01-1600.webp",
    afterImage: "/media/institution/sequence-02-1600.webp",
    beforeAlt: "Before - Outdated website",
    afterAlt: "After - Modern digital system",
    category: "Education",
    results: [
      "300% increase in enquiries",
      "45% faster admissions processing",
      "98% parent satisfaction",
    ],
  },
  {
    id: "north-branch",
    title: "North Branch School",
    client: "North Branch School",
    location: "Mumbai, India",
    beforeImage: "/media/institution/sequence-03-1600.webp",
    afterImage: "/media/institution/sequence-04-1600.webp",
    beforeAlt: "Before - Manual processes",
    afterAlt: "After - Digital automation",
    category: "Education",
    results: [
      "200% faster record management",
      "60% reduction in paperwork",
      "100% data accuracy",
    ],
  },
  {
    id: "growth-hub",
    title: "GrowthHub Coaching",
    client: "GrowthHub Coaching",
    location: "Bangalore, India",
    beforeImage: "/media/institution/sequence-05-1600.webp",
    afterImage: "/media/institution/sequence-01-1600.webp",
    beforeAlt: "Before - Disorganized records",
    afterAlt: "After - Digital student portal",
    category: "Coaching",
    results: [
      "200% faster record management",
      "60% reduction in paperwork",
      "100% data accuracy",
    ],
  },
];

export default function BeforeAfterShowcase() {
  return (
    <section className="inst-section before-after-section" aria-labelledby="home-before-after">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label before-after-label-reveal">Before &amp; After</p>
            <h2 className="inst-h2 mt-5 max-w-[34ch] before-after-headline-reveal">
              Real Results.<br />
              <span className="inst-serif">Real Institutions.</span>
            </h2>
          </div>
        </div>

        <div className="before-after-grid">
          {CASE_STUDIES.map((caseStudy, index) => (
            <article key={caseStudy.id} className="before-after-card">
              <div className="before-after-copy">
                <h3 className="before-after-title">{caseStudy.title}</h3>
                <p className="before-after-body">{caseStudy.results[0]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
