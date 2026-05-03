"use client";

import { useState, useEffect } from "react";

export function useSettings() {
  const [showStars, setShowStars] = useState(true);
  const [showLines, setShowLines] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedStars = localStorage.getItem("atjournal-show-stars");
    const savedLines = localStorage.getItem("atjournal-show-lines");
    
    if (savedStars !== null) setShowStars(savedStars === "true");
    if (savedLines !== null) setShowLines(savedLines === "true");
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("atjournal-show-stars", String(showStars));
  }, [showStars]);

  useEffect(() => {
    localStorage.setItem("atjournal-show-lines", String(showLines));
  }, [showLines]);

  return {
    showStars,
    setShowStars,
    showLines,
    setShowLines
  };
}
