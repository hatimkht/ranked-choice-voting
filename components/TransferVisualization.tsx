"use client";

import { motion } from "framer-motion";
import { getParty } from "@/lib/parties";
import { formatNumber, formatPercent } from "@/lib/format";
import type { EliminatedPartyTransfer } from "@/lib/types";

interface TransferVisualizationProps {
  transfers: EliminatedPartyTransfer[];
  unassignedTotal: number;
}

/**
 * Karten-Layout: pro ausgeschiedener Partei eine Karte mit Quelle (links)
 * und Zielen (rechts), verbunden durch animierte Stimm-Marker.
 *
 * Bewusst ruhig animiert (kurze Stagger, gedämpfte Bewegung), damit das
 * Konzept des Stimmtransfers verständlich bleibt.
 */
export function TransferVisualization({ transfers, unassignedTotal }: TransferVisualizationProps) {
  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
        Keine Partei ist unter der Hürde geblieben — es finden keine Stimmtransfers statt.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer, idx) => (
        <TransferCard key={transfer.partyId} transfer={transfer} index={idx} />
      ))}
      {unassignedTotal > 0 && (
        <div className="rounded-xl border border-dashed border-line bg-canvas/60 px-5 py-4 text-[13px] text-ink-soft">
          <span className="font-medium text-ink">{formatNumber(unassignedTotal)} Stimmen</span>{" "}
          insgesamt konnten keiner zugelassenen Partei zugeordnet werden, weil weder Zweit- noch
          Drittpräferenz die Hürde geschafft haben.
        </div>
      )}
    </div>
  );
}

function TransferCard({
  transfer,
  index,
}: {
  transfer: EliminatedPartyTransfer;
  index: number;
}) {
  const sourceParty = getParty(transfer.partyId);
  if (!sourceParty) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
      className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-soft"
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,200px)_1fr] md:gap-6 items-start">
        {/* Quelle */}
        <div>
          <div className="text-[10px] uppercase tracking-label text-ink-muted mb-2">
            Ausgeschieden
          </div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: sourceParty.color }}
            />
            <span className="text-[16px] font-medium text-ink leading-tight">
              {sourceParty.shortName}
            </span>
          </div>
          <div className="mt-2 text-[13px] text-ink-soft tabular-nums">
            {formatNumber(transfer.originalVotes)} Stimmen ·{" "}
            {formatPercent(transfer.originalPercent)}
          </div>
        </div>

        {/* Ziele */}
        <div>
          <div className="text-[10px] uppercase tracking-label text-ink-muted mb-2">
            Stimmen wandern zu
          </div>
          <ul className="space-y-2">
            {transfer.destinations.map((dest, i) => (
              <TransferRow
                key={(dest.toPartyId ?? "unassigned") + i}
                destination={dest}
                totalSourceVotes={transfer.originalVotes}
                index={i}
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function TransferRow({
  destination,
  totalSourceVotes,
  index,
}: {
  destination: { toPartyId: string | null; votes: number };
  totalSourceVotes: number;
  index: number;
}) {
  const target = destination.toPartyId ? getParty(destination.toPartyId) : undefined;
  const share = totalSourceVotes > 0 ? (destination.votes / totalSourceVotes) * 100 : 0;
  const isUnassigned = !target;

  return (
    <li>
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Pfeilspur */}
        <div className="relative h-2 flex-1 rounded-full bg-canvas overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, share)}%` }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.7,
              delay: 0.15 + index * 0.08,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isUnassigned ? "#D5D3CB" : target!.color,
              opacity: isUnassigned ? 0.7 : 0.85,
            }}
          />
        </div>
        {/* Ziel */}
        <div className="w-[160px] sm:w-[200px] flex items-center gap-2 flex-shrink-0">
          {target ? (
            <>
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: target.color }}
              />
              <span className="text-[14px] text-ink truncate">{target.shortName}</span>
            </>
          ) : (
            <>
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink-muted/50 flex-shrink-0" />
              <span className="text-[13px] text-ink-muted italic truncate">
                nicht zugeordnet
              </span>
            </>
          )}
        </div>
        {/* Zahlen */}
        <div className="w-[110px] text-right tabular-nums text-[13px] text-ink-soft flex-shrink-0">
          {formatNumber(destination.votes)}
          <span className="ml-1.5 text-ink-muted">({formatPercent(share, 0)})</span>
        </div>
      </div>
    </li>
  );
}
