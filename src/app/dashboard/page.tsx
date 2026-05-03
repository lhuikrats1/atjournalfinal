export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Search, TrendingUp, Target, Zap, BarChart2, Activity, Moon, Shield } from "lucide-react";
import { computeCoreStats, computeDailyPnl, computeDirectionalStats, type RawTrade } from "@/lib/analytics";
import { DashboardCharts } from "./dashboard-charts";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import * as motion from "framer-motion/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawTrades = await prisma.trade.findMany({
    where: { userId: user.id },
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-full flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/40 overflow-x-hidden"
    >
      {/* Top Protocol Bar */}
      <motion.div 
        variants={itemVariants}
        className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <Moon size={16} className="text-primary fill-primary animate-pulse" />
             <span className="text-[12px] font-black tracking-tighter">Lunar Protocol v4</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
            <div>Win Rate: <span className="text-primary">{stats.winRate.toFixed(1)}%</span></div>
            <div>Profit Factor: <span className="text-primary">{stats.profitFactor.toFixed(2)}</span></div>
            <div>Net Value: <span className={cn(stats.totalNetPnl >= 0 ? "text-primary" : "text-destructive")}>
              ${stats.totalNetPnl.toLocaleString()}
            </span></div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
              <Shield size={12} />
              Encrypted Vault
           </div>
        </div>
      </motion.div>

      <div className="flex-1 p-8 space-y-12">
        {/* Brutalist Header */}
        <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-primary/20 pb-8">
          <div className="space-y-2">
            <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
              PERFORMANCE<br/>
              <span className="text-primary/20">ANALYTICS</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
               &gt; INDEXING_VAULT_RECORDS_FOR_{trades.length}_EXECUTIONS
            </p>
          </div>
          <div className="flex gap-4">
            <button className="border border-primary px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all">
              System Export
            </button>
            <button className="bg-primary text-background px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
              New Command
            </button>
          </div>
        </motion.div>

        {/* High Density Brutalist Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
            <div className="border border-primary bg-card p-8 group hover:shadow-[0_0_50px_rgba(255,255,255,0.03)] transition-shadow">
               <div className="flex items-center justify-between border-b border-primary/20 pb-6 mb-8">
                  <span className="text-[12px] font-black tracking-[0.2em] uppercase flex items-center gap-3">
                    <Activity size={18} strokeWidth={3} />
                    Equity Flow Stream
                  </span>
                  <div className="flex gap-6 text-[10px] font-black text-primary/40 uppercase">
                    <span>180D Lookback</span>
                    <span>Daily Resolution</span>
                  </div>
               </div>
               <div className="h-[450px] w-full">
                  <DashboardCharts dailyPnl={dailyPnl} />
               </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
               <div className="border border-primary bg-card p-6 space-y-4 hover:bg-primary/5 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Expectancy</span>
                  <div className="text-3xl font-black tabular-nums tracking-tighter font-mono">${stats.expectancy.toFixed(2)}</div>
                  <div className="text-[9px] font-black uppercase opacity-40">AVG_PER_OP</div>
               </div>
               <div className="border border-primary bg-card p-6 space-y-4 hover:bg-primary/5 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Max_Drawdown</span>
                  <div className="text-3xl font-black tabular-nums tracking-tighter font-mono text-destructive">-14.2%</div>
                  <div className="text-[9px] font-black uppercase opacity-40">HIST_LIMIT</div>
               </div>
               <div className="border border-primary bg-card p-6 space-y-4 hover:bg-primary/5 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Sharp_Ratio</span>
                  <div className="text-3xl font-black tabular-nums tracking-tighter font-mono text-primary">2.48</div>
                  <div className="text-[9px] font-black uppercase opacity-40">RISK_ADJ_EFF</div>
               </div>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <div className="border border-primary bg-primary/5 p-8 h-full space-y-12">
               <div className="space-y-6">
                  <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Lunar Intelligence</span>
                  <div className="p-6 bg-card border border-primary/20 space-y-4">
                     <p className="text-[13px] font-bold leading-tight text-foreground">
                        Long Side Exposure is at Max Capacity. Hedging Required.
                     </p>
                     <div className="h-1 bg-primary/20 w-full">
                        <div className="h-full bg-primary w-2/3" />
                     </div>
                  </div>
               </div>

               {/* Live Execution Protocol (Terminal Feature) */}
               <div className="border border-primary bg-card p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                     <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Live Execution Protocol</span>
                     <div className="flex items-center gap-2">
                        <div className="size-1.5 bg-primary animate-ping rounded-full" />
                        <span className="text-[9px] font-black opacity-40 uppercase">Streaming_Live</span>
                     </div>
                  </div>
                  <div className="space-y-3 font-mono text-[10px] leading-relaxed overflow-hidden h-[180px]">
                     <p className="text-primary/60 italic">&gt; Initializing Tradovate WebSocket Stream...</p>
                     <p className="text-primary/40">&gt; [AUTH] Handshake Verified (AppID: ATJ_421)</p>
                     <p className="text-foreground/80">&gt; [SYNC] Successfully synchronized 12 orders from NQ_M5</p>
                     <p className="text-foreground/80">&gt; [MARKET] NQ1! Volatility Index increasing: 2.4% Δ</p>
                     <p className="text-primary">&gt; [STRATEGY] Bullish Divergence detected on ES_1H</p>
                     <p className="text-foreground/40 animate-pulse">&gt; [IDLE] Awaiting next vault execution...</p>
                  </div>
                  <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                     <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">Protocol v4.2 // Node_01</span>
                     <span className="text-[9px] font-black opacity-40 uppercase">Latency: 14ms</span>
                  </div>
               </div>

               <div className="space-y-8 bg-card p-6 border border-primary/10">
                  <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Distribution Matrix</span>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase">
                           <span>LONG_WIN_RATE</span>
                           <span>{dir.longWinRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 border border-primary">
                           <div className="h-full bg-primary" style={{ width: `${dir.longWinRate}%` }} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase">
                           <span>SHORT_WIN_RATE</span>
                           <span>{dir.shortWinRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 border border-primary">
                           <div className="h-full bg-primary/30" style={{ width: `${dir.shortWinRate}%` }} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-12 border-t border-primary/20 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">SYSTEM_FEED</span>
                  <div className="text-[10px] font-black text-primary/40 space-y-2 leading-none uppercase">
                     <div>[{new Date().toLocaleTimeString()}] - SYNC_COMPLETE</div>
                     <div>[{new Date().toLocaleTimeString()}] - VAULT_LOCKED</div>
                     <div>[{new Date().toLocaleTimeString()}] - READY_FOR_EXEC</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
// Trigger build
// Authored by lhuikrats1
