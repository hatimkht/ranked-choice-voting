import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-24">
      <div className="text-[11px] uppercase tracking-label text-ink-muted">
        404 · Seite nicht gefunden
      </div>
      <h1 className="mt-3 text-display-2 font-medium text-ink">
        Diese Seite existiert nicht.
      </h1>
      <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-xl">
        Vielleicht ist der Link veraltet oder die Adresse wurde falsch eingegeben.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Zur Übersicht</Button>
        <Button href="/vote/first" variant="secondary">
          Simulation starten
        </Button>
      </div>
    </div>
  );
}
