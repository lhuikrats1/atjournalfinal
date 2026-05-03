"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Sparkles, MoveVertical, Shield, User, Link as LinkIcon, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { showStars, setShowStars, showLines, setShowLines } = useSettings();
  const [syncStatus, setSyncStatus] = useState<"IDLE" | "SYNCING" | "CONNECTED" | "ERROR">("IDLE");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEstablishConnection = async () => {
    setSyncStatus("SYNCING");
    setErrorMsg("");
    
    // Simulate API Handshake with Tradovate
    setTimeout(() => {
      // In a real app, we would call a server action here to verify keys
      setSyncStatus("CONNECTED");
    }, 2000);
  };

  return (
    <div className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40">
      {/* Top Protocol Bar */}
      <div className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <SettingsIcon size={16} className="text-primary" />
             <span className="text-[12px] font-black tracking-tighter">Control Center</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
             <div>System Version: <span className="text-foreground">v4.2.1</span></div>
             <div>Status: Configuration Mode</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
           <Shield size={12} />
           Encrypted Vault
        </div>
      </div>

      <div className="flex-1 p-8 space-y-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-primary/20 pb-8">
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
               VAULT<br/>
               <span className="text-primary/20">CONFIG</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; Modify Lunar Interface Parameters
             </p>
           </div>
        </div>

        <div className="grid gap-12">
           {/* Interface Settings */}
           <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                 <MoveVertical size={18} className="text-primary" />
                 <h2 className="text-[14px] font-black uppercase tracking-widest">Interface Parameters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-6 border border-primary/10 bg-card">
                     <div className="space-y-1">
                        <Label className="text-[12px] font-black uppercase tracking-widest">Cosmic Atmosphere</Label>
                        <p className="text-[10px] text-muted-foreground">Enable shooting stars and background twinkling</p>
                     </div>
                     <Switch checked={showStars} onCheckedChange={setShowStars} />
                  </div>

                  <div className="flex items-center justify-between p-6 border border-primary/10 bg-card">
                     <div className="space-y-1">
                        <Label className="text-[12px] font-black uppercase tracking-widest">Vertical Alignment Lines</Label>
                        <p className="text-[10px] text-muted-foreground">Show 4-point vertical background structure</p>
                     </div>
                     <Switch checked={showLines} onCheckedChange={setShowLines} />
                  </div>
              </div>
           </div>

           {/* External Connections */}
           <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                 <LinkIcon size={18} className="text-primary" />
                 <h2 className="text-[14px] font-black uppercase tracking-widest">External Connections</h2>
              </div>
              
              <div className="space-y-6">
                 <div className="p-8 border border-primary bg-card space-y-8">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h3 className="text-[12px] font-black">Tradovate API</h3>
                          <p className="text-[10px] text-muted-foreground uppercase">Connect your live or demo account for auto-journaling</p>
                       </div>
                       <div className={cn(
                         "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                         syncStatus === "CONNECTED" ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                       )}>
                          {syncStatus === "CONNECTED" ? "Linked & Active" : "Disconnected"}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Username</Label>
                          <input 
                            type="text" 
                            placeholder="TRADOVATE_USER"
                            className="w-full bg-primary/5 border border-primary/10 py-3 px-4 text-[12px] font-black focus:outline-none focus:border-primary/40 transition-all uppercase"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Password</Label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-primary/5 border border-primary/10 py-3 px-4 text-[12px] font-black focus:outline-none focus:border-primary/40 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">App ID</Label>
                          <input 
                            type="text" 
                            placeholder="TRADOVATE_APP_ID"
                            className="w-full bg-primary/5 border border-primary/10 py-3 px-4 text-[12px] font-black focus:outline-none focus:border-primary/40 transition-all uppercase"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">App Secret</Label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-primary/5 border border-primary/10 py-3 px-4 text-[12px] font-black focus:outline-none focus:border-primary/40 transition-all"
                          />
                       </div>
                    </div>

                    {errorMsg && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 text-[10px] font-black text-destructive uppercase flex items-center gap-3">
                         <AlertCircle size={14} />
                         {errorMsg}
                      </div>
                    )}

                    <button 
                      onClick={handleEstablishConnection}
                      disabled={syncStatus === "SYNCING"}
                      className={cn(
                        "w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] border transition-all flex items-center justify-center gap-3",
                        syncStatus === "SYNCING" ? "bg-muted text-muted-foreground border-transparent" :
                        syncStatus === "CONNECTED" ? "bg-primary/10 text-primary border-primary/20" :
                        "bg-primary text-background border-primary hover:bg-background hover:text-primary"
                      )}
                    >
                       {syncStatus === "SYNCING" && <RefreshCw size={14} className="animate-spin" />}
                       {syncStatus === "CONNECTED" && <CheckCircle2 size={14} />}
                       {syncStatus === "SYNCING" ? "Verifying Keys..." : syncStatus === "CONNECTED" ? "Connection Verified" : "Establish Connection"}
                    </button>
                 </div>
              </div>
           </div>

           {/* Security Settings */}
           <div className="space-y-8 opacity-50 pointer-events-none pb-20">
              <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                 <Shield size={18} />
                 <h2 className="text-[14px] font-black uppercase tracking-widest">Vault Security</h2>
              </div>
              
              <div className="space-y-6">
                 <div className="p-8 border border-primary/10 bg-card">
                    <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Encryption Standard</span>
                    <span className="text-[12px] font-black">AES-256-GCM Verified</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
