"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getParty } from "@/lib/parties";
import { formatNumber, formatPercent } from "@/lib/format";
import type { PartyTally } from "@/lib/types";

interface FinalResultsChartProps {
  tally: PartyTally[];
  threshold: number;
}

export function FinalResultsChart({ tally, threshold }: FinalResultsChartProps) {
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
        };
      }),
    [tally],
  );

  const yMax = Math.max(...data.map((d) => d.percent), threshold + 2);

  return (
    <div className="w-full">
      <div className="h-[360px] sm:h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 28, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid stroke="#E6E5DF" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#171B23" }}
              tickLine={false}
              axisLine={{ stroke: "#D5D3CB" }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.ceil(yMax + 2)]}
              tickFormatter={(v: number) => `${v} %`}
            />
            <Tooltip content={<FinalTooltip />} cursor={{ fill: "rgba(20,25,35,0.04)" }} />
            <ReferenceLine
              y={threshold}
              stroke="#A2362F"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              opacity={0.55}
              label={{
                value: `${threshold}%-Referenz`,
                position: "right",
                fill: "#A2362F",
                fontSize: 10,
                opacity: 0.8,
              }}
            />
            <Bar
              dataKey="percent"
              radius={[6, 6, 0, 0]}
              maxBarSize={68}
              animationDuration={900}
            >
              {data.map((d) => (
                <Cell key={d.partyId} fill={d.color} />
              ))}
              <LabelList
                dataKey="percent"
                position="top"
                formatter={(v: number) => formatPercent(v)}
                style={{ fontSize: 11, fill: "#171B23", fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FinalTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as {
    fullName: string;
    percent: number;
    votes: number;
  };
  return (
    <div className="rounded-lg border border-line bg-white px-3.5 py-2.5 shadow-card text-[12px]">
      <div className="font-medium text-ink mb-1">{d.fullName}</div>
      <div className="text-ink-soft tabular-nums">
        {formatPercent(d.percent)} · {formatNumber(d.votes)} Stimmen
      </div>
    </div>
  );
}
