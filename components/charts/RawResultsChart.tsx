"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getParty } from "@/lib/parties";
import { formatNumber, formatPercent } from "@/lib/format";
import type { PartyTally } from "@/lib/types";

interface RawResultsChartProps {
  tally: PartyTally[];
  threshold: number;
  eliminatedIds: string[];
}

/**
 * Vertikales Säulendiagramm der Erstpräferenzen mit eingezeichneter
 * Wahlhürde als horizontaler ReferenceLine. Ausgeschiedene Parteien
 * werden visuell entsättigt dargestellt.
 */
export function RawResultsChart({ tally, threshold, eliminatedIds }: RawResultsChartProps) {
  const eliminatedSet = useMemo(() => new Set(eliminatedIds), [eliminatedIds]);

  const data = useMemo(
    () =>
      tally.map((t) => {
        const party = getParty(t.partyId);
        return {
          partyId: t.partyId,
          name: party?.shortName ?? t.partyId,
          fullName: party?.fullName ?? t.partyId,
          color: party?.color ?? "#999",
          percent: Number(t.percent.toFixed(2)),
          votes: t.votes,
          eliminated: eliminatedSet.has(t.partyId),
        };
      }),
    [tally, eliminatedSet],
  );

  const yMax = Math.max(...data.map((d) => d.percent), threshold + 2);

  return (
    <div className="w-full">
      <div className="h-[360px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid stroke="#E6E5DF" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#3A4150" }}
              tickLine={false}
              axisLine={{ stroke: "#D5D3CB" }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.ceil(yMax + 1)]}
              tickFormatter={(v: number) => `${v} %`}
            />
            <Tooltip content={<TallyTooltip />} cursor={{ fill: "rgba(20,25,35,0.04)" }} />
            <ReferenceLine
              y={threshold}
              stroke="#A2362F"
              strokeDasharray="4 4"
              strokeWidth={1.4}
              label={{
                value: `${threshold}%-Hürde`,
                position: "right",
                fill: "#A2362F",
                fontSize: 11,
              }}
            />
            <Bar dataKey="percent" radius={[5, 5, 0, 0]} maxBarSize={48} animationDuration={700}>
              {data.map((d) => (
                <Cell
                  key={d.partyId}
                  fill={d.color}
                  fillOpacity={d.eliminated ? 0.28 : 1}
                  stroke={d.eliminated ? d.color : "none"}
                  strokeOpacity={d.eliminated ? 0.6 : 0}
                  strokeDasharray={d.eliminated ? "3 3" : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Legend hasEliminated={data.some((d) => d.eliminated)} threshold={threshold} />
    </div>
  );
}

function TallyTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as {
    fullName: string;
    name: string;
    percent: number;
    votes: number;
    eliminated: boolean;
  };
  return (
    <div className="rounded-lg border border-line bg-white px-3.5 py-2.5 shadow-card text-[12px]">
      <div className="font-medium text-ink mb-1">{d.fullName}</div>
      <div className="text-ink-soft tabular-nums">
        {formatPercent(d.percent)} · {formatNumber(d.votes)} Stimmen
      </div>
      {d.eliminated && (
        <div className="mt-1 text-stamp text-[11px] uppercase tracking-label">
          Unter der Hürde
        </div>
      )}
    </div>
  );
}

function Legend({ hasEliminated, threshold }: { hasEliminated: boolean; threshold: number }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
      <span className="flex items-center gap-2">
        <span className="inline-block h-2 w-6 bg-ink-soft rounded-sm" /> Erstpräferenz-Anteil
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-px w-6 border-t border-dashed border-stamp" /> {threshold}%-Hürde
      </span>
      {hasEliminated && (
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-6 rounded-sm border border-dashed"
            style={{ borderColor: "#A2362F", backgroundColor: "rgba(162,54,47,0.18)" }}
          />
          ausgeschieden
        </span>
      )}
    </div>
  );
}
