"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050507] text-white relative overflow-hidden text-center">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-red-500/5 blur-[120px]" />

      <div className="relative z-10 max-w-sm w-full">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative w-20 h-20 mx-auto mb-8"
        >
          <Image
            src="/brand/logo.png"
            alt="StreakX Logo"
            fill
            className="object-contain grayscale opacity-30"
            priority
          />
        </motion.div>

        <h1 className="text-4xl font-black streak-text font-display tracking-tighter mb-4 uppercase">System Error</h1>
        <p className="text-white/50 mb-10 leading-relaxed font-medium">
          Something went wrong with the engine. No worries—discipline is about getting back up.
        </p>

        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => reset()}
            className="btn-primary w-full py-4 text-base font-bold tracking-tighter uppercase"
          >
            Restart Engine
          </motion.button>
          
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full py-3 text-xs font-black text-white/30 uppercase tracking-[0.2em] hover:text-white/60 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-10">
        <p className="text-[9px] text-white/10 uppercase tracking-[0.3em] font-black break-all">
          ID: {error.digest || "UNKNOWN_ERROR"}
        </p>
      </div>
    </div>
  );
}
