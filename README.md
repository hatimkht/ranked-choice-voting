# Präferenzwahl-Simulation

Ein Civic-Tech-Prototyp für ein **hypothetisches Drei-Stimmen-Wahlmodell**.
Bürger:innen geben drei gestaffelte Parteipräferenzen ab. Stimmen für Parteien
unterhalb der 5%-Hürde verfallen nicht — sie wandern auf die jeweils nächste
gültige Präferenz. Das Ergebnis wird transparent inklusive Sitzverteilung
visualisiert.

> **Hinweis.** Die App ist bewusst eine **neutrale Simulation**. Sie ist keine
> echte Wahl, keine offizielle Berechnung und keine Wahlempfehlung.

## Tech-Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion** (Animationen)
- **Recharts** (Säulendiagramme)
- **Keine Datenbank, keine Auth, kein externes Backend** in Version 1

Die Architektur ist so vorbereitet, dass eine spätere Datenbankanbindung
(Postgres, KV, externe API …) ohne Änderungen am UI- oder Simulationscode
möglich ist — siehe [`lib/dataSource.ts`](lib/dataSource.ts).

## Projektstruktur

```
app/
  layout.tsx                # Root-Layout, Fonts, Provider
  globals.css               # Tailwind + Basisstyles
  page.tsx                  # Landingpage
  vote/
    layout.tsx              # Container für den Wahl-Flow
    first/page.tsx          # Erstpräferenz
    second/page.tsx         # Zweitpräferenz
    third/page.tsx          # Drittpräferenz
    review/page.tsx         # Wahlzettel + Stempel + Urnen-Animation
  results/page.tsx          # Auswertung (Diagramme, Transfers, Parlament)

components/
  Header.tsx                # Globale Kopfzeile
  Footer.tsx                # Globale Fußzeile
  Disclaimer.tsx            # Hinweistext "hypothetische Simulation"
  Button.tsx                # Wiederverwendbarer Button (Link/Button-Polymorphie)
  ProgressIndicator.tsx     # Fortschritt im Wahl-Flow
  InfoCard.tsx              # Karten auf der Landingpage
  PartyPicker.tsx           # Suchbare Parteiliste mit Auswahl
  Ballot.tsx                # Wahlzettel im Papierstil
  BallotBox.tsx             # Stilisierte Wahlurne (SVG)
  EliminatedPartiesPanel.tsx
  TransferVisualization.tsx # Transfer-Karten mit animierten Pfaden
  charts/
    RawResultsChart.tsx     # Vertikales Säulendiagramm (Rohverteilung)
    FinalResultsChart.tsx   # Vertikales Säulendiagramm (Finalergebnis)
    ParliamentArc.tsx       # Halbrund-Sitzverteilung als SVG

lib/
  types.ts                  # Geteilte TypeScript-Typen
  parties.ts                # Zentrale Parteikonfiguration + Konstanten
  mockVotes.ts              # Deterministische Mock-Stimmabgaben
  simulation.ts             # Berechnung von Tally, Transfer, Final, Sitzen
  seats.ts                  # Hare-Niemeyer-Sitzzuteilung
  dataSource.ts             # Abstraktion über die Stimmen-Quelle
  voteStore.tsx             # React-Context für die laufende Stimmabgabe
  format.ts                 # Lokalisierte Zahlen-/Prozentformate
```

### Trennung der Verantwortlichkeiten

- **UI-Komponenten** in `components/` — keine Geschäftslogik.
- **Simulation & Rechnen** in `lib/simulation.ts` und `lib/seats.ts` — rein,
  seiteneffektfrei, leicht testbar.
- **Daten** in `lib/mockVotes.ts` (Version 1) hinter `lib/dataSource.ts` (für
  Version 2 austauschbar gegen DB-Adapter).
- **Konfiguration** zentral in `lib/parties.ts`.

## Installation

Voraussetzung: Node.js ≥ 18.18 und npm (oder pnpm/yarn).

```bash
npm install
```

## Lokale Entwicklung

```bash
npm run dev
```

Die App läuft anschließend auf [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

Optional die Typprüfung:

```bash
npm run typecheck
```

## Deployment auf Vercel

1. Repository zu GitHub/GitLab/Bitbucket pushen.
2. Auf [vercel.com/new](https://vercel.com/new) das Repository importieren.
3. Vercel erkennt Next.js automatisch — keine Build-Konfiguration nötig.
4. Auf **Deploy** klicken.

Da Version 1 ohne Datenbank, Auth und externe Services auskommt, sind keine
Environment-Variablen erforderlich.

Alternativ via CLI:

```bash
npx vercel
```

## Erweiterung um eine echte Datenquelle

Um Mock-Daten gegen eine echte Quelle (z. B. Postgres) zu tauschen:

1. In `lib/dataSource.ts` eine neue Implementierung von `VoteSource`
   bereitstellen — z. B. mit Drizzle/Prisma/Kysely.
2. Beim App-Start `setVoteSource(neueQuelle)` aufrufen — etwa über einen
   `instrumentation.ts`-Hook.
3. UI- und Simulationscode bleiben unverändert.

Die `Vote`-Struktur in `lib/types.ts` ist DB-freundlich: drei nullable
`PartyId`-Felder, kein UI-State.

## Modellannahmen

- **Sperrklausel**: 5 % (siehe `VOTE_THRESHOLD_PERCENT` in `lib/parties.ts`).
- **Sitzanzahl im Modell-Parlament**: 100 (siehe `TOTAL_MODEL_SEATS`).
- **Sitzberechnung**: Hare-Niemeyer (Größte-Reste-Verfahren). Bewusst
  vereinfacht — kein Sainte-Laguë, keine Überhang-/Ausgleichsmandate.
- **Spektrumsachse**: jede Partei hat einen Wert `spectrum` (0–100) in
  `lib/parties.ts`. Er wird **ausschließlich** für die Reihenfolge im Halbrund
  verwendet und stellt eine bewusst grobe Modellannahme dar.

## Lizenz / Verwendung

Prototyp für Bildungs- und Demonstrationszwecke.
