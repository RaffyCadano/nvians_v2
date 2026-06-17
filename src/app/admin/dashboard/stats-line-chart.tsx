"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, School, UserCheck, Users } from "lucide-react";

export type TrendPoint = { label: string; value: number };

export type TrendSeries = {
  title: string;
  href: string;
  stroke: string;
  color: string;
  bg: string;
  current: number;
  data: TrendPoint[];
};

type StatsLineChartProps = {
  series: TrendSeries[];
};

const CHART_WIDTH = 280;
const CHART_HEIGHT = 72;
const PADDING = { top: 8, right: 8, bottom: 18, left: 8 };

function buildPath(values: number[], max: number, count: number) {
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const step = count > 1 ? innerW / (count - 1) : 0;

  return values
    .map((value, i) => {
      const x = PADDING.left + i * step;
      const y = PADDING.top + innerH - (max > 0 ? (value / max) * innerH : 0);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[], max: number, count: number) {
  const line = buildPath(values, max, count);
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const lastX = PADDING.left + (count - 1) * (count > 1 ? innerW / (count - 1) : 0);
  const baseY = PADDING.top + innerH;
  return `${line} L ${lastX} ${baseY} L ${PADDING.left} ${baseY} Z`;
}

function StatLineChartCard({ item }: { item: TrendSeries }) {
  const Icon = TREND_ICONS[item.title] ?? Users;
  const labels = item.data.map((p) => p.label);
  const values = item.data.map((p) => p.value);
  const max = Math.max(...values, 1);

  return (
    <Link
      href={item.href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 sm:text-sm">{item.title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
            {item.current.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${item.bg}`}>
          <Icon className={`h-5 w-5 ${item.color}`} />
        </div>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="mt-3 h-16 w-full sm:h-[4.5rem]"
        role="img"
        aria-label={`${item.title} six month trend`}
      >
        <line
          x1={PADDING.left}
          y1={CHART_HEIGHT - PADDING.bottom}
          x2={CHART_WIDTH - PADDING.right}
          y2={CHART_HEIGHT - PADDING.bottom}
          stroke="#f3f4f6"
          strokeWidth={1}
        />

        <path d={buildAreaPath(values, max, labels.length)} fill={item.stroke} fillOpacity={0.1} />
        <path
          d={buildPath(values, max, labels.length)}
          fill="none"
          stroke={item.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {labels.map((label, i) => {
          const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
          const step = labels.length > 1 ? innerW / (labels.length - 1) : 0;
          const x = PADDING.left + i * step;
          return (
            <text
              key={label}
              x={x}
              y={CHART_HEIGHT - 4}
              textAnchor="middle"
              className="fill-gray-400 text-[9px]"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </Link>
  );
}

export function StatsLineChart({ series }: StatsLineChartProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {series.map((item) => (
        <StatLineChartCard key={item.title} item={item} />
      ))}
    </section>
  );
}

// Server components cannot pass icon components; map titles to icons on the client.
const TREND_ICONS: Record<string, LucideIcon> = {
  Students: GraduationCap,
  Teachers: UserCheck,
  Classes: School,
  Enrollments: Users,
};
