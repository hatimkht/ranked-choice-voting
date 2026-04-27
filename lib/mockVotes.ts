import { PARTIES } from "./parties";
import type { PartyId, Vote } from "./types";

/**
 * Erzeugt deterministisch eine Menge von Mock-Stimmabgaben.
 *
 * Wir verwenden gewichtete Verteilungen für Erst-, Zweit- und
 * Drittpräferenzen, sodass:
 *   - einige Parteien deutlich über der 5%-Hürde liegen,
 *   - mehrere Parteien knapp darunter,
 *   - und die Transfers visuell und didaktisch interessant werden.
 *
 * Die Funktion ist seedbasiert (LCG) — bei gleichem Seed entstehen identische
 * Stimmen, was deterministisches Rendering und stabile Tests erlaubt.
 */

// Gewichtete Erstpräferenzen. Summe muss nicht 100 ergeben.
const FIRST_CHOICE_WEIGHTS: Record<PartyId, number> = {
  cdu: 23,
  spd: 16,
  afd: 17,
  gruene: 13,
  fdp: 6,
  csu: 6,
  bsw: 6,
  linke: 5,
  fw: 3,
  volt: 2,
  tierschutz: 2.4,
  piraten: 0.9,
  oedp: 0.5,
  ssw: 0.6,
  buendnis_d: 0.3,
  diebasis: 0.4,
  mlpd: 0.15,
  dkp: 0.15,
};

/**
 * Realistische Zweit-/Drittpräferenz-Tendenzen je Erstpartei.
 * Die Werte sind relative Gewichte (nicht Prozent), damit Verteilungen
 * leicht erweitert oder verschoben werden können.
 */
const TRANSFER_AFFINITY: Record<PartyId, Record<PartyId, number>> = {
  cdu: { csu: 8, fdp: 6, fw: 3, spd: 2, gruene: 1, afd: 2, buendnis_d: 1 },
  csu: { cdu: 9, fdp: 4, fw: 4, afd: 2, spd: 1, buendnis_d: 1 },
  spd: { gruene: 6, linke: 4, bsw: 2, volt: 2, cdu: 2, fdp: 1, ssw: 1 },
  gruene: { spd: 6, volt: 5, linke: 3, tierschutz: 4, oedp: 2, fdp: 1 },
  fdp: { cdu: 6, fw: 3, volt: 3, spd: 2, gruene: 1, csu: 2 },
  afd: { buendnis_d: 4, diebasis: 3, csu: 3, cdu: 4, fw: 2, bsw: 2 },
  linke: { spd: 5, gruene: 4, bsw: 3, volt: 2, tierschutz: 1, mlpd: 1, dkp: 1 },
  bsw: { spd: 4, linke: 4, afd: 2, cdu: 1, fw: 1 },
  fw: { csu: 5, cdu: 4, fdp: 3, gruene: 1, spd: 1 },
  volt: { gruene: 6, spd: 3, fdp: 3, linke: 1, tierschutz: 1 },
  tierschutz: { gruene: 7, volt: 3, oedp: 4, spd: 2, linke: 2, piraten: 1 },
  piraten: { linke: 3, gruene: 3, volt: 3, spd: 1, tierschutz: 1 },
  oedp: { gruene: 5, tierschutz: 3, volt: 2, cdu: 1, spd: 1 },
  ssw: { spd: 4, gruene: 3, linke: 2, volt: 1 },
  buendnis_d: { afd: 4, cdu: 3, csu: 2, fdp: 1, fw: 1 },
  diebasis: { afd: 4, buendnis_d: 2, fw: 1, oedp: 1 },
  mlpd: { dkp: 4, linke: 5, spd: 1 },
  dkp: { mlpd: 4, linke: 5, spd: 1 },
};

/** Linearer Kongruenzgenerator — schnell, deterministisch, ausreichend für Mocks. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return function random(): number {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickWeighted(
  weights: Record<PartyId, number>,
  random: () => number,
  exclude: Set<PartyId>,
): PartyId | null {
  // Wir iterieren über `Object.entries`, damit der Wert garantiert definiert
  // ist und keine Non-Null-Assertion (`!`) nötig wird.
  const entries = Object.entries(weights).filter(([id]) => !exclude.has(id));
  let total = 0;
  for (const [, w] of entries) total += w;
  if (total <= 0) return null;

  let r = random() * total;
  for (const [id, w] of entries) {
    r -= w;
    if (r <= 0) return id;
  }
  return entries[entries.length - 1]?.[0] ?? null;
}

function buildSecondaryWeights(firstChoice: PartyId): Record<PartyId, number> {
  // Basis: Affinitäten der Erstpartei. Wir mischen einen kleinen
  // Grundrauschanteil aus den allgemeinen Erstpräferenzgewichten bei,
  // damit auch ungewöhnliche Folgepräferenzen vorkommen.
  const baseAffinity = TRANSFER_AFFINITY[firstChoice] ?? {};
  const merged: Record<PartyId, number> = {};
  for (const party of PARTIES) {
    if (!party.active) continue;
    const affinity = baseAffinity[party.id] ?? 0;
    const noise = (FIRST_CHOICE_WEIGHTS[party.id] ?? 0) * 0.15;
    const w = affinity * 4 + noise;
    if (w > 0) merged[party.id] = w;
  }
  return merged;
}

function generateSingleVote(random: () => number): Vote {
  const fallback = PARTIES[0]?.id ?? "cdu";
  const first = pickWeighted(FIRST_CHOICE_WEIGHTS, random, new Set()) ?? fallback;

  const secondaryWeights = buildSecondaryWeights(first);
  const second = pickWeighted(secondaryWeights, random, new Set([first]));

  // Drittpräferenz: leicht aufgeweicht, damit nicht jede Stimme dreifach kettiert.
  let third: PartyId | null = null;
  if (second) {
    const tertiaryWeights = buildSecondaryWeights(second);
    third = pickWeighted(tertiaryWeights, random, new Set([first, second]));
  }

  return {
    firstChoicePartyId: first,
    secondChoicePartyId: second,
    thirdChoicePartyId: third,
  };
}

const DEFAULT_SEED = 20260426;
const DEFAULT_COUNT = 1200; // im Bereich 500–2000 wie spezifiziert

let cachedVotes: Vote[] | null = null;

/**
 * Liefert (gecachte) Mock-Stimmen. Bei gleichem Seed deterministisch.
 *
 * In einer späteren Version kann diese Funktion durch einen
 * Datenbankaufruf ersetzt werden — siehe `lib/dataSource.ts`.
 */
export function getMockVotes(count: number = DEFAULT_COUNT, seed: number = DEFAULT_SEED): Vote[] {
  if (cachedVotes && count === DEFAULT_COUNT && seed === DEFAULT_SEED) {
    return cachedVotes;
  }
  const random = createRandom(seed);
  const votes: Vote[] = [];
  for (let i = 0; i < count; i++) {
    votes.push(generateSingleVote(random));
  }
  if (count === DEFAULT_COUNT && seed === DEFAULT_SEED) {
    cachedVotes = votes;
  }
  return votes;
}
