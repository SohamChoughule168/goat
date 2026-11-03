import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CinematicHero from "@/components/home/cinematic-hero";
import ScrollWipe from "@/components/media/scroll-wipe";
import PremiumFeatures from "@/components/home/premium-features";
import BeforeAfterSlider from "@/components/media/before-after-slider";
import SectionNavigator from "@/components/layout/section-navigator";
import PremiumFooter from "@/components/layout/premium-footer";
import ScrollProgress from "@/components/layout/scroll-progress";
import InstitutionSequence from "@/components/home/institution-sequence";
import HiggsfieldStudio from "@/components/home/higgsfield-studio";
import MCPSkillsShowcase from "@/components/home/mcp-skills-showcase";
import FeaturedGrid from "@/components/home/featured-grid";
import FitCheck from "@/components/home/fit-check";
import InstitutionStack from "@/components/home/institution-stack";
import EvidenceRoom from "@/components/home/evidence-room";
import CapabilityLedger from "@/components/home/capability-ledger";
import CommandCenter from "@/components/home/command-center";
import InstitutionHero from "@/components/home/institution-hero";
import ServicesBento from "@/components/home/services-bento";
import TestimonialCards from "@/components/home/testimonial-cards";
import ImageGallery3D from "@/components/media/image-gallery-3d";
import Video3DParallax from "@/components/media/video-3d-parallax";
import ImageStack3D from "@/components/media/image-stack-3d";
import GlassCards from "@/components/home/glass-cards";
import ScrollSyncedImages from "@/components/media/scroll-synced-images";
import DepthParallaxHero from "@/components/media/depth-parallax-hero";
import ScrollRevealGrid from "@/components/media/scroll-reveal-grid";
import AppleShowcase from "@/components/home/apple-showcase";
import InfiniteMarquee from "@/components/media/infinite-marquee";
import SplitScroll from "@/components/media/split-scroll";
import TextScramble from "@/components/media/text-scramble";
import PinSection from "@/components/media/pin-section";
import GradientMesh from "@/components/media/gradient-mesh";
import ClientPortalDashboard from "@/components/home/client-portal-dashboard";
import BeforeAfterShowcase from "@/components/home/before-after-showcase";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { insights } from "@/content/insights";
import { methodPhases, trustCommitments } from "@/content/institutional";
import { OFFER, PACKAGES, formatINR } from "@/content/packages";

export const metadata: Metadata = createMetadata({
  title: "Websites and student systems for institutes",
  description:
    "ImaginarsClub designs and builds the public site, admissions path and student systems that coaching institutes, schools and edtech teams run on.",
  path: "/",
});

const economicsPackages = PACKAGES.map((tier) => ({
  slug: tier.slug,
  name: tier.name,
  price: formatINR(tier.price),
  original: formatINR(tier.original),
  compareAt: true,
  description: tier.bestFor,
  featured: Boolean(tier.featured),
}));

