import type { PartyTally, SeatAllocation } from "./types";

/**
 * Vereinfachte Sitzverteilung nach Hare-Niemeyer (Größte-Reste-Verfahren).
 *
 * Vorgehen:
 *   1. Idealsitze pro Partei = (Stimmen / Gesamtstimmen) * Gesamtsitze
 *   2. Jede Partei erhält den ganzzahligen Anteil (Floor)
 *   3. Verbleibende Sitze werden nach Höhe der Nachkomma-Reste vergeben
 *      — bei Gleichstand entscheidet die höhere Stimmenzahl.
 *
 * Hinweis: Das ist bewusst eine Modellrechnung und keine Abbildung des
 * deutschen Bundeswahlrechts (Sainte-Laguë mit Überhang/Ausgleich etc.).
 */
export function allocateSeats(finalTally: PartyTally[], totalSeats: number): SeatAllocation[] {
  const totalVotes = finalTally.reduce((sum, t) => sum + t.votes, 0);
  if (totalVotes <= 0 || totalSeats <= 0) {
    return finalTally.map((t) => ({ partyId: t.partyId, seats: 0 }));
  }

  const ideal = finalTally.map((t) => {
    const exact = (t.votes / totalVotes) * totalSeats;
    return {
      partyId: t.partyId,
      votes: t.votes,
      floor: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    };
  });

  let assigned = ideal.reduce((sum, e) => sum + e.floor, 0);
  let remaining = totalSeats - assigned;

  const sortedByRemainder = [...ideal].sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder;
    return b.votes - a.votes;
  });

  const seatMap = new Map<string, number>(ideal.map((e) => [e.partyId, e.floor]));
  let i = 0;
  while (remaining > 0 && sortedByRemainder.length > 0) {
    const target = sortedByRemainder[i % sortedByRemainder.length]!;
    seatMap.set(target.partyId, (seatMap.get(target.partyId) ?? 0) + 1);
    remaining--;
    i++;
  }

  return finalTally.map((t) => ({
    partyId: t.partyId,
    seats: seatMap.get(t.partyId) ?? 0,
  }));
}
