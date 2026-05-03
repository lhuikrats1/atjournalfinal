"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function KeyboardManager() {
  const router = useRouter();
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(e.key);
      
      // Random navigation on key press as requested
      // We'll limit it to specific keys or just random if pressed quickly
      if (e.key === "Enter" || e.key === " ") {
        // Trigger a fake "loading" sequence or navigate
        console.log("Terminal Command Received:", e.key);
      }

      // Hide key indicator after a while
      setTimeout(() => setLastKeyPressed(null), 500);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!lastKeyPressed) return null;

  return (
    <div className="fixed bottom-12 right-12 z-[10000] pointer-events-none">
      <div className="bg-foreground text-background px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest animate-pulse">
        INPUT_RCVD: {lastKeyPressed === " " ? "SPACE" : lastKeyPressed.toUpperCase()}
      </div>
    </div>
  );
}
