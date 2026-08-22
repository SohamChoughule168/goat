export default function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#12101f_0%,var(--background)_55%)]" />
      <div
        className="aurora absolute -left-[15%] top-[8%] h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "radial-gradient(circle at 40% 40%, #6c63e8, transparent 65%)", animation: "drift-a 26s ease-in-out infinite" }}
      />
      <div
        className="aurora absolute right-[-12%] top-[38%] h-[30rem] w-[30rem] rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(circle at 60% 40%, #2f6fb8, transparent 65%)", animation: "drift-b 32s ease-in-out infinite" }}
      />
      <div
        className="aurora absolute bottom-[-18%] left-[28%] h-[36rem] w-[36rem] rounded-full opacity-[0.08] blur-[130px]"
        style={{ background: "radial-gradient(circle at 50% 50%, #c9a227, transparent 62%)", animation: "drift-c 38s ease-in-out infinite" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64 opacity-[0.35]"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, #6c63e8 8%), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(115% 100% at 50% 45%, transparent 62%, rgba(4,4,9,0.5) 100%)" }}
      />
    </div>
  );
}
