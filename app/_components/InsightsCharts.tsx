"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
};

type Props = {
  countries: ChartData[];
  cities: ChartData[];
  cameras: ChartData[];
  lenses: ChartData[];
  growth: { year: string; count: number }[];
};

export function InsightsCharts({
  countries,
  cities,
  cameras,
  lenses,
  growth,
}: Props) {
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
        <h3 className="text-lg font-semibold text-white">
          Most photographed countries
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countries}
              margin={{ left: -24, right: 0, top: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
        <h3 className="text-lg font-semibold text-white">Top city locations</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cities}
              margin={{ left: -24, right: 0, top: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
        <h3 className="text-lg font-semibold text-white">Most used cameras</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cameras}
              margin={{ left: -24, right: 0, top: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
        <h3 className="text-lg font-semibold text-white">
          Photo growth by year
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growth}
              margin={{ left: -16, right: 16, top: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="year" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
