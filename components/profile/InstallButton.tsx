"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if ((window as any).__pwaInstallPrompt) setAvailable(true);
    const handler = () => setAvailable(true);
    window.addEventListener("pwa-install-available", handler);
    return () => window.removeEventListener("pwa-install-available", handler);
  }, []);

  if (!available) return null;

  const handleInstall = async () => {
    const prompt = (window as any).__pwaInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      (window as any).__pwaInstallPrompt = null;
      setAvailable(false);
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="w-full mt-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
    >
      <span>⊕</span> Add StreakX to Home Screen
    </button>
  );
}
