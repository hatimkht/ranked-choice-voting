import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-canvas/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-accent transition-transform group-hover:scale-110"
          />
          <span className="text-[15px] sm:text-base font-medium tracking-tight text-ink">
            Präferenzwahl <span className="text-ink-muted text-[11px] uppercase tracking-label ml-1.5 font-normal">Simulation</span>
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/" className="hover:text-ink transition-colors">
            Übersicht
          </Link>
          <Link
            href="/vote/first"
            className="rounded-full border border-line px-4 py-1.5 text-ink hover:border-ink-soft hover:bg-white transition-colors"
          >
            Simulation starten
          </Link>
        </nav>
      </div>
    </header>
  );
}
