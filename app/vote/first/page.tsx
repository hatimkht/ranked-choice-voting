"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { PartyPicker } from "@/components/PartyPicker";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useVoteStore } from "@/lib/voteStore";

export default function FirstPreferencePage() {
  const router = useRouter();
  const { draft, setFirst } = useVoteStore();

  const canContinue = !!draft.firstChoicePartyId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="space-y-8"
    >
      <ProgressIndicator current={1} />

      <header className="space-y-3">
        <div className="text-[11px] uppercase tracking-label text-ink-muted">
          Erste Präferenz
        </div>
        <h1 className="text-display-2 font-medium text-ink">
          Welche Partei trifft deine politische Überzeugung am genauesten?
        </h1>
        <p className="text-[15px] text-ink-soft leading-relaxed max-w-2xl">
          Wähle hier ehrlich — ohne taktisches Vorausrechnen. Im nächsten Schritt legst du eine
          zweite und dritte Wahl fest, falls deine erste Partei die Hürde verfehlt.
        </p>
      </header>

      <PartyPicker selectedId={draft.firstChoicePartyId} onSelect={setFirst} />

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button href="/" variant="ghost">
          Zurück zur Übersicht
        </Button>
        <Button
          onClick={() => canContinue && router.push("/vote/second")}
          disabled={!canContinue}
        >
          Weiter
          <Arrow />
        </Button>
      </div>
    </motion.div>
  );
}

function Arrow() {
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
