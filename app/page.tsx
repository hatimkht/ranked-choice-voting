import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";
import { InfoCard } from "@/components/InfoCard";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <Disclaimer variant="subtle" />
              <h1 className="mt-5 text-display-1 font-medium text-ink">
                Ehrlich wählen — ohne taktisches Kalkül.
              </h1>
              <p className="mt-6 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-ink-soft">
                Diese Simulation zeigt, wie ein Wahlmodell mit drei Präferenzen Stimmen ehrlicher
                werden lassen könnte: Keine Stimme verfällt, weil eine kleine Partei knapp scheitert
                — sie wandert zur nächsten Wahl.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/vote/first" size="lg">
                  Simulation starten
                  <ArrowRight />
                </Button>
                <Button href="#funktionsweise" variant="ghost" size="lg">
                  Wie funktioniert das?
                </Button>
              </div>
            </div>

            <HeroCard />
          </div>
        </div>
      </section>

      {/* Drei Schritte */}
      <section id="funktionsweise" className="border-t border-line bg-white/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-label text-ink-muted">
              Das Drei-Stimmen-Modell
            </div>
            <h2 className="mt-3 text-display-2 font-medium text-ink">
              Drei Präferenzen, eine transparente Auszählung.
            </h2>
            <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-ink-soft">
              Du gibst nicht nur eine Stimme ab, sondern dreimal eine — als gestaffelte Reihenfolge.
              Erst werden alle Erstpräferenzen gezählt. Erreicht eine Partei die 5%-Hürde nicht,
              werden ihre Stimmen nicht weggeworfen — sie werden auf die jeweilige Zweit- oder
              Drittpräferenz übertragen.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <InfoCard
              step="01"
              title="Erste Präferenz wählen"
              body="Wähle die Partei, die deine politische Überzeugung am genauesten trifft — ohne taktisches Vorausrechnen."
            />
            <InfoCard
              step="02"
              title="Fallback-Präferenzen festlegen"
              body="Lege eine zweite und dritte Wahl fest. Sie greifen nur, wenn deine Erstwahl die Hürde verfehlt."
            />
            <InfoCard
              step="03"
              title="Ergebnis transparent nachvollziehen"
              body="Sieh in der Auswertung, wie deine Stimme zählt, wohin Stimmen wandern und wie sich das Parlament zusammensetzt."
            />
          </div>
        </div>
      </section>

      {/* Zweiter CTA-Block */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <h3 className="text-headline font-medium text-ink">
              Ein Demokratie-Werkzeug zum Ausprobieren — nicht zum Glauben.
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Die Simulation arbeitet mit Mock-Daten und einer vereinfachten Sitzberechnung. Sie
              soll ein Modell sichtbar machen, nicht eine Wahl ersetzen.
            </p>
            <div className="mt-6">
              <Disclaimer />
            </div>
          </div>
          <div className="lg:justify-self-end">
            <Button href="/vote/first" size="lg">
              Jetzt ausprobieren
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Wahlzettel-Vorschau auf der Landingpage — bewusst minimalistisch
 * gehalten, damit sie das Hero nicht erschlägt.
 */
function HeroCard() {
  const rows = [
    { label: "Erste Präferenz", placeholder: "deine Wunschpartei" },
    { label: "Zweite Präferenz", placeholder: "Fallback-Wahl" },
    { label: "Dritte Präferenz", placeholder: "weitere Reserve" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[20px] bg-paper/30 blur-2xl" aria-hidden />
      <div className="relative rounded-[12px] border border-paper-edge bg-paper shadow-paper overflow-hidden">
        <div className="px-7 sm:px-8 pt-8 pb-5">
          <div className="text-[10px] uppercase tracking-label text-ink-muted">
            Modell-Wahlzettel
          </div>
          <h2 className="mt-2 text-[20px] sm:text-[22px] font-medium tracking-tight text-ink leading-snug">
            Hypothetische Präferenzwahl
          </h2>
          <p className="mt-1.5 text-[13px] text-ink-muted">
            Drei Parteipräferenzen — geordnet nach Priorität.
          </p>
        </div>

        <div className="h-px bg-paper-edge mx-7 sm:mx-8" aria-hidden />

        <ul>
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={`px-7 sm:px-8 py-4 flex items-center gap-5 ${
                i < rows.length - 1 ? "border-b border-paper-edge/60" : ""
              }`}
            >
              <span className="text-ink-muted w-5 text-[15px] tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-label text-ink-muted">
                  {row.label}
                </div>
                <div className="mt-1 text-[14px] text-ink-muted">— {row.placeholder} —</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-px bg-paper-edge mx-7 sm:mx-8" aria-hidden />

        <div className="px-7 sm:px-8 py-4 text-[10px] uppercase tracking-label text-ink-muted flex items-center justify-between">
          <span>3 Stimmen</span>
          <span>Nicht offiziell</span>
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 7h12M8 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
