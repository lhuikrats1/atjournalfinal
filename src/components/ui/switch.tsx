"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted-foreground/20",
        "border border-primary", // Brutalist border
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 bg-background transition-transform",
          checked ? "translate-x-7" : "translate-x-1",
          "border border-primary" // Brutalist handle
        )}
      />
    </button>
  );
}
