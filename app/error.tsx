"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

/**
 * Globaler Error-Boundary für die App-Routen.
 *
 * Wird von Next.js automatisch verwendet, wenn beim Rendern eines Segments
 * eine Exception fliegt. Wir zeigen eine ruhige Fehleranzeige im Stil der
 * App und bieten Retry sowie Rückkehr zur Übersicht.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-24">
      <div className="text-[11px] uppercase tracking-label text-ink-muted">
        Unerwarteter Fehler
      </div>
      <h1 className="mt-3 text-display-2 font-medium text-ink">
        Da ist etwas schiefgelaufen.
      </h1>
      <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-xl">
        Die Seite konnte nicht vollständig geladen werden. Du kannst es noch einmal versuchen oder
        zur Übersicht zurückkehren.
      </p>
      {error.digest && (
        <p className="mt-3 text-[12px] text-ink-muted tabular-nums">
          Fehler-ID: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => reset()}>Erneut versuchen</Button>
        <Button href="/" variant="secondary">
          Zur Übersicht
        </Button>
      </div>
    </div>
  );
}
