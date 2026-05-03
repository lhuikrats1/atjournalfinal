"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface DailyPnlData {
  date: string;
  pnl: number;
  cumPnl: number;
}

interface HourlyData {
  label: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
}

interface InstrumentData {
  instrument: string;
  pnl: number;
  tradeCount: number;
}

// Brutalist Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border-2 border-primary p-4 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] dark:shadow-[10px_10px_0px_rgba(255,255,255,0.05)] z-50">
      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 border-b border-primary/10 pb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-[12px] font-black uppercase tracking-tight" style={{ color: entry.color || 'currentColor' }}>
          {entry.name}: {typeof entry.value === "number" ? `$${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
}

export function EquityCurveChart({ data }: { data: DailyPnlData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="currentColor" 
          tick={{ fontSize: 10, fontWeight: 900 }} 
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis 
          stroke="currentColor" 
          tick={{ fontSize: 10, fontWeight: 900 }} 
          tickFormatter={(v) => `$${v}`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'white', strokeWidth: 1 }} />
        <Area
          type="stepAfter"
          dataKey="cumPnl"
          name="EQUITY_VAL"
          stroke="currentColor"
          strokeWidth={3}
          fill="rgba(255,255,255,0.02)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DailyPnlChart({ data }: { data: DailyPnlData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="currentColor" 
          tick={{ fontSize: 10, fontWeight: 900 }} 
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis 
          stroke="currentColor" 
          tick={{ fontSize: 10, fontWeight: 900 }} 
          tickFormatter={(v) => `$${v}`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="pnl" name="PNL_DELTA">
          {data.map((entry, idx) => (
            <Cell 
              key={idx} 
              fill={entry.pnl >= 0 ? "currentColor" : "#ff3333"} 
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HourlyWinRateChart({ data }: { data: HourlyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
        <YAxis stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="winRate" name="WIN_RT">
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.winRate >= 50 ? "currentColor" : "#ff3333"} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HourlyPnlChart({ data }: { data: HourlyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
        <YAxis stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="pnl" name="PNL_VAL">
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.pnl >= 0 ? "currentColor" : "#ff3333"} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InstrumentPieChart({ data }: { data: InstrumentData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="tradeCount"
          nameKey="instrument"
          cx="50%"
          cy="50%"
          outerRadius={100}
          stroke="none"
          animationDuration={1000}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={idx % 2 === 0 ? "currentColor" : "rgba(255,255,255,0.1)"} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DayOfWeekChart({ data }: { data: { label: string; pnl: number; winRate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
        <YAxis stroke="currentColor" tick={{ fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="pnl" name="PNL_SUM">
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.pnl >= 0 ? "currentColor" : "#ff3333"} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
