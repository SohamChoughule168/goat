import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="2.5"
        transform="rotate(45 16 16)"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M10.6 19.8 16 10l5.4 9.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="23" r="1.4" className="fill-primary" />
    </svg>
  );
}

export function LogoFull() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="h-9 w-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-[0.14em] uppercase">
          ImaginarsClub
        </span>
        <span className="mt-1 font-mono text-[9px] font-medium tracking-[0.42em] text-muted-foreground">
          Services
        </span>
      </span>
    </span>
  );
}

export function LogoLink() {
  return (
    <Link href="/" className="rounded-md transition-opacity hover:opacity-85">
      <LogoFull />
    </Link>
  );
}
