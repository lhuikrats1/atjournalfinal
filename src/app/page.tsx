"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Shield, ChevronRight, Sparkles, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative font-sans overflow-hidden">
      {/* Premium Background Context */}
      <div className="absolute inset-0 z-0">
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

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl w-full text-center space-y-16 relative z-10"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border border-primary/20 backdrop-blur-md">
              <Box size={14} className="text-primary" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-80">ATJOURNAL // PROTOCOL_READY</span>
           </div>
           
           <div className="space-y-4">
             <h1 className="text-[10vw] md:text-[80px] font-black tracking-tighter uppercase leading-[0.8] transition-all">
                YOUR EDGE<br/>
                <span className="text-primary/20">STARTS TODAY</span>
             </h1>
             <p className="text-[12px] font-black uppercase tracking-[0.8em] opacity-30 italic pt-4">
                &gt; INITIALIZING_PROFESSIONAL_TRADING_VAULT
             </p>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-6">
           <button 
             onClick={() => router.push("/register")}
             className="group relative px-12 py-6 bg-primary text-background text-[11px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] w-full md:w-auto animate-shimmer"
           >
              <div className="flex items-center justify-center gap-3 relative z-10">
                 <Zap size={16} fill="currentColor" />
                 INITIALIZE_ENROLLMENT
                 <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
              </div>
           </button>

           <button 
             onClick={() => router.push("/login")}
             className="group px-12 py-6 border-2 border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:border-primary hover:bg-primary/5 w-full md:w-auto"
           >
              <div className="flex items-center justify-center gap-3">
                 <Shield size={16} />
                 RE-ESTABLISH_SESSION
              </div>
           </button>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-16 border-t border-primary/5">
           <div className="grid grid-cols-3 gap-12 opacity-20">
              <div className="space-y-2">
                 <div className="text-[10px] font-black uppercase tracking-widest">Auto_Sync</div>
                 <div className="h-[1px] bg-primary/40 w-full" />
              </div>
              <div className="space-y-2">
                 <div className="text-[10px] font-black uppercase tracking-widest">AI_Coaching</div>
                 <div className="h-[1px] bg-primary/40 w-full" />
              </div>
              <div className="space-y-2">
                 <div className="text-[10px] font-black uppercase tracking-widest">Deep_Vault</div>
                 <div className="h-[1px] bg-primary/40 w-full" />
              </div>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-[9px] font-black text-muted-foreground uppercase tracking-[1em] opacity-10">
           LUNAR_SYSTEM_CORE_V.4.2.1
        </motion.div>
      </motion.div>
    </div>
  );
}


