import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 46"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 2.2 13.8 V 2.2 H 17 A 14.8 11.6 0 0 1 31.8 13.8"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path
        d="M 2.2 19.5 V 30 A 14.8 12.8 0 0 0 31.8 30 V 25.7"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function LogoFull({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className={compact ? "h-7 w-auto" : "h-9 w-auto"} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-[length:var(--text-small)] font-medium tracking-[-0.015em]">
            ImaginarsClub
          </span>
          <span className="mt-1 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.28em] text-primary">
            Services
          </span>
        </span>
      )}
    </span>
  );
}

export function LogoLink() {
  return (
    <Link
      href="/"
      aria-label="ImaginarsClub Services — home"
      className="rounded-md transition-opacity hover:opacity-85"
    >
      <LogoFull />
    </Link>
  );
}

