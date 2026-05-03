"use client";

import { useState } from "react";
import { HudCard } from "@/components/ui/hud-card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lock, Mail, ChevronRight, Sparkles, User } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-6 relative font-sans">
      {/* Background Decorative Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.08] dark:opacity-[0.1]">
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-foreground" />
        <div className="absolute left-[40%] top-0 bottom-0 w-[1px] bg-foreground" />
        <div className="absolute left-[60%] top-0 bottom-0 w-[1px] bg-foreground" />
        <div className="absolute left-[80%] top-0 bottom-0 w-[1px] bg-foreground" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-6">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border border-primary/20">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase opacity-80">Initial Enrollment</span>
           </div>
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
               SECURE<br/>
               <span className="text-primary/20">ACCESS</span>
             </h1>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40 italic pt-4">
                Begin your automated journaling journey.
             </p>
           </div>
        </div>

        <HudCard className={cn(
          "p-10 transition-all duration-700 border-primary/20 bg-background/80 backdrop-blur-sm",
          status === "DENIED" && "border-destructive/50 shadow-[20px_20px_0px_rgba(255,51,51,0.05)]",
          status === "GRANTED" && "border-primary/50 shadow-[20px_20px_0px_rgba(255,255,255,0.05)]"
        )}>
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-3">
                  <User size={12} />
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="LUKAS ..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-primary/5 border border-primary/10 py-5 px-6 text-[14px] font-black focus:outline-none focus:border-primary/40 transition-all placeholder:opacity-20 uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-3">
                  <Mail size={12} />
                  Email Identifier
                </label>
                <input 
                  type="email" 
                  placeholder="name@vault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-primary/5 border border-primary/10 py-5 px-6 text-[14px] font-black focus:outline-none focus:border-primary/40 transition-all placeholder:opacity-20 uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-3">
                  <Lock size={12} />
                  Access Key
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-primary/5 border border-primary/10 py-5 px-6 text-[14px] font-black focus:outline-none focus:border-primary/40 transition-all placeholder:opacity-20"
                />
              </div>
            </div>

            {error && (
              <div className="p-5 bg-destructive/10 border border-destructive/20 text-[11px] text-destructive font-black uppercase tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 bg-destructive" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={status === "PROCESSING"}
              className={cn(
                "w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 flex items-center justify-center gap-3 group border-2",
                status === "PROCESSING" ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed" :
                status === "DENIED" ? "bg-destructive text-white border-destructive" :
                status === "GRANTED" ? "bg-primary text-background border-primary" :
                "bg-primary text-background border-primary hover:bg-background hover:text-primary"
              )}
            >
              {status === "PROCESSING" ? "INITIALIZING..." : (
                <>
                  Create Account
                  <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
              Already have a vault? Login
            </Link>
          </div>
        </HudCard>

        <div className="text-center pt-8 border-t border-primary/10">
           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.8em] opacity-20">
              AtJournal Core 4.2.1 // Lunar System
           </span>
        </div>
      </div>
    </div>
  );
}