const institutional = {
  slug: "institutional",
  name: "Institutional",
  price: "From ₹3,00,000",
  original: "Scoped in writing",
  compareAt: false,
  description: "Multi-branch sites, portals, integrations and a governed rollout.",
  featured: false,
};

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <SectionNavigator />
      <GradientMesh />

      <CinematicHero />

      <HiggsfieldStudio />

      <div className="signal-bar">
        <div className="inst-shell signal-bar-inner">
          <p>Built for institutions where enquiries, admissions and parents all arrive at once.</p>
          <Link href="/platform" className="inst-link">
            Read the platform note
            <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
          </Link>
        </div>
      </div>

      <InstitutionSequence />

      <FitCheck />

      <section className="inst-section" aria-labelledby="home-thesis">
        <div className="inst-shell thesis-grid">
          <div>
            <p className="inst-label">The premise</p>
            <h2 id="home-thesis" className="inst-h2 mt-5">
              Most institute websites are brochures pretending to be systems.
            </h2>
          </div>
          <div className="thesis-support">
            <p>
              The site is not the problem by itself. The problem is everything behind it:
              enquiries in three inboxes, records in a spreadsheet, batch updates sent from a
              personal phone, and no shared definition of what a qualified admission is. We
              connect those parts in a fixed order, write the boundaries down, and hand the
              system over.
            </p>
            <Link href="/process" className="inst-link">
              How we work
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="inst-section-tight" aria-labelledby="home-stack">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">The stack</p>
              <h2 id="home-stack" className="inst-h2 mt-5">
                Eight layers. One accountable build.
              </h2>
            </div>
            <p className="inst-body max-w-[38ch] text-[0.9375rem]">
              Start where the leakage is. Add the rest in sequence, without stitching
              together five vendors who have never spoken.
            </p>
          </div>
          <InstitutionStack />
        </div>
      </section>

      <EvidenceRoom />

      <section className="inst-section" aria-labelledby="home-capabilities">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">Capability ledger</p>
              <h2 id="home-capabilities" className="inst-h2 mt-5">
                Eighteen capabilities, mapped to outcomes.
              </h2>
            </div>
            <Link href="/pricing" className="inst-link">
              See how engagements are priced
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>
          <div className="mt-10">
            <CapabilityLedger />
          </div>
        </div>
      </section>

      <section className="inst-dark" aria-labelledby="home-command">
        <div className="inst-section">
          <div className="inst-shell">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
              <div>
                <p className="inst-label">The operating view</p>
                <h2 id="home-command" className="inst-h2 mt-5 max-w-[20ch]">
                  See the whole institution, not a dashboard of fragments.
                </h2>
              </div>
              <p className="inst-body text-[0.9375rem]">
                Enquiries, admissions and records share one set of definitions. Branch, source
                and owner stay attached from first contact to handover.
              </p>
            </div>
            <CommandCenter />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="command-note">
                The interface above is illustrative. No client dashboard is reproduced.
              </p>
              <Link href="/platform" className="inst-link">
                How the platform is assembled
                <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PremiumFeatures />

      <ScrollWipe />

      <BeforeAfterSlider />

      <ServicesBento />

      <TestimonialCards />

      <ImageGallery3D />

      <Video3DParallax
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        poster="/media/institution/sequence-03-1600.webp"
        alt="Material study in motion"
        label="Motion by design"
        title="Video that moves with you."
        lede="Scroll through this section and the video tilts, rotates and scales in 3D space — synced to your scroll position. No autoplay, no loop, just scroll-driven parallax."
      />

      <ImageStack3D />

      <GlassCards />

      <ScrollSyncedImages />

      <GradientMesh />

      <DepthParallaxHero />

      <ScrollRevealGrid />

      <AppleShowcase />

      <InfiniteMarquee />

      <SplitScroll />

      <PinSection />

      <MCPSkillsShowcase />

      <FeaturedGrid />

      <ClientPortalDashboard />

      <BeforeAfterShowcase />

      <section className="inst-section" aria-labelledby="home-method">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">The method</p>
              <h2 id="home-method" className="inst-h2 mt-5 max-w-[18ch]">
                Four gates. No silent scope.
              </h2>
            </div>
            <p className="inst-body max-w-[34ch] text-[0.9375rem]">
              Each phase ends with something you can read, question and approve before the
              next begins.
            </p>
          </div>

          <div className="method-grid">
            {methodPhases.map((phase) => (
              <article key={phase.index} className="method-phase">
                <p className="inst-num text-[0.6875rem] text-[var(--ink-4)]">{phase.index}</p>
                <h3>{phase.title}</h3>
                <p>{phase.detail}</p>
                <dl className="method-meta">
                  <div>
                    <dt>Output</dt>
                    <dd>{phase.output}</dd>
                  </div>
                  <div>
                    <dt>Gate</dt>
                    <dd>{phase.gate}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section-tight" aria-labelledby="home-economics">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">Economics</p>
              <h2 id="home-economics" className="inst-h2 mt-5">
                Fixed scope. Fixed price.
              </h2>
            </div>
            <div className="max-w-[34ch]">
              <p className="inst-tag">{OFFER.label}</p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">
                {OFFER.line}. Save up to {formatINR(OFFER.saveUpTo)} against standard pricing.
              </p>
            </div>
          </div>

          <div className="economics-grid">
            {[...economicsPackages, institutional].map((tier) => (
              <article
                key={tier.name}
                className="economics-card"
                data-featured={tier.featured}
              >
                <p className="inst-num text-[0.6875rem] text-[var(--ink-4)]">
                  {tier.featured ? "Recommended" : "Package"}
                </p>
                <h3 className="inst-h3 mt-5">{tier.name}</h3>
                <p className="economics-price">{tier.price}</p>
                <p
                  className={`font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[var(--ink-4)] ${tier.compareAt ? "line-through" : ""}`}
                >
                  {tier.original}
                </p>
                <p>{tier.description}</p>
                <Link href={`/pricing#${tier.slug}`} className="inst-link">
                  {tier.slug === "institutional" ? "Scope an engagement" : "See what is included"}
                  <ArrowUpRight size={13} strokeWidth={1.5} className="inst-link-arrow" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.8125rem] text-[var(--ink-3)]">
              Every engagement is quoted in writing after a scoping conversation.
            </p>
            <Link href="/estimate" className="inst-link">
              Open Scope Architect
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="inst-section" aria-labelledby="home-trust">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">The commitments</p>
              <h2 id="home-trust" className="inst-h2 mt-5 max-w-[18ch]">
                The system should outlast the engagement.
              </h2>
            </div>
            <Link href="/trust" className="inst-link">
              Read the trust terms
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>

          <div className="trust-grid">
            {trustCommitments.map((item) => (
              <article key={item.index} className="trust-item">
                <p className="inst-num text-[0.625rem] text-[var(--ink-4)]">{item.index}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inst-section-tight" aria-labelledby="home-notes">
        <div className="inst-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inst-label">Field notes</p>
              <h2 id="home-notes" className="inst-h2 mt-5">
                Working notes, not thought leadership.
              </h2>
            </div>
            <Link href="/insights" className="inst-link">
              All field notes
              <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
            </Link>
          </div>

          <div className="notes-grid">
            {insights.slice(0, 3).map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="note-card"
              >
                <p className="inst-num text-[0.625rem] text-[var(--ink-4)]">
                  {insight.category}
                </p>
                <h3>{insight.title}</h3>
                <p>{insight.excerpt}</p>
                <div className="note-card-footer">
                  <time dateTime={insight.date}>
                    {new Date(insight.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <span>{insight.readingTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="home-cta">
        <div className="inst-shell final-cta-inner">
          <div>
            <p className="inst-label">Next step</p>
            <h2 id="home-cta" className="inst-h2 mt-5 max-w-[20ch]">
              Bring the whole institution into <span className="inst-serif">one system.</span>
            </h2>
            <p className="inst-body mt-5 text-[0.9375rem]">
              A working session starts with the enquiry path, the admissions process and the reports you do not trust. No pitch deck required.
            </p>
          </div>
          <div className="final-cta-actions">
            <Link href="/book" className="inst-btn">
              Book a working session
            </Link>
            <Link href="/estimate" className="inst-btn inst-btn-ghost">
              Scope Architect
            </Link>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">
              {site.hours.responseNote} Direct line:{" "}
              <a href={`tel:${site.phoneHref}`} className="underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </>
  );
}
