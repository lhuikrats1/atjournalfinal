"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, Activity, Target, BrainCircuit, ChevronRight, ArrowRight, Database, Globe, HelpCircle, Crown, Lock, Cpu, Server, Network } from "lucide-react";
import { HudCard } from "@/components/ui/hud-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

/* Premium Noise Texture Overlay */
const GlobalStyles = () => (
  <style jsx global>{`
    body::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.04;
      pointer-events: none;
      z-index: 9999;
    }

    /* Advanced Scanline Button Effect */
    .animate-shimmer::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
      z-index: 5;
      animation: scanline 3s linear infinite;
    }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(500%); }
    }
  `}</style>
);

export default function AboutPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const features = [
    {
      title: "AUTOMATED_SYNC",
      desc: "Direct Tradovate API integration. Every fill, every tick, recorded in real-time without manual friction.",
      icon: <Zap className="text-primary" size={24} />,
      color: "bg-primary/5"
    },
    {
      title: "AI_NARRATIVES",
      desc: "Silicon Valley grade LLMs analyze your trade psychology and execution to generate weekly coaching protocols.",
      icon: <BrainCircuit className="text-primary" size={24} />,
      color: "bg-primary/5"
    },
    {
      title: "VAULT_SECURITY",
      desc: "Your data is encrypted at rest using AES-256. Private, decentralized, and built for professional capital.",
      icon: <Shield className="text-primary" size={24} />,
      color: "bg-primary/5"
    },
    {
      title: "LUNAR_ANALYTICS",
      desc: "Deep-divergence metrics beyond simple PnL. Understand your edge in PRE-MARKET vs RTH sessions.",
      icon: <Activity className="text-primary" size={24} />,
      color: "bg-primary/5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-background relative">
      <GlobalStyles />
      {/* Dynamic Cursor Glow */}
      <div 
        className="fixed pointer-events-none z-0 size-[800px] rounded-full opacity-[0.07] blur-[120px] bg-primary transition-all duration-300 ease-out"
        style={{ 
          left: mousePos.x - 400, 
          top: mousePos.y - 400,
        }}
      />

      {/* Background Grid & Glows */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
        
        {/* Digital Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* Floating Login Button (Top Right) */}
      <div className="fixed top-8 right-8 z-[100]">
        <Link href="/login" className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary transition-all">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Access Terminal</span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Establish_Session</span>
          </div>
          <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-background transition-all">
            <Lock size={16} />
          </div>
        </Link>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 space-y-32">
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-60">System Manifesto // AtJournal_v.4</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-8xl lg:text-[9rem] font-black tracking-[calc(-0.06em)] leading-[0.8] uppercase">
                YOUR EDGE<br/>
                <span className="text-primary/20 italic">STARTS TODAY</span>
              </h1>
              <p className="text-[14px] font-black uppercase tracking-[0.8em] opacity-30 italic pt-6">
                &gt; INITIALIZING_PROFESSIONAL_TRADING_VAULT
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl border-l-2 border-primary/20 pl-8 space-y-8">
            <p className="text-xl lg:text-2xl font-medium leading-relaxed opacity-60">
              AtJournal is the terminal for high-performance traders who demand zero friction and absolute clarity. Built by engineers, backed by data, and designed for those who hunt alpha.
            </p>
            <div className="flex gap-6">
               <Link href="/register" className="bg-primary text-background px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:translate-x-2 transition-transform">
                  Initialize Access <ArrowRight size={16} />
               </Link>
               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  <Database size={14} /> Direct API Connectivity
               </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Feature Bento Grid */}
        <section className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
             <div className="h-[2px] w-12 bg-primary" />
             <h2 className="text-[12px] font-black uppercase tracking-[0.6em] opacity-40">The Protocol Stack</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <HudCard className="h-full p-8 space-y-8 bg-white/[0.02] border-white/10 hover:border-primary/40 hover:bg-white/[0.04] transition-all group">
                   <div className="size-12 bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                      {f.icon}
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-lg font-black tracking-tighter uppercase">{f.title}</h3>
                      <p className="text-[12px] font-medium leading-relaxed opacity-50">{f.desc}</p>
                   </div>
                </HudCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Random Facts Section */}
        <section className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
             <div className="h-[2px] w-12 bg-primary" />
             <h2 className="text-[12px] font-black uppercase tracking-[0.6em] opacity-40">System Intel // Did You Know?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <HelpCircle className="text-primary/40" size={20} />
              <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-wider">
                90% of retail traders fail within their first year due to "Emotional Drift". AtJournal uses AI to detect drift before it hits your balance.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <Crown className="text-primary/40" size={20} />
              <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-wider">
                The term "Lunar Brutalist" refers to our design philosophy: raw utility meets cosmic precision. No rounded corners, no wasted space.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
               <Zap className="text-primary/40" size={20} />
               <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-wider">
                Our Tradovate sync protocol is optimized for sub-100ms latency, ensuring your journal reflects your reality instantly.
               </p>
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="grid lg:grid-cols-2 gap-24 items-center border-t border-white/5 pt-32">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative aspect-square bg-primary/5 border border-primary/10 overflow-hidden flex items-center justify-center"
           >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="text-center space-y-4 p-12 relative z-10">
                 <div className="text-8xl font-black text-primary/20 mb-8">99.9%</div>
                 <h4 className="text-[12px] font-black uppercase tracking-[0.5em]">Uptime Guaranteed</h4>
                 <p className="text-[11px] font-medium opacity-40 uppercase tracking-widest max-w-[200px] mx-auto">
                    Global infrastructure built for institutional reliability.
                 </p>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-8 left-8 border border-white/10 p-4 text-[8px] font-mono opacity-20">SYSTEM_UPTIME: 100%</div>
              <div className="absolute bottom-8 right-8 border border-white/10 p-4 text-[8px] font-mono opacity-20">LATENCY: 1.2MS</div>
           </motion.div>

           <div className="space-y-12">
              <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                 BUILT FOR THE<br/>
                 <span className="text-primary">NEXT FRONTIER</span><br/>
                 OF TRADING.
              </h2>
              <div className="space-y-8">
                 <div className="flex gap-6 items-start">
                    <div className="size-8 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">1</div>
                    <p className="text-[14px] font-medium opacity-60 leading-relaxed pt-1">
                       We eliminate the manual overhead of spreadsheet journaling. Focus on your mindset, we handle the math.
                    </p>
                 </div>
                 <div className="flex gap-6 items-start">
                    <div className="size-8 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">2</div>
                    <p className="text-[14px] font-medium opacity-60 leading-relaxed pt-1">
                       Institutional quality analytics delivered in a high-fidelity interface designed for deep focus.
                    </p>
                 </div>
              </div>
              <button className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 group">
                 Read Our Whitepaper <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </section>

        {/* Live Network Status Module (Advanced) */}
        <section className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
             <div className="h-[2px] w-12 bg-primary" />
             <h2 className="text-[12px] font-black uppercase tracking-[0.6em] opacity-40">Live Network Protocol</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Cpu size={20} className="text-primary/40" />
                <span className="text-[10px] font-black text-primary animate-pulse">OPTIMIZED</span>
              </div>
              <div className="space-y-2">
                <div className="text-[24px] font-black tracking-tighter">0.82ms</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Processing Latency</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Server size={20} className="text-primary/40" />
                <span className="text-[10px] font-black text-primary">STABLE</span>
              </div>
              <div className="space-y-2">
                <div className="text-[24px] font-black tracking-tighter">14 Nodes</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Active Compute Clusters</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Network size={20} className="text-primary/40" />
                <span className="text-[10px] font-black text-primary">ENCRYPTED</span>
              </div>
              <div className="space-y-2">
                <div className="text-[24px] font-black tracking-tighter">AES-256</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Quantum Safe Layer</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Globe size={20} className="text-primary/40" />
                <span className="text-[10px] font-black text-primary">GLOBAL</span>
              </div>
              <div className="space-y-2">
                <div className="text-[24px] font-black tracking-tighter">6 Regions</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Deployment Footprint</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary p-12 lg:p-24 text-background text-center space-y-12 relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           </div>
           
           <h2 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.8] relative z-10">
              JOIN THE<br/>VAULT
           </h2>
           <p className="text-[12px] font-black uppercase tracking-[0.5em] opacity-80 max-w-lg mx-auto relative z-10">
              Stop guessing. Start executing with precision. Secure your automated access key today.
           </p>
           <div className="pt-8 relative z-10">
              <Link href="/register" className="inline-block bg-background text-primary px-12 py-6 text-[12px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-transform shadow-2xl">
                 Initialize enrollment
              </Link>
           </div>
        </motion.section>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/10 p-12">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <Sparkles className="text-primary" />
               <span className="text-2xl font-black tracking-tighter uppercase">ATJOURNAL</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
               <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
               <Link href="/about" className="hover:text-primary transition-colors">Manifesto</Link>
               <Link href="#" className="hover:text-primary transition-colors">API Docs</Link>
               <Link href="#" className="hover:text-primary transition-colors">Legal</Link>
            </div>
            <div className="text-[10px] font-bold opacity-20 uppercase tracking-widest">
               © 2026 AtJournal Financial. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}
