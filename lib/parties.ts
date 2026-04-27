import type { Party, PartyId } from "./types";

/**
 * Zentrale Parteikonfiguration.
 *
 * Erweiterung: Neue Parteien einfach an die Liste anhängen. Das Feld
 * `spectrum` (0–100) bestimmt nur die Reihenfolge im Halbrund-Parlament.
 * Es handelt sich um eine bewusst vereinfachte Modellannahme.
 */
export const PARTIES: Party[] = [
  {
    id: "linke",
    shortName: "Die Linke",
    fullName: "Die Linke",
    color: "#B53389",
    spectrum: 8,
    active: true,
  },
  {
    id: "bsw",
    shortName: "BSW",
    fullName: "Bündnis Sahra Wagenknecht",
    color: "#7A2E6F",
    spectrum: 14,
    active: true,
  },
  {
    id: "spd",
    shortName: "SPD",
    fullName: "Sozialdemokratische Partei Deutschlands",
    color: "#C8244E",
    spectrum: 26,
    active: true,
  },
  {
    id: "gruene",
    shortName: "GRÜNE",
    fullName: "Bündnis 90 / Die Grünen",
    color: "#3E8E3E",
    spectrum: 32,
    active: true,
  },
  {
    id: "volt",
    shortName: "Volt",
    fullName: "Volt Deutschland",
    color: "#5A2D8C",
    spectrum: 38,
    active: true,
  },
  {
    id: "tierschutz",
    shortName: "Tierschutzpartei",
    fullName: "Partei Mensch Umwelt Tierschutz",
    color: "#6EA85B",
    spectrum: 35,
    active: true,
  },
  {
    id: "piraten",
    shortName: "PIRATEN",
    fullName: "Piratenpartei Deutschland",
    color: "#F08A24",
    spectrum: 40,
    active: true,
  },
  {
    id: "oedp",
    shortName: "ÖDP",
    fullName: "Ökologisch-Demokratische Partei",
    color: "#D9A300",
    spectrum: 42,
    active: true,
  },
  {
    id: "ssw",
    shortName: "SSW",
    fullName: "Südschleswigscher Wählerverband",
    color: "#0F5FA6",
    spectrum: 45,
    active: true,
  },
  {
    id: "fdp",
    shortName: "FDP",
    fullName: "Freie Demokratische Partei",
    color: "#E5B400",
    spectrum: 60,
    active: true,
  },
  {
    id: "fw",
    shortName: "FREIE WÄHLER",
    fullName: "Freie Wähler",
    color: "#E68A00",
    spectrum: 64,
    active: true,
  },
  {
    id: "cdu",
    shortName: "CDU",
    fullName: "Christlich Demokratische Union Deutschlands",
    color: "#1B1B1B",
    spectrum: 70,
    active: true,
  },
  {
    id: "csu",
    shortName: "CSU",
    fullName: "Christlich-Soziale Union in Bayern",
    color: "#0E3A66",
    spectrum: 72,
    active: true,
  },
  {
    id: "buendnis_d",
    shortName: "Bündnis Deutschland",
    fullName: "Bündnis Deutschland",
    color: "#16518C",
    spectrum: 80,
    active: true,
  },
  {
    id: "afd",
    shortName: "AfD",
    fullName: "Alternative für Deutschland",
    color: "#1F8FBF",
    spectrum: 92,
    active: true,
  },
  {
    id: "diebasis",
    shortName: "dieBasis",
    fullName: "Basisdemokratische Partei Deutschland",
    color: "#9E6B2F",
    spectrum: 88,
    active: true,
  },
  {
    id: "mlpd",
    shortName: "MLPD",
    fullName: "Marxistisch-Leninistische Partei Deutschlands",
    color: "#8A1A1A",
    spectrum: 4,
    active: true,
  },
  {
    id: "dkp",
    shortName: "DKP",
    fullName: "Deutsche Kommunistische Partei",
    color: "#A03030",
    spectrum: 2,
    active: true,
  },
];

const PARTY_INDEX: Map<PartyId, Party> = new Map(PARTIES.map((p) => [p.id, p]));

export function getParty(id: PartyId | null | undefined): Party | undefined {
  if (!id) return undefined;
  return PARTY_INDEX.get(id);
}

export function getActiveParties(): Party[] {
  return PARTIES.filter((p) => p.active);
}

/** Modellhafte Wahlhürde in Prozent. */
export const VOTE_THRESHOLD_PERCENT = 5;

/** Modellhafte Größe des hypothetischen Parlaments. */
export const TOTAL_MODEL_SEATS = 100;
