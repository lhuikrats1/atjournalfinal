"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Target, Activity, Database } from "lucide-react";
import { HudCard } from "@/components/ui/hud-card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Mock Trade Data
  const mockTrades = [
    { date: new Date(), type: "WIN", amount: 1200 },
    { date: subMonths(new Date(), 0), type: "LOSS", amount: -400 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-full p-8 space-y-12 bg-transparent"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-primary/20 pb-8">
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
            Execution<br/>
            <span className="text-primary/20">Calendar</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4 flex items-center gap-2">
             <CalendarIcon size={14} /> &gt; INDEXING_TEMPORAL_VAULT_RECORDS
          </p>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => setCurrentDate(subMonths(currentDate, 1))}
             className="p-3 border border-primary/10 hover:border-primary/40 transition-all text-primary/40 hover:text-primary"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="text-center w-40">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{format(currentDate, "yyyy")}</div>
              <div className="text-2xl font-black uppercase tracking-tighter">{format(currentDate, "MMMM")}</div>
           </div>
           <button 
             onClick={() => setCurrentDate(addMonths(currentDate, 1))}
             className="p-3 border border-primary/10 hover:border-primary/40 transition-all text-primary/40 hover:text-primary"
           >
             <ChevronRight size={20} />
           </button>
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-7 gap-[1px] bg-primary/10 border border-primary/10">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
          <div key={day} className="bg-[#0a0a0a] p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">{day}</span>
          </div>
        ))}
        {days.map((day, i) => {
          const hasTrade = mockTrades.find(t => isSameDay(t.date, day));
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                "aspect-square bg-card/40 p-4 border border-primary/5 group hover:bg-primary/5 transition-all relative overflow-hidden",
                !isSameMonth(day, currentDate) && "opacity-10 pointer-events-none"
              )}
            >
              <span className="text-[12px] font-black opacity-30 group-hover:opacity-100 transition-opacity">{format(day, "d")}</span>
              
              {hasTrade && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                   <div className={cn(
                     "size-2 rounded-full animate-pulse",
                     hasTrade.type === "WIN" ? "bg-primary shadow-[0_0_10px_#fff]" : "bg-destructive shadow-[0_0_10px_#f00]"
                   )} />
                   <span className={cn(
                     "text-[9px] font-black tracking-tighter",
                     hasTrade.type === "WIN" ? "text-primary" : "text-destructive"
                   )}>
                     {hasTrade.type === "WIN" ? "+" : "-"}${Math.abs(hasTrade.amount)}
                   </span>
                </div>
              )}

              {/* Decorative scanline on hover */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/20 opacity-0 group-hover:animate-scanline group-hover:opacity-100" />
            </div>
          );
        })}
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <HudCard className="p-8 space-y-4 border-primary/10 bg-primary/[0.02]">
            <div className="flex items-center gap-3">
               <Target size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Monthly Target</span>
            </div>
            <div className="text-3xl font-black tracking-tighter uppercase">$12,000.00</div>
            <div className="h-1 bg-white/5 w-full">
               <div className="h-full bg-primary w-[65%]" />
            </div>
         </HudCard>

         <HudCard className="p-8 space-y-4 border-primary/10 bg-primary/[0.02]">
            <div className="flex items-center gap-3">
               <Activity size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Winning Percentage</span>
            </div>
            <div className="text-3xl font-black tracking-tighter uppercase">62.4%</div>
            <div className="text-[9px] font-black text-primary/40 uppercase tracking-widest">+4.2% FROM LAST MONTH</div>
         </HudCard>

         <HudCard className="p-8 space-y-4 border-primary/10 bg-primary/[0.02]">
            <div className="flex items-center gap-3">
               <Database size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Data Integrity</span>
            </div>
            <div className="text-3xl font-black tracking-tighter uppercase">VERIFIED</div>
            <div className="text-[9px] font-black text-primary uppercase tracking-widest animate-pulse">SYSTEM_ONLINE_V4</div>
         </HudCard>
      </motion.div>
    </motion.div>
  );
}
