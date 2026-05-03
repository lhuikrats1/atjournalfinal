"use client";

import { useSettings } from "@/components/providers/settings-provider";

export function ShootingStars() {
  const { showStars } = useSettings();

  if (!showStars) return null;

  return (
    <div className="shooting-stars">
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
    </div>
  );
}
