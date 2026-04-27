export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 grid gap-6 sm:grid-cols-2 text-sm text-ink-muted">
        <div>
          <p className="text-ink text-[15px] font-medium mb-2">Präferenzwahl-Simulation</p>
          <p className="max-w-md leading-relaxed">
            Ein neutraler Civic-Tech-Prototyp zur Veranschaulichung eines hypothetischen
            Drei-Stimmen-Modells. Keine echte Wahl, keine Wahlempfehlung.
          </p>
        </div>
        <div className="sm:text-right space-y-1">
          <p>Version 1 · Mock-Daten · Ohne Backend</p>
          <p className="text-[11px] uppercase tracking-label">Bildungs- und Demonstrationszweck</p>
        </div>
      </div>
    </footer>
  );
}
