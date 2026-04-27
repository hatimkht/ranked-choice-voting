"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { PartyPicker } from "@/components/PartyPicker";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { getParty } from "@/lib/parties";
import { useVoteStore } from "@/lib/voteStore";

export default function ThirdPreferencePage() {
  const router = useRouter();
  const { draft, setThird } = useVoteStore();

  useEffect(() => {
    if (!draft.firstChoicePartyId) router.replace("/vote/first");
    else if (!draft.secondChoicePartyId) router.replace("/vote/second");
  }, [draft.firstChoicePartyId, draft.secondChoicePartyId, router]);

  if (!draft.firstChoicePartyId || !draft.secondChoicePartyId) return null;

  const firstParty = getParty(draft.firstChoicePartyId);
  const secondParty = getParty(draft.secondChoicePartyId);
  const canContinue = !!draft.thirdChoicePartyId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="space-y-8"
    >
      <ProgressIndicator current={3} />

      <header className="space-y-3">
        <div className="text-[11px] uppercase tracking-label text-ink-muted">
          Dritte Präferenz
        </div>
        <h1 className="text-display-2 font-medium text-ink">
          Und falls auch die zweite Wahl scheitert — wohin dann?
        </h1>
        <p className="text-[15px] text-ink-soft leading-relaxed max-w-2xl">
          Die Drittpräferenz ist die letzte Reserve. Sie wird nur ausgewertet, wenn sowohl Erst-
          als auch Zweitpräferenz unter der Hürde bleiben.
        </p>
        <div className="flex flex-wrap gap-2">
          {[firstParty, secondParty].map(
            (p, i) =>
              p && (
                <div
                  key={p.id}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] text-ink-soft"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-ink-muted">
                    {i === 0 ? "Erst" : "Zweit"}:
                  </span>
                  <span className="text-ink">{p.shortName}</span>
                </div>
              ),
          )}
        </div>
      </header>

      <PartyPicker
        selectedId={draft.thirdChoicePartyId}
        onSelect={setThird}
        disabledIds={[draft.firstChoicePartyId, draft.secondChoicePartyId]}
        disabledReason={(id) =>
          id === draft.firstChoicePartyId
            ? "Bereits als Erstpräferenz gewählt"
            : id === draft.secondChoicePartyId
              ? "Bereits als Zweitpräferenz gewählt"
              : undefined
        }
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button href="/vote/second" variant="ghost">
          Zurück
        </Button>
        <Button
          onClick={() => canContinue && router.push("/vote/review")}
          disabled={!canContinue}
        >
          Weiter zum Wahlzettel
        </Button>
      </div>
    </motion.div>
  );
}
