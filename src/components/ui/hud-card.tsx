"use client";

import { cn } from "@/lib/utils";

interface HudCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HudCard({ title, subtitle, children, className }: HudCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5",
      className
    )}>
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      {title && (
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              {title}
            </h3>
            {subtitle && (
              <p className="text-2xl font-black tracking-tighter">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
