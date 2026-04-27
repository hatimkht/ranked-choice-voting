import Link from "next/link";

const STEPS = [
  { label: "Erste Präferenz", href: "/vote/first" },
  { label: "Zweite Präferenz", href: "/vote/second" },
  { label: "Dritte Präferenz", href: "/vote/third" },
  { label: "Wahlzettel prüfen", href: "/vote/review" },
] as const;

export function ProgressIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-label text-ink-muted">
        <span>Schritt {current} von {STEPS.length}</span>
        <span aria-hidden>·</span>
        <span className="text-ink">{STEPS[current - 1]!.label}</span>
      </div>
      <ol className="grid grid-cols-4 gap-1.5">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <li key={step.href} className="relative">
              {isDone ? (
                <Link
                  href={step.href}
                  className="block h-1 rounded-full bg-ink hover:bg-ink-soft transition-colors"
                  aria-label={`Zurück zu ${step.label}`}
                />
              ) : (
                <span
                  className={
                    isActive
                      ? "block h-1 rounded-full bg-ink"
                      : "block h-1 rounded-full bg-line"
                  }
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
