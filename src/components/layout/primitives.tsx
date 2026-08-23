import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:px-16 ${className}`}>
      {children}
    </div>
  );
}

export function Grid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[680px] [&>*+*]:mt-4 ${className}`}>{children}</div>
  );
}

export function FullBleed({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1440px] mx-auto w-full ${className}`} data-fullbleed>
      {children}
    </div>
  );
}
