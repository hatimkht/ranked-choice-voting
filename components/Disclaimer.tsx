export function Disclaimer({ variant = "default" }: { variant?: "default" | "subtle" }) {
  const isSubtle = variant === "subtle";
  return (
    <div
      role="note"
      className={
        isSubtle
          ? "text-[11px] uppercase tracking-label text-ink-muted"
          : "rounded-xl border border-line bg-white/60 px-4 py-3 text-sm text-ink-soft leading-relaxed"
      }
    >
      {isSubtle ? (
        <span>Hypothetische Simulation · Keine offizielle Wahl</span>
      ) : (
        <>
          <span className="font-medium text-ink">Hinweis.</span>{" "}
          Dies ist eine hypothetische Simulation eines Drei-Stimmen-Wahlmodells. Sie ist keine
          echte Wahl, keine offizielle Berechnung und keine Wahlempfehlung.
        </>
      )}
    </div>
  );
}
