"use client";

import { Shield, CreditCard, Sparkles, ChevronRight, Check, Bitcoin, Wallet } from "lucide-react";
import { HudCard } from "@/components/ui/hud-card";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"MANUAL" | "AUTOMATED">("AUTOMATED");
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "CONNECTING" | "VERIFYING" | "SUCCESS">("IDLE");

  const handlePayment = (method: string) => {
    setPaymentStatus("CONNECTING");
    setTimeout(() => {
      setPaymentStatus("VERIFYING");
      setTimeout(() => {
        setPaymentStatus("SUCCESS");
      }, 2000);
    }, 1500);
  };

  const plans = [
    {
      id: "MANUAL",
      name: "Manual Entry",
      price: "0",
      description: "Basic journaling with manual trade logging.",
      features: ["Manual Trade Entry", "Basic Analytics", "3 Themes", "Lunar Intelligence Lite"],
    },
    {
      id: "AUTOMATED",
      name: "Automated Vault",
      price: "10",
      description: "Full automation via Tradovate API integration.",
      features: [
        "Tradovate API Sync", 
        "Auto-Journaling", 
        "Advanced Risk Metrics", 
        "Weekly AI Narratives",
        "Priority Vault Security"
      ],
      premium: true,
    }
  ];

  return (
    <div className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40">
      {/* SUCCESS MODAL SIMULATION */}
      {paymentStatus !== "IDLE" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-6">
           <div className="max-w-md w-full bg-card border border-primary p-12 text-center space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="size-20 bg-primary/5 border border-primary/20 mx-auto flex items-center justify-center">
                 {paymentStatus === "CONNECTING" && <Wallet className="text-primary animate-bounce" />}
                 {paymentStatus === "VERIFYING" && <Bitcoin className="text-primary animate-spin" />}
                 {paymentStatus === "SUCCESS" && <Check className="text-primary" size={40} strokeWidth={3} />}
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black tracking-tighter uppercase">
                    {paymentStatus === "CONNECTING" && "Connecting Wallet"}
                    {paymentStatus === "VERIFYING" && "Verifying Transaction"}
                    {paymentStatus === "SUCCESS" && "Access Granted"}
                 </h2>
                 <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest">
                    {paymentStatus === "CONNECTING" && "Initializing secure handshake..."}
                    {paymentStatus === "VERIFYING" && "Awaiting on-chain confirmation..."}
                    {paymentStatus === "SUCCESS" && "Automated Vault tier is now active."}
                 </p>
              </div>
              {paymentStatus === "SUCCESS" && (
                 <button 
                   onClick={() => setPaymentStatus("IDLE")}
                   className="w-full bg-primary text-background py-4 text-[10px] font-black uppercase tracking-[0.2em]"
                 >
                    Return to Vault
                 </button>
              )}
           </div>
        </div>
      )}

      {/* Top Protocol Bar */}
      <div className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <CreditCard size={16} className="text-primary animate-pulse" />
             <span className="text-[12px] font-black tracking-tighter">Billing Center</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
             <div>Currency: EUR / Crypto</div>
             <div>Status: Subscription Required</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
           <Shield size={12} />
           Secure Checkout
        </div>
      </div>

      <div className="flex-1 p-8 space-y-12">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-primary/20 pb-8">
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
               VAULT<br/>
               <span className="text-primary/20">SUBSCRIPTION</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; Secure your automated journaling pipeline via decentralized payment
             </p>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={cn(
                "relative group cursor-pointer transition-all duration-500",
                selectedPlan === plan.id ? "scale-[1.02]" : "opacity-60 hover:opacity-80"
              )}
            >
               {plan.premium && (
                 <div className="absolute -top-4 left-8 px-4 py-1 bg-primary text-background text-[9px] font-black uppercase tracking-[0.3em] z-20">
                    Recommended
                 </div>
               )}
               
               <div className={cn(
                 "bg-card border-2 p-10 space-y-8 h-full relative overflow-hidden",
                 selectedPlan === plan.id ? "border-primary" : "border-primary/10"
               )}>
                  {plan.premium && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                  )}

                  <div className="space-y-2">
                     <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{plan.name}</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter">€{plan.price}</span>
                        <span className="text-[12px] font-bold opacity-40">/month</span>
                     </div>
                  </div>

                  <p className="text-[12px] font-bold leading-relaxed opacity-60">
                    {plan.description}
                  </p>

                  <div className="space-y-4 border-t border-primary/10 pt-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="size-4 border border-primary/20 flex items-center justify-center bg-primary/5">
                           <Check size={10} className="text-primary" strokeWidth={4} />
                        </div>
                        <span className="text-[11px] font-bold text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {selectedPlan === plan.id && plan.id === "AUTOMATED" && (
                    <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                       <button 
                         onClick={() => handlePayment("BTC")}
                         className="w-full bg-[#f7931a] text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 border-b-4 border-black/20"
                       >
                          <Bitcoin size={16} />
                          Pay with Bitcoin
                       </button>
                       <button 
                         onClick={() => handlePayment("ETH")}
                         className="w-full bg-[#627eea] text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 border-b-4 border-black/20"
                       >
                          <Wallet size={16} />
                          Pay with Ethereum / USDC
                       </button>
                       <p className="text-[9px] text-center font-bold opacity-30 italic">
                          Automated access granted instantly upon 1 confirmation.
                       </p>
                    </div>
                  )}

                  {plan.id === "MANUAL" && selectedPlan === plan.id && (
                     <button className="w-full border-2 border-primary py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-background transition-all">
                        Active Plan
                     </button>
                  )}
               </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="max-w-2xl p-8 border border-primary/10 bg-primary/5 flex items-start gap-6">
           <Shield size={24} className="text-primary shrink-0 mt-1" />
           <div className="space-y-2">
              <h3 className="text-[12px] font-black uppercase">Encrypted Payment Protocol</h3>
              <p className="text-[11px] font-bold leading-relaxed opacity-60">
                 AtJournal utilizes decentralized payment processing. We do not store credit card data. All subscriptions are verified on-chain. Your Tradovate API keys are encrypted at rest using AES-256-GCM.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
