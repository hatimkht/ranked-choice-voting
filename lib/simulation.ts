import { TOTAL_MODEL_SEATS, VOTE_THRESHOLD_PERCENT } from "./parties";
import { allocateSeats } from "./seats";
import type {
  EliminatedPartyTransfer,
  PartyId,
  PartyTally,
  SimulationResult,
  TransferDestination,
  Vote,
} from "./types";

/**
 * Berechnet das Wahlergebnis aus einer Liste von Stimmabgaben.
 *
 * Ablauf (siehe README "Grundidee"):
 *   1. Alle Erstpräferenzen werden gezählt.
 *   2. Jede Partei unter der Hürde gilt als ausgeschieden.
 *   3. Stimmen ausgeschiedener Parteien wandern zur Zweitpräferenz.
 *      Ist auch diese ausgeschieden, wird die Drittpräferenz geprüft.
 *      Greift keine, gilt die Stimme als nicht zugeordnet.
 *   4. Aus dem finalen Ergebnis wird eine modellhafte Sitzverteilung
 *      (Hare-Niemeyer auf 100 Modell-Sitzen) abgeleitet.
 *
 * Die Funktion ist rein und seiteneffektfrei.
 */
export function simulateElection(
  votes: Vote[],
  options?: {
    threshold?: number;
    totalSeats?: number;
  },
): SimulationResult {
  const threshold = options?.threshold ?? VOTE_THRESHOLD_PERCENT;
  const totalSeats = options?.totalSeats ?? TOTAL_MODEL_SEATS;
  const totalVotes = votes.length;

  // 1. Rohzählung
  const rawCounts = new Map<PartyId, number>();
  for (const v of votes) {
    rawCounts.set(v.firstChoicePartyId, (rawCounts.get(v.firstChoicePartyId) ?? 0) + 1);
  }
  const rawTally: PartyTally[] = [...rawCounts.entries()]
    .map(([partyId, count]) => ({
      partyId,
      votes: count,
      percent: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  // 2. Ausgeschiedene Parteien identifizieren
  const eliminated = new Set<PartyId>(
    rawTally.filter((t) => t.percent < threshold).map((t) => t.partyId),
  );

  // 3. Transfers aufbauen
  const transferBuckets = new Map<PartyId, Map<PartyId | "__unassigned__", number>>();
  for (const partyId of eliminated) {
    transferBuckets.set(partyId, new Map());
  }

  // Endgültige Stimmen je qualifizierter Partei (initial = Roh-Stimmen der Qualifizierten)
  const finalCounts = new Map<PartyId, number>();
  for (const t of rawTally) {
    if (!eliminated.has(t.partyId)) {
      finalCounts.set(t.partyId, t.votes);
    }
  }
  let unassignedVotes = 0;

  for (const v of votes) {
    if (!eliminated.has(v.firstChoicePartyId)) continue;

    const candidates: (PartyId | null)[] = [v.secondChoicePartyId, v.thirdChoicePartyId];
    let landed: PartyId | null = null;
    for (const c of candidates) {
      if (c && !eliminated.has(c)) {
        landed = c;
        break;
      }
    }

    const bucket = transferBuckets.get(v.firstChoicePartyId)!;
    if (landed) {
      finalCounts.set(landed, (finalCounts.get(landed) ?? 0) + 1);
      bucket.set(landed, (bucket.get(landed) ?? 0) + 1);
    } else {
      unassignedVotes++;
      bucket.set("__unassigned__", (bucket.get("__unassigned__") ?? 0) + 1);
    }
  }

  // 4. Transfer-Reports formen
  const transfers: EliminatedPartyTransfer[] = rawTally
    .filter((t) => eliminated.has(t.partyId))
    .map((t) => {
      const bucket = transferBuckets.get(t.partyId) ?? new Map();
      const destinations: TransferDestination[] = [...bucket.entries()]
        .map(([key, votes]) => ({
          toPartyId: key === "__unassigned__" ? null : (key as PartyId),
          votes,
        }))
        .sort((a, b) => b.votes - a.votes);
      return {
        partyId: t.partyId,
        originalVotes: t.votes,
        originalPercent: t.percent,
        destinations,
      };
    });

  // 5. Finales Tally
  // Bezugsgröße für die finalen Prozentwerte sind die zugeordneten Stimmen
  // (Gesamt minus nicht zugeordnete) — so summieren sich die Anteile auf 100 %.
  const assignedVotes = totalVotes - unassignedVotes;
  const finalTally: PartyTally[] = [...finalCounts.entries()]
    .map(([partyId, votes]) => ({
      partyId,
      votes,
      percent: assignedVotes > 0 ? (votes / assignedVotes) * 100 : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  // 6. Sitzverteilung
  const seats = allocateSeats(finalTally, totalSeats);

  return {
    threshold,
    totalVotes,
    rawTally,
    eliminatedPartyIds: [...eliminated],
    transfers,
    unassignedVotes,
    finalTally,
    seats,
    totalSeats,
  };
}
