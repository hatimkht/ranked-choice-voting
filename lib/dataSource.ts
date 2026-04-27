import { getMockVotes } from "./mockVotes";
import type { Vote } from "./types";

/**
 * Abstraktion über die Stimmen-Datenquelle.
 *
 * In Version 1 liefert dies deterministische Mock-Daten. Eine spätere
 * Datenbankanbindung (z. B. Postgres, KV, externe API) kann hier ohne
 * Änderung an UI- oder Simulationscode eingehängt werden, indem eine
 * andere Implementation des Interfaces zurückgegeben wird.
 */
export interface VoteSource {
  /** Liefert alle bisher abgegebenen Stimmen (in Version 1: Mock). */
  loadVotes(): Promise<Vote[]> | Vote[];
  /** Persistiert eine neue Stimme. In Version 1 ein No-op. */
  recordVote(vote: Vote): Promise<void> | void;
}

class MockVoteSource implements VoteSource {
  loadVotes(): Vote[] {
    return getMockVotes();
  }

  // Bewusst kein Persistenzschritt in Version 1: die aktuelle Stimme des
  // Nutzers wird im UI-State gehalten und direkt in `simulateElection`
  // mit eingerechnet. Eine echte DB-Implementierung erhält hier `vote`
  // — siehe `VoteSource`-Interface.
  recordVote(): void {
    return;
  }
}

let _source: VoteSource = new MockVoteSource();

export function getVoteSource(): VoteSource {
  return _source;
}

/** Erlaubt das Austauschen der Quelle (z. B. in Tests oder bei DB-Anbindung). */
export function setVoteSource(source: VoteSource): void {
  _source = source;
}
