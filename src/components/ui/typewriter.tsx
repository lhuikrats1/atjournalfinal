"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({ text, speed = 30, delay = 0, className }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    if (displayedText.length < text.length) {
      // Faster typing for a "liquid" flow
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);

  return (
    <span className={cn(className, "transition-all duration-75")}>
      {displayedText}
      <span className={cn(
        "inline-block w-1.5 h-4 bg-foreground ml-0.5 -mb-0.5 animate-pulse",
        displayedText.length === text.length && "hidden"
      )} />
    </span>
  );
}

