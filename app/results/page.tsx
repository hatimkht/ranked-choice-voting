"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";
import { EliminatedPartiesPanel } from "@/components/EliminatedPartiesPanel";
import { TransferVisualization } from "@/components/TransferVisualization";
import { FinalResultsChart } from "@/components/charts/FinalResultsChart";
import { ParliamentArc } from "@/components/charts/ParliamentArc";
import { RawResultsChart } from "@/components/charts/RawResultsChart";
import { getVoteSource } from "@/lib/dataSource";
import { formatNumber } from "@/lib/format";
import { simulateElection } from "@/lib/simulation";
import type { Vote } from "@/lib/types";
import { useVoteStore } from "@/lib/voteStore";

export default function ResultsPage() {
  const router = useRouter();
  const { draft, reset } = useVoteStore();

  useEffect(() => {
    if (!draft.firstChoicePartyId || !draft.secondChoicePartyId || !draft.thirdChoicePartyId) {
      router.replace("/vote/first");
    }
  }, [draft, router]);

  const result = useMemo(() => {
    const votes = [...getVoteSource().loadVotes() as Vote[]];
    if (
      draft.firstChoicePartyId &&
      draft.secondChoicePartyId &&
      draft.thirdChoicePartyId
    ) {
      votes.push({
        firstChoicePartyId: draft.firstChoicePartyId,
        secondChoicePartyId: draft.secondChoicePartyId,
        thirdChoicePartyId: draft.thirdChoicePartyId,
      });
    }
    return simulateElection(votes);
  }, [draft]);

  if (!draft.firstChoicePartyId || !draft.secondChoicePartyId || !draft.thirdChoicePartyId)
    return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto max-w-5xl px-5 sm:px-8 pt-10 sm:pt-14 pb-16"
    >
      {/* Kopfbereich */}
      <header className="space-y-3 max-w-3xl">
        <Disclaimer variant="subtle" />
        <h1 className="text-display-1 font-medium text-ink mt-4">Auswertung</h1>
        <p className="text-[16px] sm:text-[17px] text-ink-soft leading-relaxed">
          So schlägt deine Stimme in der Simulation zu Buche — gemeinsam mit{" "}
          <span className="text-ink tabular-nums">
            {formatNumber(result.totalVotes - 1)}
          </span>{" "}
          weiteren Modell-Stimmen.
        </p>
      </header>

      {/* A. Rohverteilung */}
      <Section
        index="A"
        title="Rohverteilung der Erstpräferenzen"
        intro={`Zunächst werden alle Erstpräferenzen gezählt. Die rote, gestrichelte Linie markiert die ${result.threshold}%-Hürde — Parteien darunter scheiden vorerst aus.`}
      >
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-soft">
          <RawResultsChart
            tally={result.rawTally}
            threshold={result.threshold}
            eliminatedIds={result.eliminatedPartyIds}
          />
        </div>
      </Section>

      {/* B. Ausgeschiedene Parteien */}
      <Section
        index="B"
        title={`Parteien unter der ${result.threshold}%-Hürde`}
        intro="Diese Parteien sind in der ersten Zählung ausgeschieden. Ihre Stimmen werden im nächsten Schritt nicht weggeworfen."
      >
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-soft">
          <EliminatedPartiesPanel
            rawTally={result.rawTally}
            eliminatedIds={result.eliminatedPartyIds}
            threshold={result.threshold}
          />
        </div>
      </Section>

      {/* C. Transfer */}
      <Section
        index="C"
        title="Transfer der Stimmen"
        intro="Die Stimmen ausgeschiedener Parteien wandern zur jeweils nächsten gültigen Präferenz. Ist auch die Drittpräferenz nicht zugelassen, gilt die Stimme als nicht zugeordnet."
      >
        <TransferVisualization
          transfers={result.transfers}
          unassignedTotal={result.unassignedVotes}
        />
      </Section>

      {/* D. Finales Ergebnis */}
      <Section
        index="D"
        title="Finales Ergebnis"
        intro="Nach allen Transfers ergibt sich das finale Stimmverhältnis der zugelassenen Parteien."
      >
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-soft">
          <FinalResultsChart tally={result.finalTally} threshold={result.threshold} />
        </div>
      </Section>

      {/* E. Sitzverteilung */}
      <Section
        index="E"
        title="Modellhafte Sitzverteilung"
        intro={`Auf Basis des finalen Ergebnisses verteilen wir ${result.totalSeats} Modell-Sitze nach Hare-Niemeyer (Größte-Reste-Verfahren).`}
      >
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-soft">
          <ParliamentArc seats={result.seats} totalSeats={result.totalSeats} />
          <p className="mt-6 text-[12px] text-ink-muted text-center max-w-xl mx-auto leading-relaxed">
            Die Sitzverteilung ist eine vereinfachte Modellrechnung und entspricht nicht dem
            offiziellen deutschen Wahlrecht (Sainte-Laguë mit Überhang- und Ausgleichsmandaten).
          </p>
        </div>
      </Section>

      {/* F. Erklärung */}
      <Section
        index="F"
        title="Wie ist das Ergebnis entstanden?"
        intro="Eine kurze, neutrale Einordnung der einzelnen Schritte."
      >
        <ExplanationBlock threshold={result.threshold} totalSeats={result.totalSeats} />
      </Section>

      {/* Footer-CTA */}
      <div className="mt-16 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center border-t border-line pt-10">
        <p className="text-sm text-ink-soft max-w-xl">
          Möchtest du eine andere Konstellation ausprobieren? Du kannst deinen Wahlzettel zurücksetzen
          und die Simulation erneut durchlaufen.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            reset();
            router.push("/vote/first");
          }}
        >
          Erneut wählen
        </Button>
        <Button href="/" variant="ghost">
          Zur Übersicht
        </Button>
      </div>
    </motion.div>
  );
}

