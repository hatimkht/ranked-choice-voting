"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { getParty } from "@/lib/parties";
import type { PartyId } from "@/lib/types";

interface BallotProps {
  first: PartyId | null;
  second: PartyId | null;
  third: PartyId | null;
  /** Wenn `true`, wird der "Abgegeben"-Stempel eingeblendet. */
  stamped?: boolean;
}

/**
 * Wahlzettel im Papierstil — bewusst minimalistisch:
 * eine warme Papierfläche, ein dezenter Rand, klare Typografie.
 * Keine Wasserzeichen, keine Mehrfachrahmen, keine Schmuckelemente.
 */
export const Ballot = forwardRef<HTMLDivElement, BallotProps>(function Ballot(
  { first, second, third, stamped = false },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      layout
      className="relative w-full max-w-md mx-auto select-none"
    >
      <div
        className="absolute -inset-1 rounded-[16px] bg-paper-shadow/30 blur-md"
        aria-hidden
      />

      <div className="relative bg-paper rounded-[12px] shadow-paper border border-paper-edge overflow-hidden">
        {/* Kopf */}
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

        {/* Präferenz-Zeilen */}
        <ol>
          <PreferenceRow ordinal="1" label="Erste Präferenz" partyId={first} />
          <PreferenceRow ordinal="2" label="Zweite Präferenz" partyId={second} />
          <PreferenceRow ordinal="3" label="Dritte Präferenz" partyId={third} last />
        </ol>

        <div className="h-px bg-paper-edge mx-7 sm:mx-8" aria-hidden />

        {/* Fuß */}
        <div className="px-7 sm:px-8 py-4 text-[10px] uppercase tracking-label text-ink-muted flex items-center justify-between">
          <span>3 Stimmen</span>
          <span>Nicht offiziell</span>
        </div>

        {/* Abgegeben-Stempel */}
        {stamped && (
          <motion.div
            initial={{ scale: 1.6, opacity: 0, rotate: -22 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="absolute right-7 top-24 sm:right-9 sm:top-28 pointer-events-none"
            aria-hidden
          >
            <div className="px-5 py-1.5 border-[2px] border-stamp/80 rounded-md text-stamp tracking-[0.18em] uppercase text-base sm:text-lg opacity-90 bg-paper/40">
              Abgegeben
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

function PreferenceRow({
  ordinal,
  label,
  partyId,
  last,
}: {
  ordinal: string;
  label: string;
  partyId: PartyId | null;
  last?: boolean;
}) {
  const party = getParty(partyId);
  return (
    <li
      className={`px-7 sm:px-8 py-4 flex items-center gap-5 ${
        last ? "" : "border-b border-paper-edge/60"
      }`}
    >
      <span className="text-ink-muted w-5 text-[15px] tabular-nums">{ordinal}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-label text-ink-muted">{label}</div>
        {party ? (
          <div className="mt-1 flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: party.color }}
            />
            <span className="text-[16px] font-medium text-ink leading-tight">
              {party.shortName}
            </span>
          </div>
        ) : (
          <div className="mt-1 text-[14px] text-ink-muted">— nicht gewählt —</div>
        )}
      </div>
    </li>
  );
}
