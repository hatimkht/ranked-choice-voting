"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PartyId, Vote } from "./types";

/**
 * Hält die laufende Stimmabgabe des Nutzers über mehrere Routen hinweg.
 *
 * - Verwendet React Context auf der Client-Seite.
 * - Persistiert nach jedem Update in localStorage, damit Refreshs die
 *   Auswahl nicht verlieren.
 * - Bei Bedarf (z. B. nach Abgabe) kann der State über `reset()` geleert werden.
 */

type DraftVote = {
  firstChoicePartyId: PartyId | null;
  secondChoicePartyId: PartyId | null;
  thirdChoicePartyId: PartyId | null;
  /** Wird auf `true` gesetzt, sobald der Nutzer den Wahlzettel abgegeben hat. */
  submitted: boolean;
};

const EMPTY: DraftVote = {
  firstChoicePartyId: null,
  secondChoicePartyId: null,
  thirdChoicePartyId: null,
  submitted: false,
};

const STORAGE_KEY = "praeferenzwahl.draft.v1";

interface VoteStoreValue {
  draft: DraftVote;
  setFirst: (id: PartyId) => void;
  setSecond: (id: PartyId) => void;
  setThird: (id: PartyId) => void;
  markSubmitted: () => void;
  reset: () => void;
  /** Bequeme Konvertierung in eine vollwertige Stimme — nur gültig nach Abgabe. */
  toVote: () => Vote | null;
}

const VoteStoreContext = createContext<VoteStoreValue | null>(null);

function readInitial(): DraftVote {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DraftVote>;
    return {
      firstChoicePartyId: parsed.firstChoicePartyId ?? null,
      secondChoicePartyId: parsed.secondChoicePartyId ?? null,
      thirdChoicePartyId: parsed.thirdChoicePartyId ?? null,
      submitted: parsed.submitted ?? false,
    };
  } catch {
    return EMPTY;
  }
}

export function VoteStoreProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<DraftVote>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Speicher voll oder Privatmodus — wir ignorieren das stillschweigend.
    }
  }, [draft, hydrated]);

  const setFirst = useCallback((id: PartyId) => {
    setDraft((prev) => {
      // Wenn die neue Erstpräferenz mit einer der nachgelagerten kollidiert,
      // setzen wir die kollidierende zurück.
      const next = { ...prev, firstChoicePartyId: id, submitted: false };
      if (next.secondChoicePartyId === id) next.secondChoicePartyId = null;
      if (next.thirdChoicePartyId === id) next.thirdChoicePartyId = null;
      return next;
    });
  }, []);

  const setSecond = useCallback((id: PartyId) => {
    setDraft((prev) => {
      const next = { ...prev, secondChoicePartyId: id, submitted: false };
      if (next.thirdChoicePartyId === id) next.thirdChoicePartyId = null;
      return next;
    });
  }, []);

  const setThird = useCallback((id: PartyId) => {
    setDraft((prev) => ({ ...prev, thirdChoicePartyId: id, submitted: false }));
  }, []);

  const markSubmitted = useCallback(() => {
    setDraft((prev) => ({ ...prev, submitted: true }));
  }, []);

  const reset = useCallback(() => {
    setDraft(EMPTY);
  }, []);

  const toVote = useCallback((): Vote | null => {
    if (!draft.firstChoicePartyId) return null;
    return {
      firstChoicePartyId: draft.firstChoicePartyId,
      secondChoicePartyId: draft.secondChoicePartyId,
      thirdChoicePartyId: draft.thirdChoicePartyId,
    };
  }, [draft]);

  const value = useMemo<VoteStoreValue>(
    () => ({ draft, setFirst, setSecond, setThird, markSubmitted, reset, toVote }),
    [draft, setFirst, setSecond, setThird, markSubmitted, reset, toVote],
  );

  return <VoteStoreContext.Provider value={value}>{children}</VoteStoreContext.Provider>;
}

export function useVoteStore(): VoteStoreValue {
  const ctx = useContext(VoteStoreContext);
  if (!ctx) {
    throw new Error("useVoteStore muss innerhalb von <VoteStoreProvider> verwendet werden.");
  }
  return ctx;
}