function Section({
  index,
  title,
  intro,
  children,
}: {
  index: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
      className="mt-14 sm:mt-20"
    >
      <header className="mb-6 max-w-3xl">
        <div className="flex items-baseline gap-3">
          <span className="text-ink-muted text-sm tabular-nums">{index}.</span>
          <h2 className="text-headline font-medium text-ink">{title}</h2>
        </div>
        {intro && (
          <p className="mt-3 text-[15px] text-ink-soft leading-relaxed pl-7">{intro}</p>
        )}
      </header>
      {children}
    </motion.section>
  );
}

function ExplanationBlock({ threshold, totalSeats }: { threshold: number; totalSeats: number }) {
  const items = [
    {
      heading: `Warum scheiden Parteien unter ${threshold} % aus?`,
      body: `Das Modell verwendet — analog zur deutschen Praxis — eine ${threshold}%-Sperrklausel. Sie soll eine Zersplitterung des Parlaments verhindern. In der Simulation gilt: Wer in der ersten Zählung diese Hürde nicht erreicht, ist nicht im finalen Ergebnis vertreten.`,
    },
    {
      heading: "Warum verfallen die Stimmen nicht?",
      body: "Im Drei-Stimmen-Modell sind Stimmen für ausgeschiedene Parteien nicht verloren. Sie werden auf die Zweitpräferenz übertragen. Ist auch diese ausgeschieden, gilt die Drittpräferenz. Erst wenn alle drei Präferenzen unter der Hürde liegen, gilt eine Stimme als nicht zugeordnet.",
    },
    {
      heading: "Wie entsteht das finale Ergebnis?",
      body: "Das finale Ergebnis ist die Summe aus zwei Quellen: den Erstpräferenzen der zugelassenen Parteien und den übertragenen Stimmen aus ausgeschiedenen Parteien. Die Prozentwerte beziehen sich auf die zugeordneten Stimmen.",
    },
    {
      heading: "Wie wird die Sitzverteilung berechnet?",
      body: `Die ${totalSeats} Modell-Sitze werden proportional zum finalen Stimmenanteil verteilt. Verwendet wird das Hare-Niemeyer-Verfahren: Jede Partei erhält zunächst den abgerundeten Anteil, die verbleibenden Sitze gehen an Parteien mit den höchsten Nachkomma-Resten. Diese Modellrechnung entspricht nicht dem offiziellen deutschen Wahlrecht.`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.heading}
          className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-soft"
        >
          <h3 className="text-[16px] font-medium text-ink tracking-tight">{item.heading}</h3>
          <p className="mt-2.5 text-[14px] text-ink-soft leading-relaxed">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
