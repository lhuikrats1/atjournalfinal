"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Typewriter } from "./typewriter";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showStar, setShowStar] = useState(false);

  useEffect(() => {
    // Show star after a small delay
    const starTimer = setTimeout(() => setShowStar(true), 1000);
    
    // Complete after animation
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 4000);

    return () => {
      clearTimeout(starTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className="relative">
        {showStar && (
          <div className="absolute -top-20 -right-20 w-40 h-40 pointer-events-none overflow-visible">
            <div className="shooting-star !static !w-20 !h-[2px]" style={{ animation: "tail 2000ms ease-in-out forwards, shooting_splash 2000ms ease-in-out forwards" }} />
          </div>
        )}
        <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
          <Typewriter text="Your edge starts today" speed={60} />
        </h1>
      </div>
      
      <style jsx global>{`
        @keyframes shooting_splash {
          0% { transform: translate(-100px, 100px) rotate(-45deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(200px, -200px) rotate(-45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
