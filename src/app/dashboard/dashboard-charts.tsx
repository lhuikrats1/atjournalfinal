"use client";

import { EquityCurveChart, DailyPnlChart } from "@/components/charts/charts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DailyPnl } from "@/lib/analytics";

export function DashboardCharts({ dailyPnl }: { dailyPnl: DailyPnl[] }) {
  const [activeTab, setActiveTab] = useState<"equity" | "daily">("equity");

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-2 p-1 border border-primary/20 bg-primary/5 w-fit">
        <button
          onClick={() => setActiveTab("equity")}
          className={cn(
            "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === "equity" ? "bg-primary text-background" : "text-primary/40 hover:text-primary hover:bg-primary/10"
          )}
        >
          EQUITY_CURVE
        </button>
        <button
          onClick={() => setActiveTab("daily")}
          className={cn(
            "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === "daily" ? "bg-primary text-background" : "text-primary/40 hover:text-primary hover:bg-primary/10"
          )}
        >
          DAILY_PNL
        </button>
      </div>
      
      <div className="w-full">
        {activeTab === "equity" ? (
          <EquityCurveChart data={dailyPnl} />
        ) : (
          <DailyPnlChart data={dailyPnl} />
        )}
      </div>
    </div>
  );
}
