"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SettingsProvider, useSettings } from "@/components/providers/settings-provider";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { KeyboardManager } from "@/components/providers/keyboard-manager";
import { Sidebar } from "@/components/layout/sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const { showLines } = useSettings();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("seen_splash");
    if (pathname === "/dashboard" && !hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("seen_splash", "true");
    }
  }, [pathname]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <ShootingStars />
      <KeyboardManager />



      {isLoginPage ? (
        <>{children}</>
      ) : (
        <div className="flex w-full min-h-screen relative z-10 overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 bg-transparent relative min-h-screen overflow-x-hidden">
            {children}
          </main>
        </div>
      )}

    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProvidersContent>
          {children}
        </ProvidersContent>
      </SettingsProvider>
    </ThemeProvider>
  );
}
