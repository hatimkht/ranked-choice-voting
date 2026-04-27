/**
 * Geteilte Typen für die Präferenzwahl-Simulation.
 *
 * Diese Datei definiert die Datenstruktur einer Stimmabgabe sowie das
 * Auswertungsergebnis. Sie ist bewusst frei von UI-Abhängigkeiten, damit
 * sowohl die Mock-Quelle als auch eine spätere Datenbankanbindung dieselben
 * Typen verwenden können.
 */

export type PartyId = string;

export interface Party {
  id: PartyId;
  shortName: string;
  fullName: string;
  /** Hex-Farbe für Diagramme & Markierungen. */
  color: string;
  description?: string;
  /** Wenn `false`, taucht die Partei nicht im Auswahlkatalog auf. */
  active: boolean;
  /**
   * Position auf einer vereinfachten Links-Rechts-Achse (0 = links, 100 = rechts).
   * Wird ausschließlich für die Reihenfolge im Halbrund-Parlament genutzt.
   * Dies ist eine modellhafte Vereinfachung, keine politikwissenschaftliche Aussage.
   */
  spectrum: number;
}

export interface Vote {
  firstChoicePartyId: PartyId;
  secondChoicePartyId: PartyId | null;
  thirdChoicePartyId: PartyId | null;
}

export interface PartyTally {
  partyId: PartyId;
  votes: number;
  percent: number;
}

/** Wohin die Stimmen einer ausgeschiedenen Partei wandern. */
export interface TransferDestination {
  toPartyId: PartyId | null; // null = nicht zugeordnet
  votes: number;
}

export interface EliminatedPartyTransfer {
  partyId: PartyId;
  originalVotes: number;
  originalPercent: number;
  destinations: TransferDestination[];
}

export interface SeatAllocation {
  partyId: PartyId;
  seats: number;
}

export interface SimulationResult {
  /** Schwelle in Prozent, ab der Parteien zugelassen sind. */
  threshold: number;
  totalVotes: number;
  /** Rohzählung der Erstpräferenzen, sortiert nach Stimmen absteigend. */
  rawTally: PartyTally[];
  /** IDs der Parteien, die unter der Hürde liegen. */
  eliminatedPartyIds: PartyId[];
  /** Detaillierte Transfers ausgeschiedener Parteien. */
  transfers: EliminatedPartyTransfer[];
  /** Stimmen, die keiner zugelassenen Partei zugeordnet werden konnten. */
  unassignedVotes: number;
  /** Finales Ergebnis, sortiert nach Stimmen absteigend. */
  finalTally: PartyTally[];
  /** Modellhafte Sitzverteilung. */
  seats: SeatAllocation[];
  /** Anzahl der vergebenen Sitze (Modell). */
  totalSeats: number;
}
