"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  FileText, 
  Lightbulb,
  Menu,
  ChevronLeft,
  Sun,
  Moon,
  LogOut,
  Box,
  Settings,
  Sparkles,
  CreditCard,
  Info,
  Calendar,
  Dice5
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/providers/theme-provider";
import { createClient } from "@/lib/supabase/client";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Trade Journal", icon: History, href: "/trades" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Simulation", icon: Dice5, href: "/analytics/monte-carlo" },
  { label: "Edge Vault", icon: Lightbulb, href: "/coaching" },
  { label: "System Reports", icon: FileText, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
  { label: "Manifesto", icon: Info, href: "/about" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className={cn(
      "shrink-0 sticky left-0 top-0 h-screen flex flex-col bg-card border-r border-primary/10 transition-all duration-300 z-[100]",
      isCollapsed ? "w-16" : "w-48"
    )}>

      {/* Brand Header */}
      <div className="p-4 border-b border-primary/5">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Box size={14} strokeWidth={3} className="text-primary" />
              <span className="text-[12px] font-black tracking-tighter uppercase">ATJOURNAL</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 border border-transparent hover:border-primary/10 transition-all text-foreground/50 hover:text-foreground"
          >
            {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Primary Navigation */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center px-4 py-3 text-[11px] font-black tracking-widest transition-all relative border-b border-primary/5",
                pathname === route.href 
                  ? "bg-primary text-background" 
                  : "text-foreground/60 hover:text-foreground hover:bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <route.icon size={14} strokeWidth={pathname === route.href ? 3 : 2} />
                {!isCollapsed && <span>{route.label}</span>}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* System Footer */}
      <div className="p-4 border-t border-primary/5 space-y-4">
        {!isCollapsed && (
          <div className="px-2 py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic leading-loose">
              Precision in every pivot.
            </p>
          </div>
        )}
        <div className="space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-2 py-2 text-[10px] font-black text-foreground/50 hover:text-foreground border border-transparent hover:border-primary/10 transition-all"
          >
            {theme === "dark" && <Moon size={14} />}
            {theme === "light" && <Sun size={14} />}
            {theme === "midnight" && <Sparkles size={14} className="text-primary" />}
            {!isCollapsed && <span className="capitalize">{theme} Mode</span>}
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 text-[10px] font-black text-foreground/50 hover:text-destructive border border-transparent hover:border-destructive/10 transition-all"
          >
            <LogOut size={14} />
            {!isCollapsed && <span>End Session</span>}
          </button>
        </div>

        {/* Stable Handshake Indicator */}
        {!isCollapsed && (
          <div className="mt-4 px-3 py-4 bg-primary/5 border border-primary/10 group cursor-default">
             <div className="flex items-center gap-3">
                <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-primary">Handshake_Stable</span>
                   <span className="text-[7px] font-mono opacity-30 uppercase tracking-tighter">Node: GLOBAL_S_01</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
