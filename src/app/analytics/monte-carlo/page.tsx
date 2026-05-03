"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dice5, Activity, Target, Shield, ArrowRight, RefreshCcw, Info } from "lucide-react";
import { HudCard } from "@/components/ui/hud-card";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SimulationResult {
  equity: number;
  trades: number;
  trial: number;
}

export default function MonteCarloPage() {
  const [winRate, setWinRate] = useState(50);
  const [riskReward, setRiskReward] = useState(2);
  const [trials, setTrials] = useState(10);
  const [tradeCount, setTradeCount] = useState(100);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState<{ median: number, ruin: number, maxDD: number } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const allTrials = [];
      let ruinCount = 0;
      let totalMaxDD = 0;
      const finalBalances: number[] = [];

      for (let t = 0; t < trials; t++) {
        let balance = initialBalance;
        let peak = initialBalance;
        let maxDD = 0;
        let isRuined = false;
        const trialData = [{ equity: balance, trade: 0, trial: t }];
        
        for (let i = 1; i <= tradeCount; i++) {
          const isWin = Math.random() * 100 < winRate;
          const amountAtRisk = balance * (riskPerTrade / 100);
          
          if (isWin) {
            balance += amountAtRisk * riskReward;
          } else {
            balance -= amountAtRisk;
          }
          
          if (balance <= 0) {
            balance = 0;
            isRuined = true;
          }

          if (balance > peak) peak = balance;
          const dd = (peak - balance) / peak;
          if (dd > maxDD) maxDD = dd;
          
          trialData.push({ equity: Math.round(balance), trade: i, trial: t });
        }
        
        if (isRuined) ruinCount++;
        totalMaxDD += maxDD;
        finalBalances.push(balance);
        allTrials.push(trialData);
      }

      // Format for Recharts (Pivot)
      const formatted = [];
      for (let i = 0; i <= tradeCount; i++) {
        const dataKey: any = { trade: i };
        allTrials.forEach((trial, idx) => {
          dataKey[`trial_${idx}`] = trial[i].equity;
        });
        formatted.push(dataKey);
      }
      
      finalBalances.sort((a, b) => a - b);
      const median = finalBalances[Math.floor(finalBalances.length / 2)];
      
      setStats({
        median,
        ruin: (ruinCount / trials) * 100,
        maxDD: (totalMaxDD / trials) * 100
      });
      setResults(formatted);
      setIsSimulating(false);
    }, 800);
  };

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-full flex flex-col p-8 space-y-12 bg-transparent overflow-x-hidden"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-primary/20 pb-8">
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
            Monte Carlo<br/>
            <span className="text-primary/20">Simulator</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4 flex items-center gap-2">
             <Dice5 size={14} /> &gt; PROJECTING_EQUITY_DISTRIBUTION_V4
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Controls Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
           <HudCard className="p-8 bg-primary/5 border-primary/20 space-y-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span>Win Rate</span>
                       <span className="text-primary">{winRate}%</span>
                    </div>
                    <input 
                      type="range" min="1" max="99" value={winRate} 
                      onChange={(e) => setWinRate(Number(e.target.value))}
                      className="w-full accent-primary h-1 bg-white/10 rounded-none appearance-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span>Risk:Reward</span>
                       <span className="text-primary">{riskReward}:1</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="10" step="0.1" value={riskReward} 
                      onChange={(e) => setRiskReward(Number(e.target.value))}
                      className="w-full accent-primary h-1 bg-white/10 rounded-none appearance-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span>Risk Per Trade</span>
                       <span className="text-primary">{riskPerTrade}%</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="10" step="0.1" value={riskPerTrade} 
                      onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                      className="w-full accent-primary h-1 bg-white/10 rounded-none appearance-none"
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-primary/10 space-y-4">
                 <button 
                   onClick={runSimulation}
                   disabled={isSimulating}
                   className="w-full py-6 bg-primary text-background text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                 >
                    {isSimulating ? <RefreshCcw size={16} className="animate-spin" /> : <Activity size={16} />}
                    RUN_SIMULATION
                 </button>
                 <p className="text-[9px] font-black uppercase opacity-30 text-center tracking-widest">
                    1000_ITERATIONS_PER_PROTOCOL
                 </p>
              </div>
           </HudCard>

           <div className="p-6 border border-primary/10 bg-card space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <Shield size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Risk Analysis</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed opacity-40 uppercase">
                 Simulating the mathematical probability of ruin based on your current execution edge.
              </p>
           </div>
        </motion.div>

         <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
           <HudCard className="p-8 h-[500px] border-primary/20 relative group">
              <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
                 <div className="size-2 bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Projection Matrix</span>
              </div>
              
              {results.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="trade" hide />
                    <YAxis 
                      domain={['auto', 'auto']}
                      stroke="#ffffff20"
                      tick={{ fontSize: 10, fontWeight: 900 }}
                      tickFormatter={(val) => `$${val.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', fontSize: '10px', fontWeight: 900 }}
                      itemStyle={{ color: '#fff' }}
                      labelClassName="hidden"
                    />
                    {Array.from({ length: trials }).map((_, i) => (
                      <Line 
                        key={i}
                        type="monotone" 
                        dataKey={`trial_${i}`} 
                        stroke={i % 2 === 0 ? "#ffffff" : "var(--primary)"} 
                        strokeWidth={1} 
                        dot={false}
                        opacity={i % 2 === 0 ? 0.05 : 0.15}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
                   <Target size={48} strokeWidth={1} />
                   <p className="text-[11px] font-black uppercase tracking-[0.5em]">Awaiting Execution Parameter</p>
                </div>
              )}
           </HudCard>

           {/* Stats Summary Grid */}
           {stats && (
             <div className="grid grid-cols-3 gap-8">
                <div className="p-6 border border-white/5 bg-white/[0.02] space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Median Final</div>
                   <div className="text-3xl font-black tracking-tighter text-primary">${stats.median.toLocaleString()}</div>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.02] space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Prob of Ruin</div>
                   <div className={cn("text-3xl font-black tracking-tighter", stats.ruin > 0 ? "text-destructive" : "text-primary")}>{stats.ruin.toFixed(1)}%</div>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.02] space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Avg Max DD</div>
                   <div className="text-3xl font-black tracking-tighter">{stats.maxDD.toFixed(1)}%</div>
                </div>
             </div>
           )}
        </motion.div>
      </div>

      {/* Footer System Info */}
      <motion.div variants={itemVariants} className="mt-auto border-t border-primary/20 p-6 flex justify-between text-[10px] font-black text-primary/30 uppercase tracking-[0.5em]">
        <span>ATJOURNAL_SIM_PROTO_4.2.1</span>
        <span>{new Date().getFullYear()} // MONTE_CARLO_ENGINE</span>
      </motion.div>
    </motion.div>
  );
}
