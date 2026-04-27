"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ballot } from "@/components/Ballot";
import { BallotBox } from "@/components/BallotBox";
import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useVoteStore } from "@/lib/voteStore";

type Phase = "review" | "stamping" | "dropping" | "done";

export default function ReviewPage() {
  const router = useRouter();
  const { draft, markSubmitted } = useVoteStore();
  const [phase, setPhase] = useState<Phase>("review");

  // Redirect, falls Voraussetzungen fehlen.
  useEffect(() => {
    if (!draft.firstChoicePartyId) router.replace("/vote/first");
    else if (!draft.secondChoicePartyId) router.replace("/vote/second");
    else if (!draft.thirdChoicePartyId) router.replace("/vote/third");
  }, [draft, router]);

  if (!draft.firstChoicePartyId || !draft.secondChoicePartyId || !draft.thirdChoicePartyId)
    return null;

  async function handleSubmit() {
    setPhase("stamping");
    // Stempel kurz wirken lassen
    await wait(750);
    setPhase("dropping");
    // Wahlzettel sinkt in die Urne
    await wait(1100);
    markSubmitted();
    setPhase("done");
    await wait(250);
    router.push("/results");
  }

  const isAnimating = phase !== "review";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="space-y-8"
    >
      <ProgressIndicator current={4} />

      <header className="space-y-3">
        <div className="text-[11px] uppercase tracking-label text-ink-muted">
          Wahlzettel prüfen
        </div>
        <h1 className="text-display-2 font-medium text-ink">
          Sieht so deine Stimme aus?
        </h1>
        <p className="text-[15px] text-ink-soft leading-relaxed max-w-2xl">
          Wenn die Reihenfolge stimmt, kannst du den Zettel in die Modellurne werfen. Anschließend
          fließt deine Stimme in die Auswertung ein.
        </p>
      </header>

      {/* Bühne für Wahlzettel + Urne */}
      <div className="relative pt-4">
        <div className="relative h-[640px] sm:h-[680px]">
          {/* Urne im Hintergrund (erscheint, sobald Animation läuft) */}
          <div className="absolute inset-x-0 bottom-0">
            <BallotBox active={phase === "dropping" || phase === "done"} />
          </div>

          {/* Wahlzettel — voller Container, Ballot zentriert sich selbst (max-w-md mx-auto) */}
          <AnimatePresence>
            {phase !== "done" && (
              <motion.div
                key="ballot"
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={
                  phase === "dropping"
                    ? { y: 360, opacity: 0, scale: 0.55, rotate: -2 }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0 }}
                transition={
                  phase === "dropping"
                    ? { duration: 1.0, ease: [0.55, 0.05, 0.6, 0.95] }
                    : { duration: 0.3 }
                }
                className="absolute inset-x-0 top-0"
              >
                <Ballot
                  first={draft.firstChoicePartyId}
                  second={draft.secondChoicePartyId}
                  third={draft.thirdChoicePartyId}
                  stamped={phase === "stamping" || phase === "dropping"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <Disclaimer variant="subtle" />
        <Button
          href="/vote/third"
          variant="secondary"
          className={isAnimating ? "pointer-events-none opacity-50" : ""}
        >
          Bearbeiten
        </Button>
        <Button onClick={handleSubmit} disabled={isAnimating}>
          {phase === "review" ? "Abgeben" : "Wird abgegeben …"}
        </Button>
      </div>
    </motion.div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
