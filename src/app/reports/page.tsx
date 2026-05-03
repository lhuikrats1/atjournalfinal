import { FileText, Download, Clock, Shield, Archive } from "lucide-react";

export default function ReportsPage() {
  const reportTypes = [
    {
      title: "Weekly Intelligence",
      description: "7-day summary: equity curve, win rate, P&L, top/bottom trades, and AI coaching paragraph.",
      icon: FileText,
    },
    {
      title: "Monthly Deep Dive",
      description: "30-day comprehensive analysis: all analytics modules, long/short breakdown, and time heatmap.",
      icon: FileText,
    },
    {
      title: "Custom Range Report",
      description: "Bespoke date range selection with the same depth as the monthly intelligence report.",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-full flex flex-col bg-transparent font-sans selection:bg-primary/40">
      {/* Top Protocol Bar */}
      <div className="border-b border-primary/20 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 pr-8 border-r border-primary/20">
             <FileText size={16} className="text-primary animate-pulse" />
             <span className="text-[12px] font-black tracking-tighter">Report Generator</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
             <div>Template Version: v2.0</div>
             <div>Format: PDF/A-Verified</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
           <Shield size={12} />
           Encrypted Vault
        </div>
      </div>

      <div className="flex-1 p-8 space-y-12">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-primary/20 pb-8">
           <div className="space-y-2">
             <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
               VAULT<br/>
               <span className="text-primary/20">REPORTS</span>
             </h1>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 pt-4">
                &gt; Generate Branded Intelligence Documents for Performance Review
             </p>
           </div>
        </div>

        {/* Report Types */}
        <div className="grid gap-8 lg:grid-cols-3">
          {reportTypes.map((report) => (
            <div key={report.title} className="bg-card border border-primary p-8 space-y-8 flex flex-col">
               <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
                  <div className="size-10 bg-primary/5 flex items-center justify-center border border-primary/10">
                     <report.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-[14px] font-black tracking-widest uppercase">{report.title}</span>
               </div>
               <p className="text-[11px] font-bold leading-relaxed opacity-60 flex-1">
                  {report.description}
               </p>
               <button className="w-full bg-primary text-background py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-background hover:text-primary border border-primary transition-all flex items-center justify-center gap-3">
                  <Download size={14} strokeWidth={3} />
                  Generate Report
               </button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
           {/* Section Preview */}
           <div className="lg:col-span-8 bg-card border border-primary p-8 space-y-8">
              <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Report Composition</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   "Cover Page & Branding",
                   "Executive Summary",
                   "Equity Curve Visualization",
                   "Daily P&L Breakdown",
                   "Long vs Short Variance",
                   "Time-of-Day Heatmap",
                   "Edge Detection Summary",
                   "AI Coaching Narrative",
                   "Verified Execution Log",
                 ].map((section, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 border border-primary/10 bg-primary/5">
                     <span className="text-[10px] font-black opacity-20">{String(i + 1).padStart(2, "0")}</span>
                     <span className="text-[11px] font-black">{section}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* History */}
           <div className="lg:col-span-4 bg-card border border-primary p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-primary/10 pb-6">
                 <span className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">Report History</span>
                 <Archive size={16} className="opacity-20" />
              </div>
              <div className="py-20 text-center space-y-4">
                 <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">No Records Found</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
