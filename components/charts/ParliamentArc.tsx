"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { getParty } from "@/lib/parties";
import type { SeatAllocation } from "@/lib/types";

interface ParliamentArcProps {
  seats: SeatAllocation[];
  totalSeats: number;
}

interface SeatPoint {
  cx: number;
  cy: number;
  r: number;
  partyId: string;
  color: string;
}

/**
 * Halbrund-Sitzverteilung — Parteien bilden zusammenhängende Sektoren.
 *
 * Vorgehen (entspricht der Konvention offizieller Parlamentsdiagramme):
 *   1. Sitze auf konzentrische Reihen verteilen — die äußere Reihe trägt
 *      proportional mehr Sitze (proportional zum Radius).
 *   2. Jeder Sitz bekommt einen Winkel von π (links) bis 0 (rechts).
 *   3. Alle Sitze werden global nach Winkel sortiert. Bei gleichem Winkel
 *      entscheidet die Reihennummer (innen zuerst) — das ergibt einen
 *      sauberen vertikalen Block je Spalte.
 *   4. Parteien werden in Spektrumsreihenfolge mit ihrer Sitzanzahl an
 *      aufeinanderfolgende Plätze dieser Sortierung vergeben. So entstehen
 *      zusammenhängende Sektoren statt versprengter Punkte.
 */
function buildSeatLayout(seats: SeatAllocation[], totalSeats: number): SeatPoint[] {
  const N = seats.reduce((s, p) => s + p.seats, 0) || totalSeats;
  if (N === 0) return [];

  const rows = N <= 30 ? 3 : N <= 80 ? 4 : 5;

  const innerR = 0.55;
  const outerR = 0.98;

  const rowRadii: number[] = [];
  for (let i = 0; i < rows; i++) {
    const t = i / (rows - 1);
    rowRadii.push(innerR + t * (outerR - innerR));
  }

  const radiiSum = rowRadii.reduce((s, r) => s + r, 0);
  const seatsPerRow = rowRadii.map((r) =>
    Math.max(1, Math.round((r / radiiSum) * N)),
  );

  // Korrektur, falls Summe ≠ N (Rundungsdifferenz auf die äußerste Reihe legen).
  let diff = N - seatsPerRow.reduce((s, n) => s + n, 0);
  let i = seatsPerRow.length - 1;
  while (diff !== 0) {
    if (diff > 0) {
      seatsPerRow[i] = (seatsPerRow[i] ?? 0) + 1;
      diff--;
    } else if ((seatsPerRow[i] ?? 0) > 1) {
      seatsPerRow[i] = (seatsPerRow[i] ?? 0) - 1;
      diff++;
    }
    i = (i - 1 + seatsPerRow.length) % seatsPerRow.length;
  }

  // Alle Sitzpositionen erzeugen
  type SeatSlot = { row: number; angle: number; cx: number; cy: number };
  const allSlots: SeatSlot[] = [];
  for (let r = 0; r < rows; r++) {
    const count = seatsPerRow[r]!;
    const radius = rowRadii[r]!;
    // Winkel-Padding pro Reihe, damit die innerste Reihe nicht ganz an die
    // Grundlinie schlägt — sieht klassischer aus.
    const padding = 0.0; // (kann bei Bedarf > 0 gesetzt werden)
    for (let k = 0; k < count; k++) {
      const t = count === 1 ? 0.5 : k / (count - 1);
      const angle = Math.PI - padding - t * (Math.PI - 2 * padding);
      allSlots.push({
        row: r,
        angle,
        cx: Math.cos(angle) * radius,
        cy: -Math.sin(angle) * radius,
      });
    }
  }

  // Globale Sortierung: links → rechts (Winkel absteigend von π zu 0).
  // Bei gleichem Winkel: innen → außen (kleine Reihennummer zuerst). Das
  // füllt die Spalte vertikal und ergibt zusammenhängende Sektoren.
  allSlots.sort((a, b) => {
    if (b.angle !== a.angle) return b.angle - a.angle;
    return a.row - b.row;
  });

  // Parteien in Spektrumsreihenfolge
  const partyOrder = [...seats]
    .filter((s) => s.seats > 0)
    .sort((a, b) => {
      const pa = getParty(a.partyId)?.spectrum ?? 50;
      const pb = getParty(b.partyId)?.spectrum ?? 50;
      return pa - pb;
    });

  // Konsekutiv den globalen Slots zuweisen
  const seatRadius = 0.034 - rows * 0.0035;
  const points: SeatPoint[] = [];
  let slotIdx = 0;

  for (const alloc of partyOrder) {
    const party = getParty(alloc.partyId);
    const color = party?.color ?? "#999";
    for (let s = 0; s < alloc.seats; s++) {
      const slot = allSlots[slotIdx++];
      if (!slot) break;
      points.push({
        cx: slot.cx,
        cy: slot.cy,
        r: seatRadius,
        partyId: alloc.partyId,
        color,
      });
    }
  }

  return points;
}

export function ParliamentArc({ seats, totalSeats }: ParliamentArcProps) {
  const points = useMemo(() => buildSeatLayout(seats, totalSeats), [seats, totalSeats]);

  const orderedSeatsForLegend = useMemo(() => {
    return [...seats]
      .filter((s) => s.seats > 0)
      .sort((a, b) => {
        const pa = getParty(a.partyId)?.spectrum ?? 50;
        const pb = getParty(b.partyId)?.spectrum ?? 50;
        return pa - pb;
      });
  }, [seats]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl">
        <svg viewBox="-1.08 -1.12 2.16 1.32" className="w-full h-auto">
          {/* Grundlinie */}
          <line
            x1={-1.02}
            y1={0.005}
            x2={1.02}
            y2={0.005}
            stroke="#D5D3CB"
            strokeWidth={0.005}
          />
          {points.map((p, idx) => (
            <motion.circle
              key={idx}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.color}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15 + (idx / points.length) * 0.6,
                duration: 0.32,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
              stroke="#FFFFFF"
              strokeWidth={0.004}
            />
          ))}
          <text
            x={0}
            y={-0.05}
            textAnchor="middle"
            fontSize={0.075}
            fill="#3A4150"
            fontFamily="ui-serif, Georgia, serif"
            opacity={0.55}
          >
            {totalSeats} Modell-Sitze
          </text>
        </svg>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-ink-soft">
        {orderedSeatsForLegend.map((alloc) => {
          const party = getParty(alloc.partyId);
          if (!party) return null;
          return (
            <span key={alloc.partyId} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: party.color }}
              />
              <span className="text-ink">{party.shortName}</span>
              <span className="tabular-nums text-ink-muted">{alloc.seats}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
