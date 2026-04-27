"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { PartyPicker } from "@/components/PartyPicker";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { getParty } from "@/lib/parties";
import { useVoteStore } from "@/lib/voteStore";

export default function SecondPreferencePage() {
  const router = useRouter();
  const { draft, setSecond } = useVoteStore();

  // Wenn die Erstpräferenz fehlt (z. B. direkter URL-Aufruf), zurückleiten.
  useEffect(() => {
    if (!draft.firstChoicePartyId) router.replace("/vote/first");
  }, [draft.firstChoicePartyId, router]);

  if (!draft.firstChoicePartyId) return null;

  const firstParty = getParty(draft.firstChoicePartyId);
  const canContinue = !!draft.secondChoicePartyId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="space-y-8"
    >
      <ProgressIndicator current={2} />

      <header className="space-y-3">
        <div className="text-[11px] uppercase tracking-label text-ink-muted">
          Zweite Präferenz
        </div>
        <h1 className="text-display-2 font-medium text-ink">
          Wenn deine erste Wahl die Hürde verfehlt — welche Partei dann?
        </h1>
        <p className="text-[15px] text-ink-soft leading-relaxed max-w-2xl">
          Diese Präferenz greift <span className="text-ink">nur</span>, wenn deine Erstpräferenz
          unter der 5%-Hürde bleibt. Andernfalls bleibt sie wirkungslos.
        </p>
        {firstParty && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] text-ink-soft">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: firstParty.color }}
            />
            <span className="text-ink-muted">Erstpräferenz:</span>
            <span className="text-ink">{firstParty.shortName}</span>
          </div>
        )}
      </header>

      <PartyPicker
        selectedId={draft.secondChoicePartyId}
        onSelect={setSecond}
        disabledIds={[draft.firstChoicePartyId]}
        disabledReason={(id) =>
          id === draft.firstChoicePartyId ? "Bereits als Erstpräferenz gewählt" : undefined
        }
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button href="/vote/first" variant="ghost">
          Zurück
        </Button>
        <Button
          onClick={() => canContinue && router.push("/vote/third")}
          disabled={!canContinue}
        >
          Weiter
        </Button>
      </div>
    </motion.div>
  );
}
