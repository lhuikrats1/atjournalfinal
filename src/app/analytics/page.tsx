export const dynamic = "force-dynamic";
import { atjournal_db as prisma } from "@/lib/prisma";
import {
  computeCoreStats,
  computeDirectionalStats,
  computeDailyPnl,
  computeMonthlyPnl,
  computeHourlyStats,
  computeDayOfWeekStats,
  computeInstrumentBreakdown,
  computeTagBreakdown,
  computeMaxDrawdown,
  computeBestWorstWindow,
  type RawTrade,
} from "@/lib/analytics";
import { AnalyticsCharts } from "./analytics-charts";
import { TrendingDown, TrendingUp, BarChart3, Shield, Clock, Activity, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
  const MOCK_USER_ID = "user_123";

  const rawTrades = await prisma.trade.findMany({
    where: { userId: MOCK_USER_ID },
    orderBy: { entryTime: "asc" },
  });

  const trades: RawTrade[] = rawTrades.map(t => ({
    ...t,
    entryPrice: Number(t.entryPrice),
    exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
    grossPnl: Number(t.grossPnl),
    commission: Number(t.commission),
    netPnl: Number(t.netPnl),
    tags: t.tags || "[]",
    entryTime: new Date(t.entryTime),
    exitTime: t.exitTime ? new Date(t.exitTime) : null,
  }));

  const stats = computeCoreStats(trades);
  const dir = computeDirectionalStats(trades);
  const dailyPnl = computeDailyPnl(trades);
  const monthlyPnl = computeMonthlyPnl(trades);
  const hourly = computeHourlyStats(trades);
  const dayOfWeek = computeDayOfWeekStats(trades);
  const instruments = computeInstrumentBreakdown(trades);
  const tags = computeTagBreakdown(trades);
  const drawdown = computeMaxDrawdown(trades);
  const windows = computeBestWorstWindow(trades);

  const avgTradesPerDay = dailyPnl.length > 0 ? (stats.totalTrades / dailyPnl.length).toFixed(1) : "0";

  return (
    <div className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40">
      {/* Top Protocol Bar */}
      <div className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <BarChart3 size={16} className="text-primary animate-pulse" />
             <span className="text-[12px] font-black tracking-tighter">Performance Analytics</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
             <div>Total Executions: <span className="text-foreground">{trades.length}</span></div>
             <div>Resolution: High Fidelity</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
           <Shield size={12} />
           Encrypted Vault
        </div>
      </div>

      <div className="flex-1 p-8 space-y-12">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-primary/20 pb-8">
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
               PERFORMANCE<br/>
               <span className="text-primary/20">METRICS</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; Deep Dive into Execution Patterns Across {trades.length} Data Points
             </p>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Comparison Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border border-primary bg-card p-8 space-y-8">
               <div className="flex items-center justify-between border-b border-primary/20 pb-6">
                  <span className="text-[12px] font-black tracking-[0.2em] uppercase flex items-center gap-3">
                    <ArrowUpDown size={18} className="text-primary" />
                    Long vs Short Comparison
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Long Side */}
                 <div className="space-y-6 p-8 border border-primary/10 bg-primary/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <TrendingUp size={20} className="text-primary" />
                          <span className="text-xl font-black tracking-tighter">LONG</span>
                       </div>
                       <span className="text-[10px] font-black opacity-40 uppercase">{dir.longCount} Trades</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Win Rate</p>
                          <p className="text-2xl font-black">{dir.longWinRate.toFixed(1)}%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Profit Factor</p>
                          <p className="text-2xl font-black">{dir.longProfitFactor.toFixed(2)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Avg P&L</p>
                          <p className="text-xl font-black">${dir.longAvgPnl.toFixed(0)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Total P&L</p>
                          <p className={cn("text-xl font-black", dir.longTotalPnl >= 0 ? "text-primary" : "text-destructive")}>
                            ${dir.longTotalPnl.toFixed(0)}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Short Side */}
                 <div className="space-y-6 p-8 border border-primary/10 bg-primary/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <TrendingDown size={20} className="text-primary" />
                          <span className="text-xl font-black tracking-tighter">SHORT</span>
                       </div>
                       <span className="text-[10px] font-black opacity-40 uppercase">{dir.shortCount} Trades</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Win Rate</p>
                          <p className="text-2xl font-black">{dir.shortWinRate.toFixed(1)}%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Profit Factor</p>
                          <p className="text-2xl font-black">{dir.shortProfitFactor.toFixed(2)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Avg P&L</p>
                          <p className="text-xl font-black">${dir.shortAvgPnl.toFixed(0)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black opacity-40 uppercase">Total P&L</p>
                          <p className={cn("text-xl font-black", dir.shortTotalPnl >= 0 ? "text-primary" : "text-destructive")}>
                            ${dir.shortTotalPnl.toFixed(0)}
                          </p>
                       </div>
                    </div>
                 </div>
               </div>

               {/* Edge Detection */}
               <div className="p-6 bg-primary text-background flex items-center gap-6">
                  <div className="size-10 bg-background/20 flex items-center justify-center">
                    <Activity size={20} className="text-background" />
                  </div>
                  <p className="text-[12px] font-bold leading-tight">
                    {dir.longWinRate > dir.shortWinRate
                      ? `EDGE_DETECTED: Long trades showing ${(dir.longWinRate - dir.shortWinRate).toFixed(0)}% performance variance over short side.`
                      : `EDGE_DETECTED: Short trades showing ${(dir.shortWinRate - dir.longWinRate).toFixed(0)}% performance variance over long side.`
                    }
                  </p>
               </div>
            </div>

            {/* Charts Section */}
            <div className="bg-card border border-primary p-8">
               <AnalyticsCharts
                  dailyPnl={dailyPnl}
                  hourly={hourly}
                  dayOfWeek={dayOfWeek}
                  instruments={instruments}
                  monthlyPnl={monthlyPnl}
                  tags={tags}
               />
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4 space-y-8">
             <div className="border border-primary bg-card p-8 space-y-10">
                <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Risk Intelligence</span>
                <div className="grid grid-cols-1 gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Max Drawdown</p>
                      <p className="text-4xl font-black tracking-tighter text-destructive">
                        ${drawdown.maxDrawdown.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-black opacity-40 italic">{drawdown.maxDrawdownPercent}% from local peak</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Average Win</p>
                      <p className="text-4xl font-black tracking-tighter">${stats.avgWin.toFixed(0)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Average Loss</p>
                      <p className="text-4xl font-black tracking-tighter text-destructive">-${stats.avgLoss.toFixed(0)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Trade Frequency</p>
                      <p className="text-4xl font-black tracking-tighter">{avgTradesPerDay}/day</p>
                   </div>
                </div>
             </div>

             <div className="border border-primary bg-card p-8 space-y-8">
                <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Optimal Windows</span>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 border border-primary/10">
                      <Clock size={20} className="text-primary" />
                      <div>
                         <p className="text-[10px] font-black opacity-40 uppercase">Primary Edge</p>
                         <p className="text-[13px] font-black">{windows.best.start}:00 - {windows.best.end}:00</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 border border-primary/10">
                      <Clock size={20} className="text-destructive" />
                      <div>
                         <p className="text-[10px] font-black opacity-40 uppercase">High Risk</p>
                         <p className="text-[13px] font-black text-destructive">{windows.worst.start}:00 - {windows.worst.end}:00</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
