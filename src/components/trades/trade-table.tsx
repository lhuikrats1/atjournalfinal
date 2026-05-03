"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Trade {
  id: string;
  instrument: string;
  direction: string;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  entryTime: Date;
  netPnl: number;
}

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  return (
    <div className="w-full border-t border-primary/20">
      <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-primary/20 bg-primary/5">
        <div className="col-span-1">ID</div>
        <div className="col-span-1 text-center">DIR</div>
        <div className="col-span-2">INSTRUMENT</div>
        <div className="col-span-4">STRATEGY_ANALYSIS</div>
        <div className="col-span-2 text-right">TIMESTAMP</div>
        <div className="col-span-2 text-right pr-4">PNL_STATUS</div>
      </div>
      
      <div className="divide-y divide-primary/10">
        {trades.map((trade, i) => (
          <div 
            key={trade.id} 
            className="grid grid-cols-12 px-6 py-5 text-[11px] font-mono hover:bg-primary/5 transition-all group cursor-pointer items-center border-l-2 border-transparent hover:border-primary"
          >
            <div className="col-span-1 text-muted-foreground opacity-30 font-black">
              {String(trades.length - i).padStart(3, '0')}
            </div>
            <div className="col-span-1 text-center">
              <span className={cn(
                "px-2 py-0.5 text-[9px] font-black border",
                trade.direction === "LONG" ? "border-primary text-primary" : "border-destructive text-destructive"
              )}>
                {trade.direction === "LONG" ? "BUY" : "SEL"}
              </span>
            </div>
            <div className="col-span-2 font-black tracking-tighter text-[13px]">
              {trade.instrument}
            </div>
            <div className="col-span-4">
              <div className="border border-primary/20 px-2 py-0.5 inline-block text-[9px] font-black mr-3 bg-primary/5">
                EXEC_V4
              </div>
              <span className="text-foreground/40 group-hover:text-foreground transition-colors uppercase text-[10px] font-black tracking-tight">
                Market order filled at {trade.entryPrice.toFixed(2)}
              </span>
            </div>
            <div className="col-span-2 text-right text-muted-foreground font-black uppercase tracking-widest text-[9px]">
              {format(new Date(trade.entryTime), "yyyy.MM.dd HH:mm")}
            </div>
            <div className="col-span-2 text-right pr-4 flex items-center justify-end gap-4">
              <span className={cn(
                "font-black tabular-nums text-[13px] tracking-tighter",
                trade.netPnl >= 0 ? "text-primary" : "text-destructive"
              )}>
                {trade.netPnl >= 0 ? "+" : ""}{trade.netPnl.toFixed(2)}
              </span>
              <div className={cn(
                "w-2.5 h-2.5",
                trade.netPnl >= 0 ? "bg-primary" : "bg-destructive"
              )} />
            </div>
          </div>
        ))}

        {trades.length === 0 && (
          <div className="py-32 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">
             NO_RECORDS_INDEXED
          </div>
        )}
      </div>

      <div className="border-t border-primary/20 p-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <span className="opacity-30">ARCHIVE_SIZE: {trades.length} RECORDS</span>
        <div className="flex gap-2">
          <button className="border border-primary/20 px-4 py-2 hover:bg-primary hover:text-background transition-all">PREV</button>
          <button className="border border-primary/20 px-4 py-2 hover:bg-primary hover:text-background transition-all">NEXT</button>
        </div>
      </div>
    </div>
  );
}
