import { prisma } from "@/lib/prisma";
import { Search, Filter, Download, Plus, Database, Archive, Upload } from "lucide-react";
import { TradeTable } from "@/components/trades/trade-table";
import { ImportVault } from "@/components/trades/import-vault";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
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

export default async function TradesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trades = await prisma.trade.findMany({
    where: { userId: user.id },
    orderBy: { entryTime: "desc" },
  });

  const typedTrades = trades.map(t => ({
    id: t.id,
    instrument: t.instrument,
    direction: t.direction,
    entryPrice: Number(t.entryPrice),
    exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
    quantity: t.quantity,
    entryTime: t.entryTime,
    netPnl: Number(t.netPnl),
  }));

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40 overflow-x-hidden"
    >
      {/* Top Protocol Bar */}
      <motion.div 
        variants={itemVariants}
        className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <Archive size={16} className="text-primary" />
             <span className="text-[12px] font-black tracking-tighter">Vault Index V4</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-60">
            <div>Total Records: {trades.length}</div>
            <div>Status: Encrypted</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2 border border-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all">
            <Filter size={14} strokeWidth={3} />
            Filter Set
          </button>
          <ImportVault />
          <button className="flex items-center gap-2 px-6 py-2 border border-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all">
            <Download size={14} strokeWidth={3} />
            Csv Export
          </button>
        </div>
      </motion.div>

      <div className="flex-1 p-8 space-y-12 bg-card">
        <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-primary/20 pb-8">
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
               Execution<br/>
               <span className="text-primary/20">Archive</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; System Ready For Querying {trades.length} Verified Records
             </p>
           </div>
           
           <div className="relative group w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="QUERY_BY_ID_OR_INSTRUMENT..." 
              className="bg-primary/5 border border-primary py-5 pl-16 pr-6 text-[14px] font-black w-full transition-all outline-none focus:bg-primary/10 placeholder:text-primary/20"
            />
          </div>
        </motion.div>

        {/* Filter Selection HUD */}
        <div className="flex gap-2 p-2 bg-primary/5 border border-primary w-fit">
           {["ALL", "LONG", "SHORT", "WIN", "LOSS"].map(f => (
             <button key={f} className={cn(
               "px-8 py-3 text-[11px] font-black tracking-[0.2em] transition-all",
               f === "ALL" ? "bg-primary text-background shadow-none" : "text-primary/50 hover:text-primary hover:bg-primary/10"
             )}>
               {f}
             </button>
           ))}
        </div>

        <motion.div variants={itemVariants} className="border border-primary bg-background shadow-[20px_20px_0px_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0px_rgba(255,255,255,0.01)]">
          <TradeTable trades={typedTrades} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-auto border-t border-primary/20 p-6 flex justify-between text-[10px] font-black text-primary/30 uppercase tracking-[0.5em]">
        <span>ATJOURNAL_ARCHIVE_CORE_4.2.1</span>
        <span>{new Date().getFullYear()} // LUNAR_SYSTEM</span>
      </motion.div>
    </motion.div>
  );
}
