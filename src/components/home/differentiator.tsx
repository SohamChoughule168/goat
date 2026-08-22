import Link from "next/link";
import { ShieldCheck, UserCheck, Zap, KeyRound } from "lucide-react";

const POINTS = [
  {
    icon: UserCheck,
    title: "You talk to the people doing the work",
    detail:
      "No account-manager telephone game. The person who scopes your project is the person who builds it.",
  },
  {
    icon: Zap,
    title: "AI-native speed, human judgement",
    detail:
      "AI accelerates our scaffolding, review and content ops. Every output passes senior review before it reaches you.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable claims only",
    detail:
      "Our case studies link to live sites and public delivery records. Ask any agency with '200+ projects' for the same.",
  },
  {
    icon: KeyRound,
    title: "You own everything",
    detail:
      "Repositories, analytics, ad accounts, pipelines — configured in your name from day one. Leaving us is effortless; that's why clients stay.",
  },
];

export default function Differentiator() {
  return (
    <section className="section-y theme-paper bg-background text-foreground border-y border-border">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p data-reveal="fade" className="eyebrow mb-4">
            Why us
          </p>
          <h2 data-reveal="up" className="display-2">
            A small senior team
            <span className="font-serif font-normal italic text-primary"> beats </span>
            a big junior bench.
          </h2>
          <Link
            data-reveal="up"
            href="/about"
            className="link-line mt-6 inline-block text-sm text-foreground"
          >
            More about the studio →
          </Link>
        </div>
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {POINTS.map((p, i) => (
            <li key={p.title} data-reveal="up" data-reveal-delay={String(i * 60)}>
              <p.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
