"use client";

import { motion } from "framer-motion";
import { getParty } from "@/lib/parties";
import { formatNumber, formatPercent } from "@/lib/format";
import type { PartyTally } from "@/lib/types";

interface EliminatedPartiesPanelProps {
  rawTally: PartyTally[];
  eliminatedIds: string[];
  threshold: number;
}

export function EliminatedPartiesPanel({
  rawTally,
  eliminatedIds,
  threshold,
}: EliminatedPartiesPanelProps) {
  const set = new Set(eliminatedIds);
  const eliminated = rawTally.filter((t) => set.has(t.partyId));

  if (eliminated.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Keine Partei liegt unter der {threshold}%-Hürde — das finale Ergebnis entspricht der
        Rohverteilung.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        Diese Parteien liegen unter der {threshold}%-Hürde. Ihre Stimmen verfallen nicht — sie
        wandern zur jeweils nächsten gültigen Präferenz.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {eliminated.map((t, idx) => {
          const party = getParty(t.partyId);
          if (!party) return null;
          return (
            <motion.li
              key={t.partyId}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-xl border border-line bg-canvas/50 px-4 py-3 flex items-center gap-3"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: party.color, opacity: 0.7 }}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] text-ink truncate">{party.shortName}</span>
                <span className="block text-[12px] text-ink-muted tabular-nums">
                  {formatPercent(t.percent)} · {formatNumber(t.votes)} Stimmen
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-label text-stamp">
                ausgeschieden
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
