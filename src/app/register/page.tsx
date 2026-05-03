"use client";

import { useState } from "react";
import { HudCard } from "@/components/ui/hud-card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lock, Mail, ChevronRight, Sparkles, User, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"AWAITING" | "PROCESSING" | "DENIED" | "GRANTED">("AWAITING");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("PROCESSING");
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setStatus("DENIED");
      setError(error.message);
      setTimeout(() => setStatus("AWAITING"), 2000);
    } else {
      setStatus("GRANTED");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative font-sans overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        
        {/* Digital Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center space-y-6">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border border-primary/20 backdrop-blur-md">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-80">System Enrollment</span>
           </div>
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
               SECURE<br/>
               <span className="text-primary/20">ACCESS</span>
             </h1>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 italic pt-2">
                Join the automated vault protocol.
             </p>
           </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HudCard className={cn(
            "p-10 transition-all duration-700 border-primary/20 bg-black/40 backdrop-blur-xl relative overflow-hidden",
            status === "DENIED" && "border-destructive/50 shadow-[0_0_50px_rgba(255,51,51,0.1)]",
            status === "GRANTED" && "border-primary/50 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          )}>
            {/* Success Overlay Animation */}
            <AnimatePresence>
              {status === "GRANTED" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-primary flex flex-col items-center justify-center text-background space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <ShieldCheck size={64} strokeWidth={2.5} />
                  </motion.div>
                  <span className="text-[12px] font-black uppercase tracking-[0.4em]">Handshake Success</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 flex items-center gap-3">
                    <User size={10} />
                    Full Identity
                  </label>
                  <input 
                    type="text" 
                    placeholder="LUKAS ..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 py-5 px-6 text-[13px] font-black focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:opacity-10 uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 flex items-center gap-3">
                    <Mail size={10} />
                    Communication Relay
                  </label>
                  <input 
                    type="email" 
                    placeholder="name@vault.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 py-5 px-6 text-[13px] font-black focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:opacity-10 uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 flex items-center gap-3">
                    <Lock size={10} />
                    Encrypted Key
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 py-5 px-6 text-[13px] font-black focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:opacity-10"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-destructive/10 border border-destructive/20 text-[10px] text-destructive font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-destructive animate-pulse" />
                  {error}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={status === "PROCESSING"}
                className={cn(
                  "w-full py-6 text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-700 flex items-center justify-center gap-3 group border-2 relative overflow-hidden",
                  status === "PROCESSING" ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed" :
                  status === "DENIED" ? "bg-destructive text-white border-destructive" :
                  "bg-primary text-background border-primary hover:bg-transparent hover:text-primary"
                )}
              >
                {status === "PROCESSING" ? "INITIALIZING..." : (
                  <>
                    <Zap size={14} className="group-hover:scale-125 transition-transform" />
                    GENERATE_ACCESS
                    <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-10 text-center">
              <Link href="/login" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 hover:text-primary transition-colors">
                Legacy User? <span className="text-primary underline">Secure Login</span>
              </Link>
            </div>
          </HudCard>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center pt-8 border-t border-primary/10">
           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[1em] opacity-10">
              ATJOURNAL_FINANCIAL_CORE // SILICON_VALLEY_DEPLOYMENT
           </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
