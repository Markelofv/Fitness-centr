export default function Logo({ onHome }) {
  const content = (
    <>
      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#ff4f9a] to-[#7c3aed] shadow-[0_0_28px_rgba(255,79,154,.35)]">
        <span className="size-3.5 rounded-full border-[3px] border-white" />
      </span>
      <span className="heading text-xl font-bold tracking-[-0.04em] text-white">FitManager</span>
    </>
  );

  return onHome ? (
    <button className="flex items-center gap-2.5" onClick={onHome} aria-label="На главную">
      {content}
    </button>
  ) : (
    <a href="#top" className="flex items-center gap-2.5" aria-label="FitManager, на главную">
      {content}
    </a>
  );
}