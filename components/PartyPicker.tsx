"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useId } from "react";
import { getActiveParties } from "@/lib/parties";
import type { Party, PartyId } from "@/lib/types";

interface PartyPickerProps {
  selectedId: PartyId | null;
  onSelect: (id: PartyId) => void;
  /** Diese IDs werden ausgegraut und nicht auswählbar dargestellt. */
  disabledIds?: PartyId[];
  /** Optionale Hilfetexte je deaktivierter Partei (z. B. „Bereits als Erstpräferenz gewählt"). */
  disabledReason?: (id: PartyId) => string | undefined;
}

export function PartyPicker({
  selectedId,
  onSelect,
  disabledIds = [],
  disabledReason,
}: PartyPickerProps) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const parties = useMemo(() => getActiveParties(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parties;
    return parties.filter(
      (p) =>
        p.shortName.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q),
    );
  }, [parties, query]);

  const disabledSet = new Set(disabledIds);

  return (
    <div className="space-y-5">
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Parteien durchsuchen
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Partei suchen …"
          className="w-full h-12 rounded-xl border border-line bg-white px-4 pr-10 text-[15px] text-ink placeholder:text-ink-muted shadow-soft focus:outline-none focus:border-ink-soft focus:ring-2 focus:ring-accent/20 transition-all"
          autoComplete="off"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <ul
        role="radiogroup"
        aria-label="Partei wählen"
        className="grid gap-2 sm:gap-2.5"
      >
        {filtered.length === 0 && (
          <li className="text-sm text-ink-muted px-2 py-6 text-center">
            Keine Partei zu „{query}" gefunden.
          </li>
        )}
        {filtered.map((party) => (
          <PartyRow
            key={party.id}
            party={party}
            selected={selectedId === party.id}
            disabled={disabledSet.has(party.id)}
            disabledHint={disabledSet.has(party.id) ? disabledReason?.(party.id) : undefined}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

interface PartyRowProps {
  party: Party;
  selected: boolean;
  disabled: boolean;
  disabledHint?: string;
  onSelect: (id: PartyId) => void;
}

function PartyRow({ party, selected, disabled, disabledHint, onSelect }: PartyRowProps) {
  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => onSelect(party.id)}
        className={[
          "group relative w-full text-left rounded-xl border transition-all duration-200 ease-soft",
          "px-4 py-3.5 sm:px-5 sm:py-4",
          "flex items-center gap-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          disabled
            ? "border-line bg-canvas opacity-55 cursor-not-allowed"
            : selected
              ? "border-ink bg-white shadow-card"
              : "border-line bg-white hover:border-ink-soft hover:shadow-soft",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium text-sm shadow-soft"
          style={{ backgroundColor: party.color }}
        >
          {initials(party.shortName)}
          {selected && (
            <motion.span
              layoutId="party-selected-ring"
              className="absolute inset-0 rounded-full ring-2 ring-ink"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-medium text-ink text-[15px] truncate">
            {party.shortName}
          </span>
          <span className="block text-[13px] text-ink-muted truncate">
            {disabledHint ?? party.fullName}
          </span>
        </span>
        <span
          aria-hidden
          className={[
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
            selected ? "border-ink bg-ink" : "border-line group-hover:border-ink-soft",
          ].join(" ")}
        >
          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="h-2 w-2 rounded-full bg-white"
            />
          )}
        </span>
      </button>
    </li>
  );
}

function initials(name: string): string {
  const cleaned = name.replace(/[^A-Za-zÄÖÜäöüß ]/g, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}
