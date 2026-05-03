"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  showStars: boolean;
  setShowStars: (value: boolean) => void;
  showLines: boolean;
  setShowLines: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [showStars, setShowStars] = useState(true);
  const [showLines, setShowLines] = useState(true);

  // Load from local storage if available
  useEffect(() => {
    const savedStars = localStorage.getItem("atjournal_stars");
    const savedLines = localStorage.getItem("atjournal_lines");
    if (savedStars !== null) setShowStars(savedStars === "true");
    if (savedLines !== null) setShowLines(savedLines === "true");
  }, []);

  const updateStars = (value: boolean) => {
    setShowStars(value);
    localStorage.setItem("atjournal_stars", String(value));
  };

  const updateLines = (value: boolean) => {
    setShowLines(value);
    localStorage.setItem("atjournal_lines", String(value));
  };

  return (
    <SettingsContext.Provider value={{ 
      showStars, 
      setShowStars: updateStars,
      showLines,
      setShowLines: updateLines
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
