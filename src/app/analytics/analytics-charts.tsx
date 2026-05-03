"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EquityCurveChart,
  DailyPnlChart,
  HourlyWinRateChart,
  HourlyPnlChart,
  InstrumentPieChart,
  DayOfWeekChart,
} from "@/components/charts/charts";
import type { DailyPnl, HourlyBucket, DayOfWeekBucket, InstrumentBreakdown, MonthlyPnl, TagBreakdown } from "@/lib/analytics";

interface Props {
  dailyPnl: DailyPnl[];
  hourly: HourlyBucket[];
  dayOfWeek: DayOfWeekBucket[];
  instruments: InstrumentBreakdown[];
  monthlyPnl: MonthlyPnl[];
  tags: TagBreakdown[];
}

export function AnalyticsCharts({ dailyPnl, hourly, dayOfWeek, instruments, monthlyPnl, tags }: Props) {
  return (
    <div className="space-y-6">
      {/* Equity & Daily P&L */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-white">Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="equity">
            <TabsList className="bg-zinc-800/50 border border-zinc-700">
              <TabsTrigger value="equity" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 text-xs">Equity Curve</TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 text-xs">Daily P&L</TabsTrigger>
            </TabsList>
            <TabsContent value="equity" className="mt-4"><EquityCurveChart data={dailyPnl} /></TabsContent>
            <TabsContent value="daily" className="mt-4"><DailyPnlChart data={dailyPnl} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Time Analysis Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Hourly Win Rate</CardTitle>
          </CardHeader>
          <CardContent><HourlyWinRateChart data={hourly} /></CardContent>
        </Card>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Hourly P&L</CardTitle>
          </CardHeader>
          <CardContent><HourlyPnlChart data={hourly} /></CardContent>
        </Card>
      </div>

      {/* Day of Week & Instrument */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Day of Week Performance</CardTitle>
          </CardHeader>
          <CardContent><DayOfWeekChart data={dayOfWeek} /></CardContent>
        </Card>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Instrument Distribution</CardTitle>
          </CardHeader>
          <CardContent><InstrumentPieChart data={instruments} /></CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown & Instrument Table */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {monthlyPnl.map((m) => (
                <div key={m.month} className={`p-3 rounded-lg border text-center ${m.pnl >= 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                  <p className="text-xs text-zinc-500">{m.month}</p>
                  <p className={`text-lg font-bold ${m.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${m.pnl.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-600">{m.tradeCount} trades</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Instrument Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {instruments.map((inst) => (
                <div key={inst.instrument} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white w-10">{inst.instrument}</span>
                    <span className="text-xs text-zinc-500">{inst.tradeCount} trades</span>
                    <span className="text-xs text-zinc-500">WR: {inst.winRate}%</span>
                    <span className="text-xs text-zinc-500">PF: {inst.profitFactor}</span>
                  </div>
                  <span className={`text-sm font-semibold ${inst.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${inst.pnl.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tag Breakdown */}
      {tags.length > 0 && (
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white">Strategy Tag Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {tags.map((tag) => (
                <div key={tag.tag} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <p className="text-sm font-semibold text-indigo-400">#{tag.tag}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Win Rate</span>
                      <span className="text-white">{tag.winRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">P&L</span>
                      <span className={tag.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>${tag.pnl}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">PF</span>
                      <span className="text-white">{tag.profitFactor}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Trades</span>
                      <span className="text-white">{tag.tradeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
