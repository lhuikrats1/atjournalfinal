export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { Lightbulb, Activity, Brain, Shield, Moon } from "lucide-react";
import { generateCoachingTips, computeCoreStats, computeDirectionalStats, type RawTrade } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function CoachingPage() {
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

  const tips = generateCoachingTips(trades);
  const stats = computeCoreStats(trades);
  const dir = computeDirectionalStats(trades);

  return (
    <div className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40">
      {/* Top Protocol Bar */}
      <div className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <Brain size={16} className="text-primary animate-pulse" />
             <span className="text-[12px] font-black tracking-tighter">Intelligence Briefing</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
             <div>Sample Size: <span className="text-foreground">{trades.length}</span></div>
             <div>Status: Analysis Active</div>
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
               AI<br/>
               <span className="text-primary/20">COACHING</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; Personalized Intelligence Derived from {trades.length} Verified Records
             </p>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Coaching Tips */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border border-primary bg-card p-8 space-y-8">
               <div className="flex items-center justify-between border-b border-primary/20 pb-6">
                  <span className="text-[12px] font-black tracking-[0.2em] uppercase flex items-center gap-3">
                    <Lightbulb size={18} className="text-primary" />
                    Strategic Insights
                  </span>
               </div>
               <div className="space-y-4">
                  {tips.map((tip, i) => (
                    <div key={i} className="group p-6 border border-primary/10 bg-primary/5 hover:border-primary/30 transition-all flex items-start gap-4">
                       <div className="mt-1 size-2 bg-primary animate-pulse shrink-0" />
                       <p className="text-[13px] font-bold leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                          {tip}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="lg:col-span-4 space-y-8">
             <div className="border border-primary bg-card p-8 space-y-10">
                <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Performance Core</span>
                <div className="grid grid-cols-1 gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Win Rate</p>
                      <p className={cn("text-4xl font-black tracking-tighter", stats.winRate >= 50 ? "text-primary" : "text-destructive")}>
                        {stats.winRate.toFixed(1)}%
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Profit Factor</p>
                      <p className="text-4xl font-black tracking-tighter">{stats.profitFactor.toFixed(2)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-30 uppercase">Expectancy</p>
                      <p className={cn("text-4xl font-black tracking-tighter", stats.expectancy >= 0 ? "text-primary" : "text-destructive")}>
                        ${stats.expectancy.toFixed(2)}
                      </p>
                   </div>
                </div>
             </div>

             <div className="border border-primary border-dashed p-8 bg-primary/5">
                <div className="flex items-center gap-4 mb-4">
                   <Activity size={20} className="text-primary opacity-50" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Upcoming Features</span>
                </div>
                <p className="text-[11px] font-bold leading-relaxed opacity-60">
                   AI Narrative Coach: Connect your API keys in settings to unlock weekly personalized narratives powered by GPT-4o / Claude.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
