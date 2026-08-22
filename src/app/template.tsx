export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden="true" className="wipe-veil" />
      <div className="page-enter">{children}</div>
    </>
  );
}
